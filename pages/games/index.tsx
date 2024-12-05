// pages/games/index.tsx

import Link from 'next/link';
import Image from 'next/image';

const games = [
  {
    id: 'flappy-bird',
    title: 'Flappy Bird',
    thumbnail: '/images/games/flappy-bird.jpg',
  },
  {
    id: 'stick-hero',
    title: 'Stick Hero',
    thumbnail: '/images/games/stick-hero.jpg',
  },
  {
    id: 'snake',
    title: 'Snake',
    thumbnail: '/images/games/snake.jpg',
  },
  {
    id: 'breakout',
    title: 'Breakout',
    thumbnail: '/images/games/breakout.jpg',
  },
  {
    id: 'hang-man',
    title: 'Hang Man',
    thumbnail: '/images/games/hang-man.jpg',
  },
];

const GamesPage = () => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6 text-center text-lime-500'>Available Games</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        {games.map((game) => (
          <Link key={game.id} href={`/games/${game.id}`}>
            <div className='block bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-500 hover:scale-105 hover:shadow-[0_4px_6px_0_rgba(0,255,0,0.5)]'>
              <div className='relative w-full h-40'>
                <Image
                  src={game.thumbnail}
                  alt={game.title}
                  layout='fill'
                  objectFit='cover'
                  className='rounded-t-lg'
                />
              </div>
              <div className='p-4'>
                <h2 className='text-xl font-semibold text-center'>{game.title}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;
