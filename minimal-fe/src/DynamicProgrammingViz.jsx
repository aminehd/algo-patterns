import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { renderPointerInfo } from './Utils';

// Parse variables from the current frame for DP visualization
const parseFrameVariables = (variables) => {
  const result = {
    dpTable: null,
    currentRow: -1,
    currentCol: -1,
    isComputing: false,
    subproblemValue: null,
    dimension: '1d', // '1d' or '2d'
  };
  
  try {
    // Determine if we're dealing with a 1D or 2D DP array
    if (variables.dp) {
      const dpValue = variables.dp;
      
      // Check if it's a 2D table
      if (Array.isArray(dpValue) && Array.isArray(dpValue[0])) {
        result.dpTable = dpValue;
        result.dimension = '2d';
      } 
      // Check if it's a 1D array
      else if (Array.isArray(dpValue)) {
        result.dpTable = dpValue;
        result.dimension = '1d';
      }
      // Handle string representation
      else if (typeof dpValue === 'string') {
        try {
          const parsed = JSON.parse(dpValue);
          if (Array.isArray(parsed)) {
            result.dpTable = parsed;
            result.dimension = Array.isArray(parsed[0]) ? '2d' : '1d';
          }
        } catch (e) {
          // If it's not valid JSON, try to clean and parse manually
          console.error("Error parsing DP table:", e);
        }
      }
    }

    // Get current indices being processed
    if (variables.i !== undefined) result.currentRow = parseInt(variables.i);
    if (variables.j !== undefined) result.currentCol = parseInt(variables.j);
    
    // Check if we're in a computation step
    result.isComputing = variables.isComputing === true || variables.computing === true;
    
    // Get current subproblem value if available
    if (variables.currentValue !== undefined) result.subproblemValue = variables.currentValue;
    
  } catch (e) {
    console.error('Error parsing DP variables:', e);
  }
  
  return result;
};

