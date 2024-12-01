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

const GameCard: React.FC<GameCardProps> = ({ id, title, slug, thumbnail, description }) => {
  return (
    (<Link href={`/games/${slug}`} className="block">

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Image
          src={thumbnail}
          alt={title}
          width={300}
          height={200}
          layout="responsive"
          className="object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>

    </Link>)
  );
};

export default GameCard;