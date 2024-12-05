//components/games/GameCard.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface GameCardProps {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  description: string;
}

const GameCard: React.FC<GameCardProps> = ({ title, slug, thumbnail, description }) => {
  const imagePath = `/images/games/${thumbnail}`;

  return (
    <Link href={`/games/${slug}`} className='block'>
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='relative w-full h-48'>
          <Image
            src={imagePath}
            alt={title}
            layout='fill'
            objectFit='cover'
            className='rounded-t-lg'
          />
        </div>
        <div className='p-4'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>{title}</h3>
          <p className='text-sm text-gray-600'>{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
