
// Helper to convert mouse coordinates to SVG coordinates
export const getSvgCoords = (clientX: number, clientY: number, svgRef: React.RefObject<SVGSVGElement>) => {
    if (!svgRef.current) return { x: clientX, y: clientY };
    const point = svgRef.current.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const transformedPoint = point.matrixTransform(
        svgRef.current.getScreenCTM()?.inverse()
    );
    return {
        x: transformedPoint.x,
        y: transformedPoint.y,
    };
};

// Helper to convert SVG coordinates back to screen space coordinates
export const getScreenCoords = (svgX: number, svgY: number, svgRef: React.RefObject<SVGSVGElement>) => {
    if (!svgRef.current) return { x: svgX, y: svgY };
    
    const point = svgRef.current.createSVGPoint();
    point.x = svgX;
    point.y = svgY;
    
    const screenCTM = svgRef.current.getScreenCTM();
    const transformedPoint = screenCTM ? point.matrixTransform(screenCTM) : point;
  
    return {
      x: transformedPoint.x,
      y: transformedPoint.y,
    };
  };