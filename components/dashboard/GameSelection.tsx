import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Game {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
}

interface GameSelectionProps {
  games: Game[];
}

const GameSelection: React.FC<GameSelectionProps> = ({ games }) => {
  return (
    (<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
      {games.map((game) => (
        <Link href={`/games/${game.slug}`} key={game.id} className='block'>

          <div className='bg-white rounded-lg shadow overflow-hidden'>
            <Image
              src={game.thumbnail}
              alt={game.title}
              width={300}
              height={200}
              layout='responsive'
              className='object-cover'
            />
            <div className='p-4'>
              <h3 className='text-lg font-semibold text-gray-900'>{game.title}</h3>
            </div>
          </div>

        </Link>
      ))}
    </div>)
  );
};

export default GameSelection;
