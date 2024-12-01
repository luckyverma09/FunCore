'use client';

import { useParams } from 'next/navigation';
import Game2048 from '@/components/games/Game2048/Game2048';

export default function GamePage() {
  const { gameId } = useParams();

  if (gameId === 'Game2048') {
    return <Game2048 />;
  }

  return <div>Game not found</div>;
}
