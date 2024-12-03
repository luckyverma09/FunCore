import React, { useEffect, useRef, useState } from 'react';
import { StickHeroLogic } from './StickHeroLogic';

const StickHeroGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<StickHeroLogic | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    if (!isGameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const newGame = new StickHeroLogic(canvas);
    setGame(newGame);

    const handleMouseDown = () => newGame.startStretching();
    const handleMouseUp = () => newGame.stopStretching();

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);

    newGame.onScoreUpdate = (newScore) => setScore(newScore);
    newGame.onGameOver = () => setGameOver(true);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isGameStarted]);

  const handleRestart = () => {
    if (game) {
      game.resetGame();
      setScore(0);
      setGameOver(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-cyan-400 to-blue-500'>
      <h1 className='text-4xl font-bold text-white mb-8'>Stick Hero</h1>

      {!isGameStarted ? (
        <button
          onClick={() => setIsGameStarted(true)}
          className='px-8 py-3 bg-white text-blue-500 rounded-lg hover:bg-blue-100 transition-colors font-bold text-xl mb-4'
        >
          Start Game
        </button>
      ) : (
        <div className='relative'>
          <div className='absolute top-4 left-4 text-white text-2xl font-bold'>Score: {score}</div>
          <canvas
            ref={canvasRef}
            width={375}
            height={375}
            className='border-4 border-white rounded-lg shadow-lg'
          />
          {gameOver && (
            <div className='absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-lg'>
              <div className='text-white text-4xl font-bold mb-4'>Game Over!</div>
              <div className='text-white text-2xl mb-4'>Final Score: {score}</div>
              <button
                onClick={handleRestart}
                className='px-6 py-2 bg-white text-blue-500 rounded-lg hover:bg-blue-100 transition-colors font-bold'
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
      <div className='mt-4 text-white text-lg'>Hold mouse to stretch the stick</div>
    </div>
  );
};

export default StickHeroGame;
