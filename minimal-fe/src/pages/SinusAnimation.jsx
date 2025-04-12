import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const SinusAnimation = () => {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Clear any existing visualization
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current);
    const width = svg.node().getBoundingClientRect().width;
    const height = 200; // Reduced to half height (was 400)
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    
    // Create a group for the visualization
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Set up scales
    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width - margin.left - margin.right]);
    
    const y = d3.scaleLinear()
      .domain([-1.5, 1.5])
      .range([height - margin.top - margin.bottom, 0]);
    
    // Add X axis
    g.append("g")
      .attr("transform", `translate(0,${(height - margin.top - margin.bottom) / 2})`)
      .call(d3.axisBottom(x).ticks(10))
      .style("color", "#00ff00");
    
    // Add Y axis
    g.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .style("color", "#00ff00");
    
    // Create data points for sine wave
    const generateSineWave = (phase) => {
      return Array.from({ length: 101 }, (_, i) => ({
        x: i,
        y: Math.sin(i * 0.1 + phase)
      }));
    };
    
    // Create data points for cosine wave
    const generateCosineWave = (phase) => {
      return Array.from({ length: 101 }, (_, i) => ({
        x: i,
        y: Math.cos(i * 0.1 + phase)
      }));
    };
    
    // Line generator for sine wave
    const sineLine = d3.line()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .curve(d3.curveCardinal);
    
    // Line generator for cosine wave
    const cosineLine = d3.line()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .curve(d3.curveCardinal);
    
    // Create the sine path
    const sinePath = g.append("path")
      .attr("fill", "none")
      .attr("stroke", "#ff6ec7")
      .attr("stroke-width", 3)
      .attr("d", sineLine(generateSineWave(0)));
    
    // Create the cosine path
    const cosinePath = g.append("path")
      .attr("fill", "none")
      .attr("stroke", "#7fff7f")
      .attr("stroke-width", 3)
      .attr("d", cosineLine(generateCosineWave(0)));
    
    // Add dots that follow the sine and cosine waves
    const sineCircle = g.append("circle")
      .attr("r", 8)
      .attr("fill", "#ff6ec7");
    
    const cosineCircle = g.append("circle")
      .attr("r", 8)
      .attr("fill", "#7fff7f");
    
    // Add legend
    const legend = g.append("g")
      .attr("transform", `translate(${width - margin.left - margin.right - 100}, 20)`);
    
    legend.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "#ff6ec7");
    
    legend.append("text")
      .attr("x", 20)
      .attr("y", 12.5)
      .text("Sine Wave")
      .attr("fill", "#ff6ec7");
    
    legend.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("y", 20)
      .attr("fill", "#7fff7f");
    
    legend.append("text")
      .attr("x", 20)
      .attr("y", 32.5)
      .text("Cosine Wave")
      .attr("fill", "#7fff7f");
    
    // Add title
    g.append("text")
      .attr("x", (width - margin.left - margin.right) / 2)
      .attr("y", -5)
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff")
      .style("font-size", "16px")
      .text("Sine & Cosine Wave Animation");
    
    // Animation function
    let phase = 0;
    
    const animate = () => {
      phase += 0.05;
      
      // Update sine wave
      const sineData = generateSineWave(phase);
      sinePath.attr("d", sineLine(sineData));
      
      // Update cosine wave
      const cosineData = generateCosineWave(phase);
      cosinePath.attr("d", cosineLine(cosineData));
      
      // Update circle positions
      const sinePos = sineData[30]; // Position at x=30
      sineCircle
        .attr("cx", x(sinePos.x))
        .attr("cy", y(sinePos.y));
      
      const cosinePos = cosineData[70]; // Position at x=70
      cosineCircle
        .attr("cx", x(cosinePos.x))
        .attr("cy", y(cosinePos.y));
      
      // Add trailing effect
      g.append("circle")
        .attr("cx", x(sinePos.x))
        .attr("cy", y(sinePos.y))
        .attr("r", 3)
        .attr("fill", "#ff6ec7")
        .attr("opacity", 0.7)
        .transition()
        .duration(1000)
        .attr("r", 1)
        .attr("opacity", 0)
        .remove();
      
      g.append("circle")
        .attr("cx", x(cosinePos.x))
        .attr("cy", y(cosinePos.y))
        .attr("r", 3)
        .attr("fill", "#7fff7f")
        .attr("opacity", 0.7)
        .transition()
        .duration(1000)
        .attr("r", 1)
        .attr("opacity", 0)
        .remove();
    };
    
    // Start animation
    const timer = d3.interval(animate, 50);
    
    // Clean up on unmount
    return () => {
      timer.stop();
    };
  }, []);
  
  return (
    <div >
      <svg ref={svgRef} width="100%" height="400px" style={{ backgroundColor: '#111' }}></svg>
    </div>
  );
};

export default SinusAnimation;