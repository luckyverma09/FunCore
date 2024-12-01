// components/games/2048/Tile.tsx

import React from 'react';

interface TileProps {
  value: number;
}

const Tile: React.FC<TileProps> = ({ value }) => {
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

  const color = colors[value] || 'bg-gray-700 text-white';

  return (
    <div
      className={`w-16 h-16 m-1 flex items-center justify-center text-2xl font-bold rounded ${color}`}
    >
      {value !== 0 && value}
    </div>
  );
};

export default Tile;
