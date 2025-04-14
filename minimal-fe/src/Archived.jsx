       {/* D3 Code Visualization in green frame */}
        
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