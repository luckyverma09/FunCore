import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import ScoreBoard from '../../components/ScoreBoard';
import { HangManGame } from '@/games/hangMan/HangManGame';
import StickHeroGame from '@/games/stickHero/StickHeroGame';
import SnakeGame from '@/games/snake/SnakeGame';
import BreakoutGame from '@/games/breakout/BreakoutGame';

const FlappyBirdGame = dynamic(() => import('../../games/flappyBird/FlappyBirdGame'), {
  ssr: false,
});


const GamePage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [isClient, setIsClient] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const renderGame = () => {
    if (!isClient) return null;

    switch (slug) {
      case 'flappy-bird':
        return <FlappyBirdGame />;
      case 'stick-hero':
        return <StickHeroGame />;
      case 'hang-man':
        return <HangManGame />;
      case 'snake':
        return <SnakeGame />;
      case 'breakout':
        return <BreakoutGame />;
      default:
        return <div>Game not found</div>;
    }
  };

  return (
    <div className='flex'>
      <div className='flex-1 container mx-auto px-4 py-8'>{renderGame()}</div>
      <ScoreBoard gameId={slug as string} />
    </div>
  );
};

export default GamePage;
