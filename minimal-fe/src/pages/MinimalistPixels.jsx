import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const MinimalistPixels = () => {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Clear any existing visualization
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current);
    const width = svg.node().getBoundingClientRect().width;
    const height = 300;
    
    // Create background
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#121212");
    
    // Grid settings - much more minimal
    const cellSize = 10;
    const columns = Math.floor(width / cellSize);
    const rows = Math.floor(height / cellSize);
    
    // Limited monochrome palette with one accent
    const colors = ["#222", "#333", "#444", "#555", "#0f0"];
    
    // Create a sparse grid of pixels
    const cells = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        // Only add cells with a certain probability (sparse)
        if (Math.random() < 0.15) {
          cells.push({
            x: col * cellSize,
            y: row * cellSize,
            color: Math.random() < 0.05 ? "#0f0" : d3.color(colors[Math.floor(Math.random() * 4)]),
            size: cellSize - 1,
            pulseSpeed: Math.random() * 0.01 + 0.005
          });
        }
      }
    }
    
    // Create the pixels
    const pixels = svg.selectAll(".pixel")
      .data(cells)
      .enter()
      .append("rect")
      .attr("class", "pixel")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("width", d => d.size)
      .attr("height", d => d.size)
      .attr("fill", d => d.color)
      .attr("opacity", 0.5);
    
    // Add some minimal connecting lines
    const lineGroup = svg.append("g").attr("class", "lines");
    
    // Animation function - very subtle pulsing
    function animate(elapsed) {
      pixels
        .attr("opacity", d => 0.2 + Math.sin(elapsed * d.pulseSpeed) * 0.2 + 0.2);
      
      // Occasionally connect nearby pixels with lines
      if (Math.floor(elapsed / 1000) % 3 === 0 && Math.floor(elapsed) % 20 === 0) {
        // Clear previous lines
        lineGroup.selectAll("*").remove();
        
        // Draw new lines between some nearby pixels
        for (let i = 0; i < cells.length; i++) {
          for (let j = i + 1; j < cells.length; j++) {
            const dx = cells[i].x - cells[j].x;
            const dy = cells[i].y - cells[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 50 && Math.random() < 0.1) {
              lineGroup.append("line")
                .attr("x1", cells[i].x + cellSize/2)
                .attr("y1", cells[i].y + cellSize/2)
                .attr("x2", cells[j].x + cellSize/2)
                .attr("y2", cells[j].y + cellSize/2)
                .attr("stroke", "#0f0")
                .attr("stroke-width", 0.3)
                .attr("stroke-opacity", 0.2);
            }
          }
        }
      }
      
      requestAnimationFrame(animate);
    }
    
    // Start the animation
    const animationFrame = requestAnimationFrame(animate);
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  return (
    <div style={{ width: '100%', height: '300px' }}>
      <svg 
        ref={svgRef} 
        width="100%" 
        height="100%" 
        style={{ 
          backgroundColor: '#111',
          border: '1px solid #0f0',
          borderRadius: '4px'
        }}
      />
    </div>
  );
};

export default MinimalistPixels; 