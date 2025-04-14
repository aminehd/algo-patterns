import { useRef, useEffect, useState } from 'react'
import BinarySearchViz from './BinaryViz'
// Import CodeVisualization component to make it available for BinaryViz
import CodeVisualization from './CodeVisualization'

const AlgoViz = () => {
  // Sample data for visualization
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
  useEffect(() => {
    const fetchDebugData = async () => {
      try {
        setLoading(true);
        // This will work so if the proxy not worked and broke, use this 
        // const response = await fetch('http://174.138.45.200:83/debug/binary-search');
        // in the vite config, we have a proxy to the backend:83 for debug path, in the proxy manager we have 
        // a /debug path to rout to 83
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

  return (
    <div>
      {/* Pass CodeVisualization as a prop to BinarySearchViz */}
      <BinarySearchViz CodeVisualization={CodeVisualization} />
      {/* <ColorfulGrid />
      <MinimalistPixels /> */}
    </div>
  )
}

export default AlgoViz