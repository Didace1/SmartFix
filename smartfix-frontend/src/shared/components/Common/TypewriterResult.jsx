import React, { useEffect, useRef, useState } from 'react';

export const TypewriterResult = ({ 
  text, 
  speed = 50, // characters per second
  delay = 0,
  className = '',
  onComplete = null
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const runIdRef = useRef(0);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    const safeText = text === null || text === undefined ? '' : String(text);

    // Increment run id to invalidate any in-flight timers
    runIdRef.current += 1;
    const runId = runIdRef.current;

    // Clear any existing timers
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];

    if (!safeText) {
      setDisplayedText('');
      setIsComplete(false);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);

    const currentIndex = safeText.length;
    let charIndex = 0;

    const typeNextChar = () => {
      if (runIdRef.current !== runId) return;
      if (charIndex < currentIndex) {
        setDisplayedText((prev) => prev + safeText[charIndex]);
        charIndex++;
        
        if (charIndex >= currentIndex) {
          setIsComplete(true);
          if (onComplete) {
            onComplete();
          }
        } else {
          const t = setTimeout(typeNextChar, 1000 / speed);
          timeoutsRef.current.push(t);
        }
      }
    };

    // Start typing after base delay + optional external delay
    const startDelay = 300 + (Number.isFinite(delay) ? delay : 0);
    const startT = setTimeout(typeNextChar, startDelay);
    timeoutsRef.current.push(startT);

    return () => {
      // Cleanup timers on unmount / prop change
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
    };

  }, [text, speed]);

  return (
    <div className={className}>
      {displayedText}
      {!isComplete && (
        <span 
          className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse"
          style={{ animation: 'pulse 1s infinite' }}
        ></span>
      )}
    </div>
  );
};

export default TypewriterResult;
