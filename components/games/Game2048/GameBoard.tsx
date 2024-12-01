// components/games/2048/GameBoard.tsx

import React from 'react';
import Tile from './Tile';

interface GameBoardProps {
  grid: number[][];
}

const GameBoard: React.FC<GameBoardProps> = ({ grid }) => {
  return (
    <div className='bg-gray-300 p-4 rounded-lg'>
      {grid.map((row, i) => (
        <div key={i} className='flex'>
          {row.map((value, j) => (
            <Tile key={`${i}-${j}`} value={value} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
