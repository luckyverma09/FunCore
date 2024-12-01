// components/games/GameWrapper.tsx
'use client';

import dynamic from 'next/dynamic';

const Game2048 = dynamic(() => import('@/components/games/Game2048/Game2048'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

// const FlappyBird = dynamic(() => import('@/components/games/flappy-bird/FlappyBird'), {
//   ssr: false,
//   loading: () => <p>Loading...</p>,
// });

export function GameWrapper({ gameName }: { gameName: string }) {
  if (gameName === '2048') return <Game2048 />;
//   if (gameName === 'flappy-bird') return <FlappyBird />;
  return <div>Game not found</div>;
}
