import { useRef, useEffect, useState } from 'react'
import BinarySearchViz from './BinaryViz'
import DynamicProgrammingViz from './DynamicProgrammingViz'
// Import CodeVisualization component to make it available for BinaryViz
import CodeVisualization from './CodeVisualization'
import { renderControls } from './Utils';
const AlgoViz = ({ algorithmClass, request, code }) => {
  // Sample data for visualization

  
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
    // const response = await fetch(`http://174.138.45.200:83/debug/binary-search?target=${num}`);
  useEffect(() => {
    const fetchDebugData = async () => {
      try {
        setLoading(true);
        
        
        // const response = await fetch(`/debug/binary-search?nums=${encodedNums}&target=${39}`);
        // const response = await fetch(`/debug/any-algorithm?nums=${encodedNums}&target=${39}`); 
        // Example API call:
        // curl -X POST http://localhost:8000/debug/any-algorithm \
        //   -H "Content-Type: application/json" \
        //   -d '{"target": 11, "nums": "2, 7, 11, 15, 3, 6, 8, 1", "code": "def binary_search(arr, target)..."}'

    
        const response = await fetch(`/debug/any-algorithm`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(request)
        });

        
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

  const handleRestartFrame = () => {
    setCurrentFrameIndex(0);
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
   
  // debugData is null initially before the fetch completes
  // Using optional chaining to safely access properties
  if (!debugData) return <div>No debug data available</div>;
  const frame = debugData?.debug_frames?.[currentFrameIndex];
  return (
    <div>
        <h2>Binary Search Visualization</h2>
        <div className="frame-info">
          <p>Function: {frame.func_name}</p>
          <p>Line: {frame.current_line}</p>
          <p>Frame: {currentFrameIndex + 1} of {debugData.debug_frames.length}</p>
        </div>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: '1 1 50%', width: '50%', maxWidth: '50%' }}>
          <CodeVisualization frame={frame} />
        </div>
        <div style={{ flex: '1 1 50%', width: '50%', maxWidth: '50%' }}>
          {algorithmClass === 'dynamic-programming' ? (
            <DynamicProgrammingViz frame={frame} />
          ) : (
            <BinarySearchViz frame={frame}  />
          )}
        </div>
      </div>
      {renderControls(handlePrevFrame, handleNextFrame, isAutoPlaying, currentFrameIndex, debugData, isAnimating, toggleAutoPlay, handleRestartFrame)}

    </div>
  )
}

export default AlgoViz