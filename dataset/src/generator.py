import requests
import csv
import json
import os
import time

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

# Function to check if a page belongs to relevant categories (filter out "People", etc.)
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
                # Exclude pages with irrelevant categories
                if not any("People" in cat or "Biography" in cat for cat in categories):
                    print(f"Article '{article_title}' is a valid topic.")
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

# Function to build the graph from a seed topic and store in a single CSV/JSON
def build_topic_graph(seed_topic, depth=2, max_new_topics=100, output_csv="topics_combined.csv", output_json="topics_combined.json"):
    print(f"Building topic graph starting from seed topic: {seed_topic} (Depth: {depth}, Max new topics: {max_new_topics})")
    
    existing_graph = load_existing_graph(output_csv)  # Load existing data
    queue = [(seed_topic, 0)]  # Track both the article and its depth
    visited = set(existing_graph)  # Track visited nodes (including previously saved ones)
    new_topics_count = 0
    graph = []

    while queue and new_topics_count < max_new_topics:
        current_article, current_depth = queue.pop(0)
        
        if current_article in visited or current_depth >= depth:
            continue
        
        visited.add(current_article)
        
        # Get valid links
        links = get_links(current_article)
        valid_links = [link for link in links if is_valid_topic(link)]
        
        # Add edges to the graph and queue for deeper exploration
        for link in valid_links:
            if new_topics_count >= max_new_topics:
                print("Reached the maximum number of new topics. Stopping...")
                break
            
            if link not in visited:
                print(f"Adding edge: {current_article} -> {link}")
                graph.append({"source": current_article, "target": link})
                queue.append((link, current_depth + 1))
                new_topics_count += 1  # Increment new topics count
    
    # Save the graph to CSV
    print(f"Saving graph to CSV: {output_csv}")
    try:
        with open(output_csv, mode='a', newline='', encoding='utf-8') as csv_file:  # Use append mode
            fieldnames = ['source', 'target']
            writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
            
            if os.stat(output_csv).st_size == 0:  # Write header only if file is empty
                writer.writeheader()
            
            for edge in graph:
                writer.writerow(edge)
    except Exception as e:
        print(f"Error saving to CSV: {e}")
    
    # Save the graph to JSON
    print(f"Saving graph to JSON: {output_json}")
    try:
        if os.path.exists(output_json):
            with open(output_json, mode='r', encoding='utf-8') as json_file:
                existing_data = json.load(json_file)
        else:
            existing_data = []
        
        existing_data.extend(graph)
        
        with open(output_json, mode='w', encoding='utf-8') as json_file:
            json.dump(existing_data, json_file, indent=4)
    except Exception as e:
        print(f"Error saving to JSON: {e}")
    
    print(f"Graph successfully saved to {output_csv} and {output_json}")

# Start the process with a seed topic (broad range)
seed_topics = ["Technology", "Science", "Mathematics", "History"]

start_time = time.time()  # Track start time

for topic in seed_topics:
    print(f"\nProcessing seed topic: {topic}")
    build_topic_graph(seed_topic=topic, depth=3, max_new_topics=10000, output_csv="topics_combined.csv", output_json="topics_combined.json")

end_time = time.time()  # Track end time

print(f"\nTotal execution time: {end_time - start_time:.2f} seconds")
