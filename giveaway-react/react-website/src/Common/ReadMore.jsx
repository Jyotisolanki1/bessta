import React, { useState, useEffect, useRef } from 'react';

const ReadMore = ({ children, maxHeight = 250 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsReadMore, setNeedsReadMore] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setNeedsReadMore(contentRef.current.scrollHeight > maxHeight);
    }
  }, [children, maxHeight]);

  const toggleReadMore = () => setIsExpanded(!isExpanded);

  return (
    <div>
      <div
        ref={contentRef}
        style={{
          maxHeight: isExpanded ? 'none' : `${maxHeight}px`,
          overflowY: isExpanded ? 'auto' : 'hidden',
          transition: 'max-height 0.3s ease, overflow 0.3s ease',
          // Ensure content container is block-level
          display: 'block',
        }}
      >
        {children}
      </div>
      {needsReadMore && (
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <button
            onClick={toggleReadMore}
            style={{
              background: 'none',
              border: 'none',
              color: '#007BFF',
              cursor: 'pointer',
              padding: '10px 0',
              fontSize: '16px',
            }}
          >
            {isExpanded ? (
              <span style={{ color: 'black' }}>Read Less ▲</span>
            ) : (
              <span style={{ color: 'black' }}>Read More ▼</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReadMore;
