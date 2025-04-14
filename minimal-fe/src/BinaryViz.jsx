  import { useRef, useEffect, useState } from 'react';
  import * as d3 from 'd3';
  import CodeVisualization from './CodeVisualization';
  import { renderPointerInfo } from './Utils';
  // Parse variables from the current frame
  const parseFrameVariables = (variables) => {
    const result = {
      array: [],
      pointers: {
        left: -1,
        right: -1,
        mid: -1
      }
    };
    
    try {
      if (variables.arr) {
        // First try to parse the array directly
        try {
          result.array = JSON.parse(variables.arr);
        } catch (e) {
          // If direct parsing fails, try to clean and parse manually
          const cleanedStr = variables.arr.replace(/^\[|\]$/g, '');
          result.array = cleanedStr.split(',').map(item => Number(item.trim()));
        }
      }
      if (variables.left) result.pointers.left = parseInt(variables.left);
      if (variables.right) result.pointers.right = parseInt(variables.right);
      if (variables.mid) result.pointers.mid = parseInt(variables.mid);
    } catch (e) {
      console.error('Error parsing variables:', e);
    }
    
    return result;
  };



  // Render binary search visualization
  const BinarySearchViz = ({ frame }) => {
    const [debugData, setDebugData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);
    const autoPlayRef = useRef(null);
    const codeDisplayRef = useRef(null);
    
    // Animation configuration
    const animationConfig = {
      duration: 300,
      autoPlayInterval: 1000,
      transitions: {
        array: 'all 0.5s ease',
        pointer: 'left 0.5s ease'
      },
      effects: {
        pulse: 'pulse 0.3s'
      }
    };


    const array = frame.variables.arr;
    const left = frame.variables.left;
    const right = frame.variables.right;
    const mid = frame.variables.mid;

    useEffect(() => {
        const variables = frame.variables;

            // Parse the frame data
      // Get the array visualization container
      const vizContainer = document.querySelector('.array-visualization');
      if (!vizContainer) return;
      
      // Clear previous visualization
      d3.select(vizContainer).selectAll('*').remove();
      
      // Parse array data
      let arrayData = [];
      try {
        if (typeof variables.arr === 'string') {
          const cleanedStr = variables.arr.replace(/^\[|\]$/g, '');
          arrayData = cleanedStr.split(',').map(item => Number(item.trim()));
        } else if (Array.isArray(variables.arr)) {
          arrayData = variables.arr;
        }
      } catch (e) {
        console.error('Error parsing array:', e);
        return;
      }
      
      // Set up dimensions
      const margin = { top: 20, right: 20, bottom: 20, left: 20 };
      const width = vizContainer.clientWidth - margin.left - margin.right;
      const height = 100;
      const cellWidth = Math.min(40, width / arrayData.length);
      
      // Create SVG
      const svg = d3.select(vizContainer)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
      
      // Create array cells
      const cells = svg.selectAll('.cell')
        .data(arrayData)
        .enter()
        .append('g')
        .attr('class', 'cell')
        .attr('transform', (d, i) => `translate(${i * cellWidth}, 0)`);
      
      // Add rectangles for cells
      cells.append('rect')
        .attr('width', cellWidth - 2)
        .attr('height', 40)
        .attr('rx', 3)
        .attr('fill', (d, i) => {
          if (i === mid) return 'rgba(255, 255, 0, 0.3)';
          if (i === left) return 'rgba(46, 204, 113, 0.6)'; // Brighter green for left
          if (i === right) return 'rgba(39, 174, 96, 0.6)'; // Darker green for right
          return 'rgba(46, 204, 113, 0.2)'; // Light green for other cells
        })
        .attr('stroke', '#2ecc71')
        .attr('stroke-width', 1)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle');
      
      // Add text for cell values
      cells.append('text')
        .attr('x', cellWidth / 2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'monospace')
        .attr('font-size', '14px')
        .attr('fill', '#ddd')
        .text(d => d);
      
      // Add pointer markers
      const pointers = [
        { name: 'L', index: left, color: 'green' },
        { name: 'M', index: mid, color: 'yellow' },
        { name: 'R', index: right, color: 'red' }
      ];
      
      pointers.forEach(pointer => {
        if (pointer.index !== undefined && pointer.index >= 0 && pointer.index < arrayData.length) {
          svg.append('text')
            .attr('class', `pointer ${pointer.name.toLowerCase()}`)
            .attr('x', pointer.index * cellWidth + cellWidth / 2)
            .attr('y', 60)
            .attr('text-anchor', 'middle')
            .attr('font-family', 'monospace')
            .attr('font-weight', 'bold')
            .attr('font-size', '16px')
            .attr('fill', pointer.color)
            .style('transition', animationConfig.transitions.pointer)
            .text(pointer.name);
        }
      });
      
      // Add index numbers
      cells.append('text')
        .attr('x', cellWidth / 2)
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'monospace')
        .attr('font-size', '10px')
        .attr('fill', '#888')
        .text((d, i) => i);
      
      // Animate the current operation
      if (isAnimating) {
        d3.select(vizContainer).selectAll('.cell')
          .filter((d, i) => i === mid)
          .select('rect')
          .transition()
          .duration(animationConfig.duration)
          .attr('fill', 'rgba(255, 255, 0, 0.6)')
          .transition()
          .duration(animationConfig.duration)
          .attr('fill', 'rgba(255, 255, 0, 0.3)');
      }
        
      }, [array, left, right, mid, isAnimating]);



    


    // Check if current line is 61 (important line we want to highlight)
    const isLine61 = frame.current_line === 61;

    return (
      <div className={`binary-search-viz ${isAnimating ? 'animating' : ''}`}>
        {/* d3 animation of the array mid and left and right pointers*/}

        <div className="array-visualization" ref={useRef()}></div>
        {renderPointerInfo(left, right, mid, frame.variables.target)}



        
        {/* <svg ref={svgRef}></svg> */}
      </div>
    );
  };

export default BinarySearchViz;