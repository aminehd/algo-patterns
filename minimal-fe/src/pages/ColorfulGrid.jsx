import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ColorfulGrid = () => {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Clear any existing visualization
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current);
    const width = svg.node().getBoundingClientRect().width;
    const height = 400;
    
    // Grid settings
    const squareSize = 40;
    const padding = 10;
    const columns = Math.floor(width / (squareSize + padding));
    const rows = Math.floor(height / (squareSize + padding));
    
    // Vibrant color palette
    const colors = [
      "#ff5252", // red
      "#ff9e22", // orange
      "#ffeb3b", // yellow
      "#00e676", // green
      "#00bcd4", // blue
      "#d500f9", // purple
      "#f50057"  // pink
    ];
    
    // Create squares data
    const squares = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        squares.push({
          x: col * (squareSize + padding) + padding,
          y: row * (squareSize + padding) + padding,
          color: colors[Math.floor(Math.random() * colors.length)],
          frequency: Math.random() * 0.05 + 0.02, // Random frequency for sine wave
          amplitude: Math.random() * 20 + 10, // Random amplitude for rotation
          phaseOffset: Math.random() * Math.PI * 2 // Random phase offset
        });
      }
    }
    
    // Create the squares
    const squareGroups = svg.selectAll(".square")
      .data(squares)
      .enter()
      .append("g")
      .attr("class", "square")
      .attr("transform", d => `translate(${d.x + squareSize/2}, ${d.y + squareSize/2})`);
      
    squareGroups.append("rect")
      .attr("x", -squareSize/2)
      .attr("y", -squareSize/2)
      .attr("width", squareSize)
      .attr("height", squareSize)
      .attr("fill", d => d.color)
      .attr("stroke", "#222")
      .attr("stroke-width", 2)
      .attr("rx", 2)
      .attr("ry", 2);
    
    // Add some accent lines to each square
    squareGroups.append("line")
      .attr("x1", -squareSize/2)
      .attr("y1", -squareSize/2)
      .attr("x2", squareSize/2)
      .attr("y2", squareSize/2)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.6);
    
    // Animation function
    let time = 0;
    
    function animate() {
      time += 1;
      
      squareGroups.attr("transform", d => {
        // Use sine function for rotation
        const angle = d.amplitude * Math.sin(time * d.frequency + d.phaseOffset);
        return `translate(${d.x + squareSize/2}, ${d.y + squareSize/2}) rotate(${angle})`;
      });
      
      // Occasionally change colors
      if (time % 120 === 0) {
        squareGroups.select("rect")
          .transition()
          .duration(1000)
          .attr("fill", () => colors[Math.floor(Math.random() * colors.length)]);
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
    <div style={{ width: '100%', height: '400px' }}>
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

export default ColorfulGrid; 