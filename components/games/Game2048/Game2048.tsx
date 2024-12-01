'use client';

import React, { useEffect } from 'react';
import { useGame2048 } from '@/hooks/useGame2048';

const Game2048: React.FC = () => {
  const { grid, score, isGameOver, moveLeft, moveRight, moveUp, moveDown, resetGame } =
    useGame2048();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowLeft':
          moveLeft();
          break;
        case 'ArrowRight':
          moveRight();
          break;
        case 'ArrowUp':
          moveUp();
          break;
        case 'ArrowDown':
          moveDown();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveLeft, moveRight, moveUp, moveDown]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <h1 className='text-4xl font-bold mb-4'>2048</h1>
      <div className='grid grid-cols-4 gap-2 bg-gray-300 p-4 rounded-lg'>
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`w-16 h-16 flex items-center justify-center text-2xl font-bold rounded ${getTileColor(cell)}`}
            >
              {cell !== 0 && cell}
            </div>
          ))
        )}
      </div>
      <p className='mt-4 text-xl'>Score: {score}</p>
      {isGameOver && (
        <div className='mt-4'>
          <p className='text-2xl font-bold text-red-500'>Game Over!</p>
          <button
            onClick={resetGame}
            className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

const getTileColor = (value: number): string => {
  const colors: { [key: number]: string } = {
    2: 'bg-yellow-200',
    4: 'bg-yellow-300',
    8: 'bg-orange-300',
    16: 'bg-orange-400',
    32: 'bg-red-400',
    64: 'bg-red-500',
    128: 'bg-pink-400',
    256: 'bg-pink-500',
    512: 'bg-purple-400',
    1024: 'bg-purple-500',
    2048: 'bg-blue-500 text-white',
  };
  return colors[value] || 'bg-gray-200';
};

export default Game2048;
