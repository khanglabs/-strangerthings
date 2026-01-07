
import React, { useEffect, useState } from 'react';

const FloatingSpores: React.FC = () => {
  const [spores, setSpores] = useState<{ id: number; left: number; top: number; size: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const newSpores = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 10,
      duration: Math.random() * 15 + 10,
    }));
    setSpores(newSpores);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {spores.map((spore) => (
        <div
          key={spore.id}
          className="absolute rounded-full bg-white/20 blur-[1px]"
          style={{
            left: `${spore.left}%`,
            top: `${spore.top}%`,
            width: `${spore.size}px`,
            height: `${spore.size}px`,
            animation: `float ${spore.duration}s linear infinite`,
            animationDelay: `-${spore.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh) translateX(50px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingSpores;
