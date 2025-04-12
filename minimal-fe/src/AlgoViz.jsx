import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
// import components
import BarChart from './pages/BarChart'
import ColorfulGrid from './pages/ColorfulGrid'
import MinimalistPixels from './pages/MinimalistPixels'
import EmergentSystem from './pages/EmergentSystem'

const AlgoViz = () => {
  const madeupdata = [
    { domain: "github.com", count: 1280 },
    { domain: "medium.com", count: 95 },
    { domain: "nytimes.com", count: 82 },
    { domain: "techcrunch.com", count: 78 },
    { domain: "dev.to", count: 65 },
    { domain: "wired.com", count: 58 },
    { domain: "theverge.com", count: 52 },
    { domain: "arstechnica.com", count: 47 },
    { domain: "bloomberg.com", count: 43 },
    { domain: "cnn.com", count: 38 },
    { domain: "washingtonpost.com", count: 35 },  
  ]
  
  // State to store binary search debug data
  const [debugData, setDebugData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayRef = useRef(null);
  
  // Reference to the code display container
  const codeDisplayRef = useRef(null);
  
  // Fetch binary search debug data from backend
  useEffect(() => {
    const fetchDebugData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://174.138.45.200:83/debug/binary-search');
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
      }, 300); // Animation delay
    }
  };

  const handlePrevFrame = () => {
    if (currentFrameIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentFrameIndex(currentFrameIndex - 1);
        setIsAnimating(false);
      }, 300); // Animation delay
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
      }, 1000);
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

  // Render binary search visualization
  const renderBinarySearchViz = () => {
    if (loading) return <div>Loading binary search visualization...</div>;
    if (error) return <div>Error loading binary search data: {error}</div>;
    if (!debugData) return <div>No debug data available</div>;

    const frame = debugData.debug_frames[currentFrameIndex];
    const variables = frame.variables;
    
    // Extract array and pointers from variables
    let array = [];
    let left = -1;
    let right = -1;
    let mid = -1;
    
    // Parse the array and pointers from variables
    try {
      if (variables.arr) {
        array = JSON.parse(variables.arr.replace(/^\[|\]$/g, '').split(', ').map(Number));
      }
      if (variables.left) left = parseInt(variables.left);
      if (variables.right) right = parseInt(variables.right);
      if (variables.mid) mid = parseInt(variables.mid);
    } catch (e) {
      console.error('Error parsing variables:', e);
    }

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
        
        <div className="code-display" ref={codeDisplayRef}>
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
                  transition: 'all 0.5s ease',
                  animation: isAnimating ? 'pulse 0.3s' : 'none'
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
                  transition: 'left 0.5s ease'
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
                  transition: 'left 0.5s ease'
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
                  transition: 'left 0.5s ease'
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
        </div>
        
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
  
  return (
    <div>
      {renderBinarySearchViz()}
      <hr />
      {/* <ColorfulGrid />
      <MinimalistPixels /> */}
    </div>
  )
}

export default AlgoViz 