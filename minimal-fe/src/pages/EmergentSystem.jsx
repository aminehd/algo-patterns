import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const EmergentSystem = () => {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Clear any existing visualization
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current);
    const width = svg.node().getBoundingClientRect().width;
    const height = 350;
    
    // Create background
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#111");
    
    // Create the system container
    const systemGroup = svg.append("g")
      .attr("class", "system");
    
    // Initial single element
    let particles = [{
      id: 0,
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      radius: 5,
      color: "#0f0",
      age: 0,
      maxAge: Infinity
    }];
    
    // System properties
    let time = 0;
    let phase = 0; // 0: single, 1: spawning, 2: growing, 3: connecting, 4: stabilizing
    let maxParticles = 100;
    
    // Rules that change over time
    const rules = {
      repulsion: 100,
      attraction: 50,
      alignment: 0.05,
      maxSpeed: 2,
      connectionDistance: 60,
      spawnRate: 0.1
    };
    
    // Create the initial particle
    const particlesGroup = systemGroup.append("g").attr("class", "particles");
    
    // Create the connections group
    const connectionsGroup = systemGroup.append("g").attr("class", "connections");
    
    // Create text label for current phase
    const phaseText = svg.append("text")
      .attr("class", "phase-label")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("fill", "#0f0")
      .attr("font-family", "monospace")
      .attr("font-size", "12px")
      .text("PHASE 0: GENESIS");
    
    // Render function
    function render() {
      // Update particles
      const particleElements = particlesGroup.selectAll(".particle")
        .data(particles, d => d.id);
      
      particleElements.exit().remove();
      
      particleElements.enter()
        .append("circle")
        .attr("class", "particle")
        .attr("r", d => d.radius)
        .attr("fill", d => d.color)
        .merge(particleElements)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
      
      // Update connections
      if (phase >= 3) {
        const connections = [];
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const d = Math.hypot(
              particles[i].x - particles[j].x,
              particles[i].y - particles[j].y
            );
            if (d < rules.connectionDistance) {
              connections.push({
                source: particles[i],
                target: particles[j],
                strength: 1 - (d / rules.connectionDistance)
              });
            }
          }
        }
        
        const connectionElements = connectionsGroup.selectAll(".connection")
          .data(connections);
        
        connectionElements.exit().remove();
        
        connectionElements.enter()
          .append("line")
          .attr("class", "connection")
          .attr("stroke", "#0f0")
          .attr("stroke-opacity", d => d.strength * 0.5)
          .attr("stroke-width", d => d.strength * 1.5)
          .merge(connectionElements)
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
      }
    }
    
    // Animation function - evolution over time
    function animate() {
      time += 1;
      
      // Progress through phases
      if (time === 100) {
        phase = 1; // Start spawning
        phaseText.text("PHASE 1: MULTIPLICATION");
      } else if (time === 300) {
        phase = 2; // Start growing
        phaseText.text("PHASE 2: DEVELOPMENT");
      } else if (time === 500) {
        phase = 3; // Start connecting
        phaseText.text("PHASE 3: CONNECTION");
      } else if (time === 700) {
        phase = 4; // Stabilizing
        phaseText.text("PHASE 4: STABILIZATION");
      } else if (time === 900) {
        phase = 5; // Final form
        phaseText.text("PHASE 5: HARMONY");
      }
      
      // Apply phase-specific behaviors
      if (phase >= 1 && particles.length < maxParticles && Math.random() < rules.spawnRate) {
        // Spawn new particles
        const parent = particles[Math.floor(Math.random() * particles.length)];
        particles.push({
          id: particles.length,
          x: parent.x + (Math.random() * 20 - 10),
          y: parent.y + (Math.random() * 20 - 10),
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: 3 + Math.random() * 2,
          color: `rgb(${Math.floor(Math.random()*100)}, 255, ${Math.floor(Math.random()*100)})`,
          age: 0,
          maxAge: Infinity
        });
      }
      
      // Update particle positions
      particles.forEach((particle, i) => {
        // Apply forces from other particles
        let ax = 0, ay = 0;
        
        particles.forEach((other, j) => {
          if (i !== j) {
            const dx = other.x - particle.x;
            const dy = other.y - particle.y;
            const distance = Math.max(1, Math.hypot(dx, dy));
            
            if (phase >= 2) {
              // Repulsion (inverse square)
              const repulsionForce = rules.repulsion / (distance * distance);
              ax -= (dx / distance) * repulsionForce;
              ay -= (dy / distance) * repulsionForce;
            }
            
            if (phase >= 3) {
              // Attraction (linear with distance)
              const attractionForce = (distance / width) * rules.attraction;
              ax += (dx / distance) * attractionForce;
              ay += (dy / distance) * attractionForce;
            }
            
            if (phase >= 4) {
              // Alignment (gradual velocity matching)
              ax += (other.vx - particle.vx) * rules.alignment;
              ay += (other.vy - particle.vy) * rules.alignment;
            }
          }
        });
        
        // Update velocity with acceleration
        particle.vx += ax;
        particle.vy += ay;
        
        // Limit speed
        const speed = Math.hypot(particle.vx, particle.vy);
        if (speed > rules.maxSpeed) {
          particle.vx = (particle.vx / speed) * rules.maxSpeed;
          particle.vy = (particle.vy / speed) * rules.maxSpeed;
        }
        
        // Apply velocity
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Handle borders
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;
        
        // Increase age
        particle.age += 1;
        
        // If phase 5, gradually move toward a stable pattern
        if (phase === 5) {
          // Gradually reduce velocity
          particle.vx *= 0.99;
          particle.vy *= 0.99;
          
          // Move toward final positions in a grid-like pattern
          const gridX = width * (i % 10) / 10 + width/20;
          const gridY = height * Math.floor(i / 10) / 10 + height/20;
          
          particle.x += (gridX - particle.x) * 0.01;
          particle.y += (gridY - particle.y) * 0.01;
          
          // Cleanup old connections as it stabilizes
          if (time > 1000 && time % 50 === 0) {
            connectionsGroup.selectAll("*").remove();
          }
        }
      });
      
      // Remove particles that have reached their max age
      particles = particles.filter(p => p.age < p.maxAge);
      
      // Render the updated state
      render();
      
      // Continue animation
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
    <div style={{ width: '100%', height: '350px' }}>
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

export default EmergentSystem; 