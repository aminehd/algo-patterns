  import { useRef, useEffect, useState } from 'react';
  import * as d3 from 'd3';
  import CodeVisualization from './CodeVisualization';
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
  const BinarySearchViz = () => {
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
    
    // Fetch binary search debug data from backend
    useEffect(() => {
      const fetchDebugData = async () => {
        try {
          setLoading(true);
          const response = await fetch('/debug/binary-search');
          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }
          const data = await response.json();
          setDebugData(data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching debug data:', err);
          setError(err.message);
          setLoading(false);
        }
      };
      
      fetchDebugData();
    }, []);
    
    // Function to navigate through frames
    const handleNextFrame = () => {
      if (debugData && currentFrameIndex < debugData.debug_frames.length - 1 && !isAnimating) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentFrameIndex(currentFrameIndex + 1);
          setIsAnimating(false);
        }, animationConfig.duration);
      }
    };

    const handlePrevFrame = () => {
      if (currentFrameIndex > 0 && !isAnimating) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentFrameIndex(currentFrameIndex - 1);
          setIsAnimating(false);
        }, animationConfig.duration);
      }
    };

    // Auto-play functionality
    const toggleAutoPlay = () => {
      setIsAutoPlaying(!isAutoPlaying);
    };

    useEffect(() => {
      if (isAutoPlaying) {
        autoPlayRef.current = setInterval(() => {
          if (debugData && currentFrameIndex < debugData.debug_frames.length - 1) {
            setCurrentFrameIndex(prev => prev + 1);
          } else {
            setIsAutoPlaying(false);
          }
        }, animationConfig.autoPlayInterval);
      } else if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }, [isAutoPlaying, currentFrameIndex, debugData]);

    // Scroll to the current line when frame changes
    useEffect(() => {
      if (codeDisplayRef.current && debugData) {
        const currentLineElement = codeDisplayRef.current.querySelector('.current-line');
        if (currentLineElement) {
          currentLineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, [currentFrameIndex, debugData]);

    if (loading) return <div>Loading binary search visualization...</div>;
    if (error) return <div>Error loading binary search data: {error}</div>;
    if (!debugData) return <div>No debug data available</div>;

    const frame = debugData.debug_frames[currentFrameIndex];
    const variables = frame.variables;
    
    // Parse the frame data
    const parsedData = parseFrameVariables(variables);
    const { array, pointers } = parsedData;
    const { left, right, mid } = pointers;

    // Check if current line is 61 (important line we want to highlight)
    const isLine61 = frame.current_line === 61;

    return (
      <div className={`binary-search-viz ${isAnimating ? 'animating' : ''}`}>
        <h2>Binary Search Visualization</h2>
        <div className="frame-info">
          <p>Function: {frame.func_name}</p>
          <p>Line: {frame.current_line}</p>
          <p>Frame: {currentFrameIndex + 1} of {debugData.debug_frames.length}</p>
        </div>
        
        {/* D3 Code Visualization in green frame */}
        <CodeVisualization frame={frame} />
        
        {/* Original code display for reference */}
        {/* <div className="code-display" ref={codeDisplayRef}>
          <h3>Code:</h3>
          <pre>
            {frame.source_lines.map((line, i) => {
              const lineNumber = frame.start_line + i;
              const isCurrentLine = lineNumber === frame.current_line;
              const isTargetLine = lineNumber === 61; // Our special line of interest
              
              return (
                <div 
                  key={i} 
                  className={`code-line ${isCurrentLine ? 'current-line' : ''} ${isTargetLine ? 'target-line' : ''}`}
                  id={`line-${lineNumber}`}
                >
                  {isCurrentLine && <span className="code-arrow">➤</span>}
                  <span className="line-number">{lineNumber}:</span> {line}
                </div>
              );
            })}
          </pre>
        </div>
        
        <div className={`array-visualization ${isLine61 ? 'highlight-container' : ''}`}>
          <h3>Array Visualization:</h3>
          <div className="array-container">
            {array.map((value, i) => (
              <div 
                key={i} 
                className={`array-item ${i === mid ? 'mid' : ''} ${i === left ? 'left' : ''} ${i === right ? 'right' : ''}`}
                style={{
                  transition: animationConfig.transitions.array,
                  animation: isAnimating ? animationConfig.effects.pulse : 'none'
                }}
              >
                {value}
              </div>
            ))}
          </div>
          <div className="pointer-labels">
            {left >= 0 && (
              <div 
                className="pointer left" 
                style={{
                  left: `${left * 40 + 20}px`,
                  transition: animationConfig.transitions.pointer
                }}
              >
                L
              </div>
            )}
            {mid >= 0 && (
              <div 
                className="pointer mid" 
                style={{
                  left: `${mid * 40 + 20}px`,
                  transition: animationConfig.transitions.pointer
                }}
              >
                M
              </div>
            )}
            {right >= 0 && (
              <div 
                className="pointer right" 
                style={{
                  left: `${right * 40 + 20}px`,
                  transition: animationConfig.transitions.pointer
                }}
              >
                R
              </div>
            )}
          </div>
        </div>
        
        <div className="variables-display">
          <h3>Variables:</h3>
          <pre>{JSON.stringify(variables, null, 2)}</pre>
        </div> */}
        
        <div className="controls">
          <button onClick={handlePrevFrame} disabled={currentFrameIndex === 0 || isAnimating}>Previous Frame</button>
          <button onClick={toggleAutoPlay}>
            {isAutoPlaying ? 'Pause' : 'Auto Play'}
          </button>
          <button onClick={handleNextFrame} disabled={currentFrameIndex === debugData.debug_frames.length - 1 || isAnimating}>Next Frame</button>
        </div>
      </div>
    );
  };

export default BinarySearchViz;