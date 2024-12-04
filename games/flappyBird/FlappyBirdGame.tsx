import React, { useEffect, useRef, useState } from 'react';
import { FlappyBirdLogic } from './FlappyBirdLogic';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const FlappyBirdGame: React.FC = () => {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<FlappyBirdLogic | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newGame = new FlappyBirdLogic(canvas);
    setGame(newGame);

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        newGame.jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    newGame.onScoreUpdate = (newScore) => setScore(newScore);
    newGame.onGameOver = () => setGameOver(true);
    newGame.start();

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      newGame.stop();
    };
  }, [isGameStarted]);

  const handleRestart = () => {
    if (game) {
      game.restart();
      setScore(0);
      setGameOver(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-cyan-400 to-blue-500">
      <h1 className="text-4xl font-bold text-white mb-8">Flappy Bird</h1>
  
      {!isGameStarted ? (
        <div className="flex flex-col items-center">
          <button
            onClick={() => setIsGameStarted(true)}
            className="start-button"
          >
            Start Game
          </button>
          <p className="text-white text-lg">Press SPACE or click to jump</p>
        </div>
      ) : (
        <div className="relative game-container">
          <canvas
            ref={canvasRef}
            width={480}
            height={640}
            className="game-canvas"
            onClick={() => game?.jump()}
          />
          <div className="score-display">Score: {score}</div>
          {gameOver && (
            <div className="game-over-overlay">
              <div className="game-over-message">Game Over!</div>
              <div className="final-score">Final Score: {score}</div>
              <button
                onClick={handleRestart}
                className="restart-button"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlappyBirdGame;
