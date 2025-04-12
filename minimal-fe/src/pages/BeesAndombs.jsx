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
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create a group for the visualization
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Set up scales
    const x = d3.scaleLinear()
      .domain([0, 2 * Math.PI])
      .range([0, innerWidth]);
    
    const y = d3.scaleLinear()
      .domain([-1.5, 1.5])
      .range([innerHeight, 0]);
    
    // Add X axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight/2})`)
      .call(d3.axisBottom(x).ticks(8).tickFormat(d => `${Math.round(d * 180 / Math.PI)}°`))
      .style("color", "#00ff00");
    
    // Add Y axis
    g.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .style("color", "#00ff00");
    
    // Add grid lines
    g.append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(y.ticks(10))
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", d => y(d))
      .attr("y2", d => y(d))
      .attr("stroke", "#333")
      .attr("stroke-dasharray", "3,3");
    
    // Create line generators
    const sineLine = d3.line()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .curve(d3.curveCardinal);
    
    const cosineLine = d3.line()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .curve(d3.curveCardinal);
    
    const tangentLine = d3.line()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .curve(d3.curveCardinal);
    
    // Generate data points
    const generateData = () => {
      const sineData = [];
      const cosineData = [];
      const tangentData = [];
      
      for (let i = 0; i <= 100; i++) {
        const angle = (i / 100) * 2 * Math.PI;
        
        sineData.push({
          x: angle,
          y: Math.sin(angle)
        });
        
        cosineData.push({
          x: angle,
          y: Math.cos(angle)
        });
        
        // Only add tangent values where they're within our y domain
        if (Math.abs(Math.tan(angle)) <= 10) {
          tangentData.push({
            x: angle,
            y: Math.tan(angle)
          });
        }
      }
      
      return { sineData, cosineData, tangentData };
    };
    
    const { sineData, cosineData, tangentData } = generateData();
    
    // Create the paths
    const sinePath = g.append("path")
      .datum(sineData)
      .attr("fill", "none")
      .attr("stroke", "#ff6ec7")
      .attr("stroke-width", 3)
      .attr("d", sineLine);
    
    const cosinePath = g.append("path")
      .datum(cosineData)
      .attr("fill", "none")
      .attr("stroke", "#7fff7f")
      .attr("stroke-width", 3)
      .attr("d", cosineLine);
    
    const tangentPath = g.append("path")
      .datum(tangentData)
      .attr("fill", "none")
      .attr("stroke", "#ffcc00")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5")
      .attr("d", tangentLine);
    
    // Add interactive angle indicator
    const angleGroup = g.append("g");
    
    const angleArc = angleGroup.append("path")
      .attr("fill", "none")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1.5);
    
    const angleLine = angleGroup.append("line")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1.5);
    
    const angleText = angleGroup.append("text")
      .attr("fill", "#ffffff")
      .attr("font-size", "12px");
    
    // Add points that show the current values
    const sinePoint = g.append("circle")
      .attr("r", 6)
      .attr("fill", "#ff6ec7");
    
    const cosinePoint = g.append("circle")
      .attr("r", 6)
      .attr("fill", "#7fff7f");
    
    const tangentPoint = g.append("circle")
      .attr("r", 6)
      .attr("fill", "#ffcc00");
    
    // Add value labels
    const sineLabel = g.append("text")
      .attr("fill", "#ff6ec7")
      .attr("font-size", "12px");
    
    const cosineLabel = g.append("text")
      .attr("fill", "#7fff7f")
      .attr("font-size", "12px");
    
    const tangentLabel = g.append("text")
      .attr("fill", "#ffcc00")
      .attr("font-size", "12px");
    
    // Add legend
    const legend = g.append("g")
      .attr("transform", `translate(${innerWidth - 120}, 20)`);
    
    legend.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "#ff6ec7");
    
    legend.append("text")
      .attr("x", 20)
      .attr("y", 12.5)
      .text("sin(θ)")
      .attr("fill", "#ff6ec7");
    
    legend.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("y", 20)
      .attr("fill", "#7fff7f");
    
    legend.append("text")
      .attr("x", 20)
      .attr("y", 32.5)
      .text("cos(θ)")
      .attr("fill", "#7fff7f");
    
    legend.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("y", 40)
      .attr("fill", "#ffcc00");
    
    legend.append("text")
      .attr("x", 20)
      .attr("y", 52.5)
      .text("tan(θ)")
      .attr("fill", "#ffcc00");
    
    // Add title
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", -5)
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff")
      .style("font-size", "16px")
      .text("Trigonometric Functions");
    
    // Animation function
    let angle = 0;
    
    const animate = () => {
      angle = (angle + 0.01) % (2 * Math.PI);
      
      // Calculate values at current angle
      const sineValue = Math.sin(angle);
      const cosineValue = Math.cos(angle);
      const tangentValue = Math.tan(angle);
      
      // Update points
      sinePoint
        .attr("cx", x(angle))
        .attr("cy", y(sineValue));
      
      cosinePoint
        .attr("cx", x(angle))
        .attr("cy", y(cosineValue));
      
      if (Math.abs(tangentValue) <= 10) {
        tangentPoint
          .attr("cx", x(angle))
          .attr("cy", y(tangentValue))
          .attr("opacity", 1);
      } else {
        tangentPoint.attr("opacity", 0);
      }
      
      // Update angle indicator
      angleLine
        .attr("x1", x(0))
        .attr("y1", y(0))
        .attr("x2", x(0) + Math.cos(angle) * 40)
        .attr("y2", y(0) - Math.sin(angle) * 40);
      
      const arcPath = d3.arc()
        .innerRadius(0)
        .outerRadius(30)
        .startAngle(0)
        .endAngle(angle);
      
      angleArc
        .attr("d", arcPath)
        .attr("transform", `translate(${x(0)},${y(0)})`);
      
      angleText
        .attr("x", x(0) + Math.cos(angle/2) * 20)
        .attr("y", y(0) - Math.sin(angle/2) * 20)
        .text(`${Math.round(angle * 180 / Math.PI)}°`);
      
      // Update value labels
      sineLabel
        .attr("x", x(angle) + 10)
        .attr("y", y(sineValue))
        .text(`sin(θ) = ${sineValue.toFixed(2)}`);
      
      cosineLabel
        .attr("x", x(angle) + 10)
        .attr("y", y(cosineValue))
        .text(`cos(θ) = ${cosineValue.toFixed(2)}`);
      
      if (Math.abs(tangentValue) <= 10) {
        tangentLabel
          .attr("x", x(angle) + 10)
          .attr("y", y(tangentValue))
          .text(`tan(θ) = ${tangentValue.toFixed(2)}`)
          .attr("opacity", 1);
      } else {
        tangentLabel.attr("opacity", 0);
      }
    };
    
    // Start animation
    const timer = d3.interval(animate, 50);
    
    // Clean up on unmount
    return () => {
      timer.stop();
    };
  }, []);
  
  return (
    <div className="sinus-animation" >
      <svg ref={svgRef} width="100%" height="100%" style={{ backgroundColor: '#111' }}></svg>
    </div>
  );
};

export default SinusAnimation;