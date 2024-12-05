//SnakeGame.tsx
import React, { useEffect, useRef, useState } from 'react';
import { SnakeLogic, SnakeGameLogic } from './SnakeGameLogic';
import './style.css';

const SnakeGame: React.FC = () => {
  const [logic] = useState<SnakeGameLogic>(new SnakeLogic());
  const [gameInterval, setGameInterval] = useState<NodeJS.Timeout | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);

  const boardRef = useRef<HTMLDivElement>(null);

  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    const interval = setInterval(() => {
      if (logic.checkCollision()) {
        setGameOver(true);
        clearInterval(interval);
        return;
      }
      logic.moveSnake();
      updateScore();
      draw();
    }, logic.gameSpeedDelay);
    setGameInterval(interval);
  };

  const resetGame = () => {
    logic.resetGame();
    setGameStarted(false);
    setScore(0);
    if (gameInterval) clearInterval(gameInterval);
    draw();
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.key)) {
      event.preventDefault();
    }

    if (!gameStarted && (event.code === 'Space' || event.key === ' ')) {
      startGame();
    } else {
      switch (event.key) {
        case 'ArrowUp':
          logic.changeDirection('up');
          break;
        case 'ArrowDown':
          logic.changeDirection('down');
          break;
        case 'ArrowLeft':
          logic.changeDirection('left');
          break;
        case 'ArrowRight':
          logic.changeDirection('right');
          break;
      }
    }
  };

  const updateScore = () => {
    setScore(logic.snake.length - 1);
  };

  const draw = () => {
    if (!boardRef.current) return;

    boardRef.current.innerHTML = '';

    logic.snake.forEach((segment) => {
      const segmentDiv = document.createElement('div');
      segmentDiv.className = 'snake';
      segmentDiv.style.gridColumn = `${segment.x}`;
      segmentDiv.style.gridRow = `${segment.y}`;
      boardRef.current?.appendChild(segmentDiv);
    });

    const foodDiv = document.createElement('div');
    foodDiv.className = 'food';
    foodDiv.style.gridColumn = `${logic.food.x}`;
    foodDiv.style.gridRow = `${logic.food.y}`;
    boardRef.current?.appendChild(foodDiv);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    draw();

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      if (gameInterval) clearInterval(gameInterval);
    };
  }, [gameStarted, logic]);

  return (
    <div className='snake-game'>
      <div className='scores text-clip'>
        <h1>
          Score: <span className='text-lime-600'>{score.toString().padStart(3, '0')}</span>
        </h1>
      </div>
      <div className='game-border-1'>
        <div className='game-border-2'>
          <div className='game-border-3'>
            <div id='game-board' ref={boardRef}></div>
          </div>
        </div>
      </div>
      {gameOver && (
        <div className='game-over'>
          <h2>Game Over!</h2> <p>Final Score: {score}</p>
          <button
            onClick={() => {
              resetGame();
              startGame();
            }}
          >
            Play Again
          </button>
        </div>
      )}
      {!gameStarted && !gameOver && <h1 id='instruction-text'>Press Spacebar to Start the Game</h1>}
    </div>
  );
};

export default SnakeGame;
