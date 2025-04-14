const renderPointerInfo = (left, right, mid, target) => {
    return (
      <div className="pointer-info" style={{ 
        fontSize: '0.9rem', 
        margin: '0.1rem 0', 
        fontFamily: 'monospace', 
        backgroundColor: '#111', 
        color: '#0f0', 
        padding: '0.4rem',
        borderRadius: '3px',
        boxShadow: '0 0 5px rgba(0, 255, 0, 0.5)',
        marginLeft: '1rem',
        imageRendering: 'pixelated'
      }}>
        <div className="pointer-label" style={{ color: '#4285F4', padding: '0.2rem', fontWeight: 'bold', textShadow: '1px 1px 1px #000' }}>
          <span className="pointer-name">[LEFT]:</span>
          <span className="pointer-value"> {left}</span>
        </div>
        <div className="pointer-label" style={{ color: '#EA4335', padding: '0.2rem', fontWeight: 'bold', textShadow: '1px 1px 1px #000' }}>
          <span className="pointer-name">[RIGHT]:</span>
          <span className="pointer-value"> {right}</span>
        </div>
        <div className="pointer-label" style={{ color: '#FBBC05', padding: '0.2rem', fontWeight: 'bold', textShadow: '1px 1px 1px #000' }}>
          <span className="pointer-name">[MID]:</span>
          <span className="pointer-value"> {mid}</span>
        </div>
        <div className="pointer-label" style={{ color: '#34A853', padding: '0.2rem', fontWeight: 'bold', textShadow: '1px 1px 1px #000' }}>
          <span className="pointer-name">[TARGET]:</span>
          <span className="pointer-value"> {target}</span>
        </div>
      </div>
    );
  };

  const renderControls = (handlePrevFrame, handleNextFrame, isAutoPlaying, 
    currentFrameIndex, debugData, isAnimating, toggleAutoPlay) => {
    return (
      <div className="controls" style={{ 
        backgroundColor: '#0a0a0a', 
        border: '1px solid #33ff33', 
        borderRadius: '4px', 
        padding: '10px',
        marginTop: '5px',
        boxShadow: '0 0 10px rgba(51, 255, 51, 0.5)' 
      }}>
        <button 
          onClick={handlePrevFrame} 
          disabled={currentFrameIndex === 0 || isAnimating}
          style={{ 
            backgroundColor: '#000', 
            color: '#33ff33', 
            border: '1px solid #33ff33', 
            margin: '0 5px', 
            padding: '8px 15px', 
            fontFamily: 'monospace', 
            cursor: 'pointer',
            opacity: (currentFrameIndex === 0 || isAnimating) ? '0.5' : '1'
          }}
        >
          « PREV_FRAME
        </button>
        <button 
          onClick={toggleAutoPlay}
          style={{ 
            backgroundColor: isAutoPlaying ? '#33ff33' : '#000', 
            color: isAutoPlaying ? '#000' : '#33ff33', 
            border: '1px solid #33ff33', 
            margin: '0 5px', 
            padding: '8px 15px', 
            fontFamily: 'monospace', 
            cursor: 'pointer'
          }}
        >
          {isAutoPlaying ? '[ HALT_EXEC ]' : '[ EXEC_AUTO ]'}
        </button>
        <button 
          onClick={handleNextFrame} 
          disabled={currentFrameIndex === debugData.debug_frames.length - 1 || isAnimating}
          style={{ 
            backgroundColor: '#000', 
            color: '#33ff33', 
            border: '1px solid #33ff33', 
            margin: '0 5px', 
            padding: '8px 15px', 
            fontFamily: 'monospace', 
            cursor: 'pointer',
            opacity: (currentFrameIndex === debugData.debug_frames.length - 1 || isAnimating) ? '0.5' : '1'
          }}
        >
          NEXT_FRAME »
        </button>
      </div>
    );
  };

export { renderPointerInfo, renderControls };