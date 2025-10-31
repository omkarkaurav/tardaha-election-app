'use client';

import { useEffect, useState } from 'react';

// This component creates a confetti burst effect.
export default function Celebration() {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    // Generate 100 confetti pieces with random properties
    const newConfetti = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}vw`,
        backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
        animation: `confetti-fall ${2 + Math.random() * 2}s linear forwards`,
        animationDelay: `${Math.random() * 2}s`,
      },
    }));
    setConfetti(newConfetti);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[10000]" aria-hidden="true">
      {confetti.map(c => (
        <div
          key={c.id}
          className="absolute w-2.5 h-2.5"
          style={c.style}
        ></div>
      ))}
    </div>
  );
}