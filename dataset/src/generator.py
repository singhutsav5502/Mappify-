import requests
import csv
import json
import os
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from threading import Lock
import multiprocessing  # To use system core count

# Thread-safe lock for shared data structures
lock = Lock()

# Base file names
LEAF_NODE_BASE = "leaf_nodes_"
COMBINED_JSON_FILE = "combined_topics.json"

# Function to get links from a Wikipedia page using the Wikipedia API
def get_links(article_title):
    print(f"Fetching links from article: {article_title}")
    
    url = "https://en.wikipedia.org/w/api.php"
    
    # Parameters for fetching the links
    params_links = {
        "action": "query",
        "titles": article_title,
        "prop": "links",
        "format": "json",
        "pllimit": "max"
    }
    
    try:
        response_links = requests.get(url, params=params_links).json()
        pages_links = response_links['query']['pages']
        
        links = []
        
        # Extract links
        for page_id, page_info in pages_links.items():
            if 'links' in page_info:
                for link in page_info['links']:
                    links.append(link['title'])
        
        print(f"Found {len(links)} links in article: {article_title}")
        return links
    except Exception as e:
        print(f"Error fetching links from {article_title}: {e}")
        return []

# Function to check if a page belongs to relevant categories (relaxed criteria)
def is_valid_topic(article_title):
    print(f"Checking categories for: {article_title}")
    
    url = "https://en.wikipedia.org/w/api.php"
    
    # Parameters for fetching the categories
    params_category = {
        "action": "query",
        "titles": article_title,
        "prop": "categories",
        "format": "json"
    }
    
    try:
        response_category = requests.get(url, params=params_category).json()
        pages_category = response_category['query']['pages']
        
        for page_id, page_info in pages_category.items():
            if 'categories' in page_info:
                categories = [category['title'] for category in page_info['categories']]
                # Allow most topics, relaxing the criteria
                if "People" in categories or "Biography" in categories:
                    print(f"Article '{article_title}' is considered valid, even though it's about a person.")
                    return True

                print(f"Article '{article_title}' is a valid topic by default.")
                return True
        
        print(f"Article '{article_title}' is NOT a valid topic.")
        return False
    except Exception as e:
        print(f"Error checking categories for {article_title}: {e}")
        return False

# Function to load the existing graph from CSV to avoid re-processing
def load_existing_graph(output_csv):
    existing_graph = set()
    
    if os.path.exists(output_csv):
        print(f"Loading existing dataset from: {output_csv}")
        with open(output_csv, mode='r', encoding='utf-8') as csv_file:
            reader = csv.DictReader(csv_file)
            for row in reader:
                existing_graph.add(row['source'])
                existing_graph.add(row['target'])
    
    print(f"Loaded {len(existing_graph)} topics from the existing dataset.")
    return existing_graph

# Function to load previously saved leaf nodes
def load_leaf_nodes(leaf_node_file, depth):
    if os.path.exists(leaf_node_file):
        with open(leaf_node_file, 'r', encoding='utf-8') as file:
            leaf_node_titles = json.load(file)
        # Create a list of tuples with {article_name, 0, depth}
        leaf_nodes = [(title, 0, depth) for title in leaf_node_titles]
        print(f"Loaded {len(leaf_node_titles)} leaf nodes from the file: {leaf_node_file}.")
        return leaf_nodes
    else:
        print("No leaf nodes found. Starting fresh.")
        return []

# Function to save leaf nodes for future continuation
def save_leaf_nodes(leaf_nodes, leaf_node_file):
    # Extract just the article names for saving
    leaf_node_titles = [node[0] for node in leaf_nodes]
    with open(leaf_node_file, 'w', encoding='utf-8') as file:
        json.dump(leaf_node_titles, file, indent=4)  # Save only titles
    print(f"Saved {len(leaf_node_titles)} leaf nodes for future use in: {leaf_node_file}.")

# Function to save edges in JSON format
def save_edges_to_json(graph, json_file):
    if os.path.exists(json_file):
        with open(json_file, 'r', encoding='utf-8') as file:
            existing_edges = json.load(file)
    else:
        existing_edges = []

    existing_edges.extend(graph)

    with open(json_file, 'w', encoding='utf-8') as file:
        json.dump(existing_edges, file, indent=4)

    print(f"Saved {len(graph)} edges to {json_file}.")

