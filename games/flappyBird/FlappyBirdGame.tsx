// games/flappyBird/FlappyBirdGame.tsx
import React, { useEffect, useRef } from 'react';

const FlappyBirdGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      // Implement Flappy Bird game logic here
    }
  }, []);

  return <canvas ref={canvasRef} width={400} height={600} />;
};

export default FlappyBirdGame;