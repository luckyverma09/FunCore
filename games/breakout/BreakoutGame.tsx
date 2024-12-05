import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { BreakoutGameLogic, BreakoutGameState } from './BreakoutGameLogic';

const BreakoutGame: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<BreakoutGameLogic>();
  const [gameState, setGameState] = useState<BreakoutGameState>({
    isGameStarted: false,
    isGameOver: false,
    score: 0,
    lives: 1,
  });

  // this is comment

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (!canvasRef.current || !session) return;

    const handleStateChange = (newState: Partial<BreakoutGameState>) => {
      setGameState((prev: BreakoutGameState) => ({ ...prev, ...newState }));
    };

    const game = new BreakoutGameLogic(canvasRef.current, handleStateChange);
    gameRef.current = game;

    const handleKeyDown = (e: KeyboardEvent) => game.keyDownHandler(e);
    const handleKeyUp = (e: KeyboardEvent) => game.keyUpHandler(e);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationId: number;
    const gameLoop = () => {
      game.draw();
      animationId = requestAnimationFrame(gameLoop);
    };
    animationId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationId);
    };
  }, [session]);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return null;

  return (
    <div className='flex min-h-screen'>
      <div className='flex-1 flex flex-col items-center justify-center bg-gradient-to-r from-cyan-400 to-blue-500 p-8'>
        <div className='bg-white rounded-lg shadow-xl p-8'>
          <h1 className='text-3xl font-bold text-center mb-4'>Breakout</h1>
          <div className='text-center mb-4'>
            <p className='text-xl'>Score: {gameState.score}</p>
            <p className='text-xl'>Lives: {gameState.lives}</p>
          </div>

          <div className='relative'>
            <canvas
              ref={canvasRef}
              width={480}
              height={320}
              className='border-4 border-gray-800 rounded-lg'
            />

            {!gameState.isGameStarted && !gameState.isGameOver && (
              <div className='absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg'>
                <button onClick={() => gameRef.current?.startGame()} className=' font-bold text-xl'>
                  Start Game
                </button>
              </div>
            )}

            {gameState.isGameOver && (
              <div className='absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg'>
                <div className='text-center'>
                  <p className='text-2xl font-bold text-black mb-4'>Game Over!</p>
                  <button
                    onClick={() => gameRef.current?.startGame()}
                    className='px-8 py-3 bg-green-500 text-black rounded-lg hover:bg-green-600 transition-colors font-bold text-xl'
                  >
                    Restart Game
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakoutGame;