// Render dynamic programming visualization
const DynamicProgrammingViz = ({ frame }) => {
  const vizRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animation configuration
  const animationConfig = {
    duration: 300,
    transitions: {
      cell: 'all 0.5s ease',
    },
    effects: {
      pulse: 'pulse 0.3s'
    }
  };

  useEffect(() => {
    if (!frame || !frame.variables) return;
    
    // Parse the frame data
    const { dpTable, currentRow, currentCol, isComputing, subproblemValue, dimension } = parseFrameVariables(frame.variables);
    
    // Get the visualization container
    const vizContainer = vizRef.current;
    if (!vizContainer || !dpTable) return;
    
    // Clear previous visualization
    d3.select(vizContainer).selectAll('*').remove();
    
    // Set up dimensions
    const margin = { top: 30, right: 20, bottom: 20, left: 40 };
    const width = vizContainer.clientWidth - margin.left - margin.right;
    const height = dimension === '2d' 
      ? Math.min(500, dpTable.length * 50)
      : 100;

    // Create SVG
    const svg = d3.select(vizContainer)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    if (dimension === '1d') {
      // Render 1D DP table
      const cellWidth = Math.min(60, width / dpTable.length);
      const cellHeight = 40;
      
      // Create cells
      const cells = svg.selectAll('.dp-cell')
        .data(dpTable)
        .enter()
        .append('g')
        .attr('class', 'dp-cell')
        .attr('transform', (d, i) => `translate(${i * cellWidth}, 0)`);
      
      // Add rectangles for cells
      cells.append('rect')
        .attr('width', cellWidth - 2)
        .attr('height', cellHeight)
        .attr('rx', 3)
        .attr('fill', (d, i) => {
          if (i === currentRow) return 'rgba(255, 165, 0, 0.6)'; // Current cell
          if (i < currentRow) return 'rgba(46, 204, 113, 0.6)'; // Computed cells
          return 'rgba(108, 122, 137, 0.3)'; // Uncomputed cells
        })
        .attr('stroke', '#2ecc71')
        .attr('stroke-width', 1);
      
      // Add text for cell values
      cells.append('text')
        .attr('x', cellWidth / 2)
        .attr('y', cellHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'monospace')
        .attr('font-size', '14px')
        .attr('fill', '#ddd')
        .text(d => d !== null && d !== undefined ? d : '?');
      
      // Add index numbers
      cells.append('text')
        .attr('x', cellWidth / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'monospace')
        .attr('font-size', '12px')
        .attr('fill', '#888')
        .text((d, i) => i);
        
    } else if (dimension === '2d') {
      // Render 2D DP table
      const cellSize = Math.min(50, width / dpTable[0].length, height / dpTable.length);
      
      // Create a group for each row
      const rows = svg.selectAll('.dp-row')
        .data(dpTable)
        .enter()
        .append('g')
        .attr('class', 'dp-row')
        .attr('transform', (d, i) => `translate(0, ${i * cellSize})`);
      
      // Add row indices
      rows.append('text')
        .attr('x', -15)
        .attr('y', cellSize / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'monospace')
        .attr('font-size', '12px')
        .attr('fill', '#888')
        .text((d, i) => i);
      
      // Create cells for each row
      const cells = rows.selectAll('.dp-cell')
        .data(d => d)
        .enter()
        .append('g')
        .attr('class', 'dp-cell')
        .attr('transform', (d, i) => `translate(${i * cellSize}, 0)`);
      
      // Add column indices (only for the first row)
      svg.selectAll('.col-index')
        .data(dpTable[0])
        .enter()
        .append('text')
        .attr('class', 'col-index')
        .attr('x', (d, i) => i * cellSize + cellSize / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'monospace')
        .attr('font-size', '12px')
        .attr('fill', '#888')
        .text((d, i) => i);
      
      // Add rectangles for cells
      cells.append('rect')
        .attr('width', cellSize - 2)
        .attr('height', cellSize - 2)
        .attr('rx', 3)
        .attr('fill', function(d, i) {
          const rowIndex = this.parentNode.parentNode.__data__ ? 
            dpTable.indexOf(this.parentNode.parentNode.__data__) : -1;
          
          if (rowIndex === currentRow && i === currentCol) return 'rgba(255, 165, 0, 0.6)'; // Current cell
          if ((rowIndex < currentRow) || (rowIndex === currentRow && i < currentCol)) 
            return 'rgba(46, 204, 113, 0.6)'; // Computed cells
          return 'rgba(108, 122, 137, 0.3)'; // Uncomputed cells
        })
        .attr('stroke', '#2ecc71')
        .attr('stroke-width', 1);
      
      // Add text for cell values
      cells.append('text')
        .attr('x', cellSize / 2)
        .attr('y', cellSize / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'monospace')
        .attr('font-size', '12px')
        .attr('fill', '#ddd')
        .text(d => d !== null && d !== undefined ? d : '?');
        
      // Animate current cell if computing
      if (isComputing && currentRow >= 0 && currentCol >= 0) {
        d3.select(vizContainer)
          .selectAll('.dp-cell rect')
          .filter(function(d, i) {
            const rowIndex = this.parentNode.parentNode.__data__ ? 
              dpTable.indexOf(this.parentNode.parentNode.__data__) : -1;
            return rowIndex === currentRow && i === currentCol;
          })
          .transition()
          .duration(animationConfig.duration)
          .attr('fill', 'rgba(255, 165, 0, 0.8)')
          .transition()
          .duration(animationConfig.duration)
          .attr('fill', 'rgba(255, 165, 0, 0.6)');
      }
    }
    
    // Add a legend for the colors
    const legendData = [
      { label: 'Current Cell', color: 'rgba(255, 165, 0, 0.6)' },
      { label: 'Computed Cells', color: 'rgba(46, 204, 113, 0.6)' },
      { label: 'Uncomputed Cells', color: 'rgba(108, 122, 137, 0.3)' }
    ];
    
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 180}, ${-25})`);
    
    const legendItems = legend.selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);
    
    legendItems.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('rx', 3)
      .attr('fill', d => d.color)
      .attr('stroke', '#2ecc71')
      .attr('stroke-width', 1);
    
    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .attr('font-family', 'monospace')
      .attr('font-size', '10px')
      .attr('fill', '#ddd')
      .text(d => d.label);
    
  }, [frame]);

  // Render subproblem information if available
  const renderSubproblemInfo = () => {
    if (!frame || !frame.variables) return null;
    
    const { currentRow, currentCol, subproblemValue, dimension } = parseFrameVariables(frame.variables);
    
    if (dimension === '1d' && currentRow >= 0) {
      return (
        <div className="subproblem-info">
          <p>Computing dp[{currentRow}] = {subproblemValue !== null ? subproblemValue : '?'}</p>
        </div>
      );
    } else if (dimension === '2d' && currentRow >= 0 && currentCol >= 0) {
      return (
        <div className="subproblem-info">
          <p>Computing dp[{currentRow}][{currentCol}] = {subproblemValue !== null ? subproblemValue : '?'}</p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={`dp-visualization ${isAnimating ? 'animating' : ''}`}>
      <h3>Dynamic Programming Visualization</h3>
      <div className="dp-table-container" ref={vizRef}></div>
      {renderSubproblemInfo()}
    </div>
  );
};

export default DynamicProgrammingViz;
