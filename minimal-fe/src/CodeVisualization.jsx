// Code visualization component using D3
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const CodeVisualization = ({ frame }) => {
  const svgRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (!frame || !frame.source_lines) return;

    // Clear any existing visualization
    d3.select(svgRef.current).selectAll('*').remove();

    // Set up dimensions
    const margin = { top: 10, right: 10, bottom: 10, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = frame.source_lines.length * 25;

    // Create SVG element
    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add code lines
    frame.source_lines.forEach((line, i) => {
      const lineNumber = frame.start_line + i;
      const isCurrentLine = lineNumber === frame.current_line;
      const isTargetLine = lineNumber === 61; // Special line of interest
      
      const lineGroup = svg.append('g')
        .attr('transform', `translate(0, ${i * 25})`)
        .attr('class', `code-line ${isCurrentLine ? 'current-line' : ''} ${isTargetLine ? 'target-line' : ''}`);
      
      // Add line number
      lineGroup.append('text')
        .attr('x', -30)
        .attr('y', 15)
        .attr('text-anchor', 'end')
        .attr('class', 'line-number')
        .style('font-size', '12px')
        .style('fill', '#aaa')  // Lighter color for line numbers
        .text(lineNumber + ':');
      
      // Add arrow for current line
      if (isCurrentLine) {
        lineGroup.append('text')
          .attr('x', -10)
          .attr('y', 15)
          .attr('class', 'code-arrow')
          .style('font-size', '14px')
          .style('fill', '#f55')  // Brighter red for better visibility
          .text('➤');
      }
      
      // Add code text with indentation preserved
      const indentMatch = line.match(/^(\s*)/);
      const indentWidth = indentMatch ? indentMatch[0].length * 8 : 0; // Assuming 8px per space
      
      lineGroup.append('text')
        .attr('x', indentWidth)
        .attr('y', 15)
        .style('font-family', 'monospace')
        .style('font-size', '14px')
        .style('fill', isCurrentLine ? '#f55' : (isTargetLine ? '#55f' : '#ddd'))  // Lighter color for normal code (#ddd)
        .text(line.trimStart());
      
      // Add highlight background for current or target line
      if (isCurrentLine || isTargetLine) {
        const textNode = lineGroup.select('text:last-child').node();
        const textWidth = textNode ? textNode.getComputedTextLength() : width;
        
        lineGroup.insert('rect', 'text')
          .attr('x', indentWidth - 5)
          .attr('y', 0)
          .attr('width', textWidth + 10)
          .attr('height', 20)
          .attr('rx', 3)
          .style('fill', isCurrentLine ? 'rgba(255,100,100,0.2)' : 'rgba(100,100,255,0.2)');  // More visible highlights
      }
    });

    // Scroll to the current line within the container only (not the whole page)
    if (containerRef.current) {
      const currentLineGroup = svg.select('.current-line').node();
      if (currentLineGroup) {
        const lineY = currentLineGroup.transform.baseVal[0].matrix.f;
        const containerHeight = containerRef.current.clientHeight;
        
        // Use scrollTo with behavior: 'auto' to avoid smooth scrolling which can cause page jumps
        containerRef.current.scrollTo({
          top: lineY - containerHeight / 2,
          behavior: 'auto'
        });
      }
    }

  }, [frame]);

  return (
    <div className="code-visualization" style={{ 
      border: '2px solid green', 
      borderRadius: '5px', 
      padding: '10px',
      backgroundColor: 'rgba(0, 255, 0, 0.05)',
      overflow: 'auto',
      maxHeight: '400px',
      position: 'relative' // Helps contain scrolling within this element
    }} ref={containerRef}>
      <h3>Code Visualization:</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default CodeVisualization;