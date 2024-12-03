import React, { useState, useEffect } from 'react';
import {
  Board,
  createEmptyBoard,
  addRandomTile,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  isGameOver,
} from './2048Logic';

const Game2048: React.FC = () => {
  const [board, setBoard] = useState<Board>(addRandomTile(createEmptyBoard()));
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameOver) return;

      let newBoard: Board;
      switch (event.key) {
        case 'ArrowUp':
          newBoard = moveUp(board);
          break;
        case 'ArrowDown':
          newBoard = moveDown(board);
          break;
        case 'ArrowLeft':
          newBoard = moveLeft(board);
          break;
        case 'ArrowRight':
          newBoard = moveRight(board);
          break;
        default:
          return;
      }

      if (JSON.stringify(board) !== JSON.stringify(newBoard)) {
        setBoard(addRandomTile(newBoard));
      }

      if (isGameOver(newBoard)) {
        setGameOver(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [board, gameOver]);

  const resetGame = () => {
    setBoard(addRandomTile(createEmptyBoard()));
    setGameOver(false);
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <h1 className='text-4xl font-bold mb-6 text-gray-800'>2048</h1>
      <div className='grid grid-cols-4 gap-2 bg-gray-300 p-4 rounded-md'>
        {board.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`w-20 h-20 flex items-center justify-center text-2xl font-bold rounded-md ${
                cell === 0 ? 'bg-gray-200' : 'bg-yellow-400'
              }`}
            >
              {cell !== 0 && cell}
            </div>
          ))
        )}
      </div>
      {gameOver && <div className='mt-6 text-red-600 font-bold text-xl'>Game Over!</div>}
      <button onClick={resetGame} className='mt-6 px-6 py-2 bg-green-500 text-white rounded-md'>
        Reset Game
      </button>
    </div>
  );
};

export default Game2048;
