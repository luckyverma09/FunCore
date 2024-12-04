import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { StickHeroLogic } from './StickHeroLogic';

const StickHeroGame: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<StickHeroLogic | null>(null);
  const [score, setScore] = useState(0);
  const [showPerfect, setShowPerfect] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameStarted) return;

    const newGame = new StickHeroLogic(canvas);
    setGame(newGame);

    newGame.onScoreUpdate = (newScore) => {
      setScore(newScore);
    };

    newGame.onPerfectScore = () => {
      setShowPerfect(true);
      setTimeout(() => setShowPerfect(false), 1000);
    };

    newGame.onGameOver = () => {
      setIsGameOver(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        newGame.startStretching();
      }
    };

    const handleMouseDown = () => {
      newGame.startStretching();
    };

    const handleMouseUp = () => {
      newGame.stopStretching();
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      newGame.draw();
    };

    handleResize();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      newGame.stop();
    };
  }, [gameStarted]);

  const handleStart = () => {
    setGameStarted(true);
    setIsGameOver(false);
  };

  const handleRestart = () => {
    if (game) {
      game.resetGame();
      setScore(0);
      setShowPerfect(false);
      setIsGameOver(false);
    }
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return null;

  return (
    <div className='fixed inset-0 w-screen h-screen'>
      {!gameStarted ? (
        <div className='absolute inset-0 flex items-center justify-center bg-gradient-to-r from-cyan-400 to-blue-500'>
          <button
            onClick={handleStart}
            className='px-8 py-3 bg-white text-blue-500 rounded-lg hover:bg-blue-100 transition-colors font-bold text-xl'
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className='relative w-full h-full'>
          <canvas ref={canvasRef} className='w-full h-full' />
          <div className='absolute top-4 right-4 text-2xl font-bold text-white'>Score: {score}</div>
          {showPerfect && (
            <div className='absolute top-1/4 left-1/2 transform -translate-x-1/2 text-yellow-300 font-bold text-xl'>
              DOUBLE SCORE
            </div>
          )}
          {isGameOver && (
            <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
              <div className='bg-white p-8 rounded-lg text-center'>
                <h2 className='text-3xl font-bold mb-4'>Game Over!</h2>
                <p className='text-xl mb-6'>Final Score: {score}</p>
                <button
                  onClick={handleRestart}
                  className='px-6 py-2 bg-red text-black rounded-lg hover:bg-blue-600 transition-colors font-bold'
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StickHeroGame;
