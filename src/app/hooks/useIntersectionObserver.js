'use client';
import { useEffect, useRef, useState } from 'react';

export const useIntersectionObserver = (options) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Optional: unobserve after it's visible so it doesn't trigger again
        observer.unobserve(entry.target);
      }
    }, options);

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [containerRef, options]);

  return [containerRef, isVisible];
};