# Thread function to process a single article and its links
def process_article(article_info, visited, graph, max_new_topics, queue, new_topic_counter, leaf_nodes):
    # Debugging: print the article_info to check its structure
    print(f"Processing article info: {article_info}")

    # Ensure we unpack only if there are exactly three elements
    if len(article_info) != 3:
        print(f"Invalid article_info structure: {article_info}")
        return
    
    current_article, current_depth, depth = article_info

    # Check if current_depth is an integer
    if not isinstance(current_depth, int):
        print(f"current_depth is not an integer: {current_depth}")
        return

    # If current_depth is >= depth or max new topics reached, save as leaf node
    if current_depth >= depth or new_topic_counter["count"] >= max_new_topics:
        with lock:
            leaf_nodes.append(article_info)  # Save the current article as a leaf node
        return
    
    with lock:
        visited.add(current_article)

    # Get valid links
    links = get_links(current_article)
    
    # Limit to only the first x valid links
    valid_links = []
    additional_links = []

    for link in links:
        if len(valid_links) < max_new_topics:  # Check validity for only the first x links
            if is_valid_topic(link):
                valid_links.append(link)
        else:
            additional_links.append(link)  # Any extra links are treated as additional links

    # If there are no valid links, this is a leaf node
    if not valid_links:
        with lock:
            leaf_nodes.append(article_info)  # Save the current article as a leaf node
        return

    # Add edges to the graph
    with lock:
        for link in valid_links:
            # Add an edge from the current article to the link
            if link in visited:
                print(f"Adding edge (existing): {current_article} -> {link} (already visited)")
                graph.append({"source": current_article, "target": link})  # Edge to an already visited article
            else:
                if new_topic_counter["count"] >= max_new_topics:
                    print("Reached the maximum number of new topics. Stopping...")
                    # Add the remaining topics as leaf nodes
                    remaining_links = [link for link in valid_links if link not in visited]
                    leaf_nodes.extend([(link, current_depth + 1, depth) for link in remaining_links])  # Add remaining links as leaf nodes
                    leaf_nodes.extend([(link, current_depth + 1, depth) for link in additional_links])  # Add additional links as leaf nodes
                    return

                print(f"Adding edge: {current_article} -> {link}")
                graph.append({"source": current_article, "target": link})
                queue.append((link, current_depth + 1, depth))  # Add the next article with incremented depth
                new_topic_counter["count"] += 1  # Increment the new topic counter for new topics

        # Add additional links as leaf nodes
        leaf_nodes.extend([(link, current_depth + 1, depth) for link in additional_links])  # Ensure additional links match the tuple structure
        # leaf_nodes.extend([(link, current_depth + 1, depth) for link in valid_links])  # Ensure additional links match the tuple structure

# Function to build the graph from a seed topic and store in a single CSV/JSON
def build_topic_graph(seed_topic, depth=2, max_new_topics=100, output_csv="topics_combined.csv"):
    print(f"Building topic graph starting from seed topic: {seed_topic} (Depth: {depth}, Max new topics: {max_new_topics})")
    
    leaf_node_file = f"{LEAF_NODE_BASE}{seed_topic.replace(' ', '_')}.json"  # Unique file for each seed topic
    existing_graph = load_existing_graph(output_csv)  # Load existing data
    leaf_nodes = load_leaf_nodes(leaf_node_file, depth)  # Load previously saved leaf nodes (if any)
    
    # If there are no saved leaf nodes, start from the seed topic
    if not leaf_nodes:
        queue = [(seed_topic, 0, depth)]  # Track the article, its depth, and max depth
    else:
        queue = leaf_nodes  # Resume from the last saved leaf nodes
    
    visited = set(existing_graph)  # Track visited nodes (including previously saved ones)
    graph = []
    new_topic_counter = {"count": 0}  # Dictionary to track the count of new topics
    leaf_nodes = []  # Reset leaf nodes to capture new ones
    
    # Multithreading setup (using system core count for max workers)
    num_workers = multiprocessing.cpu_count()
    print(f"Using {num_workers} threads for parallel processing.")
    
    with ThreadPoolExecutor(max_workers=num_workers) as executor:
        futures = []
        
        while queue and new_topic_counter["count"] < max_new_topics:
            while queue and len(futures) < num_workers:  # Batch multiple articles to be processed at once
                article_info = queue.pop(0)
                futures.append(executor.submit(process_article, article_info, visited, graph, max_new_topics, queue, new_topic_counter, leaf_nodes))
            
            # Wait for the current batch of futures to complete
            for future in as_completed(futures):
                future.result()  # Ensure any exception is raised if it occurs within a thread

            futures.clear()  # Clear completed futures

            # Log progress after each batch
            print(f"Processed {new_topic_counter['count']} new topics so far.")
        
        print(f"Finished processing. Total new topics found: {new_topic_counter['count']}")

    # Save the graph data to CSV
    with open(output_csv, mode='a', newline='', encoding='utf-8') as csv_file:
        fieldnames = ['source', 'target']
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        
        # Write header only if the file is empty
        if os.stat(output_csv).st_size == 0:
            writer.writeheader()
        
        for edge in graph:
            writer.writerow(edge)

    print(f"Saved {len(graph)} edges to {output_csv}.")

    # Save edges in JSON format
    save_edges_to_json(graph, COMBINED_JSON_FILE)

    # Save leaf nodes for future continuation
    save_leaf_nodes(leaf_nodes, leaf_node_file)

# seed_topics = ["Technology", "Science", "Mathematics", "History", "Arts", "Humanities", "Philosophy", "Politics" ]
seed_topics = ["Technology", "Science" ]

# Set max_new_topics to ensure you want 10 for each topic
max_new_topics_per_topic = 10000

start_time = time.time()  # Track start time

for topic in seed_topics:
    print(f"\nProcessing seed topic: {topic}")
    build_topic_graph(seed_topic=topic, depth=1, max_new_topics=max_new_topics_per_topic)

end_time = time.time()  # Track end time

print(f"\nTotal execution time: {end_time - start_time:.2f} seconds")
