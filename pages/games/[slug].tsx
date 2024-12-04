import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import ScoreBoard from '../../components/ScoreBoard';
import { HangManGame } from '@/games/hangMan/HangManGame';
import StickHeroGame from '@/games/stickHero/StickHeroGame';

// Dynamically import game components with SSR disabled
const SudokuGame = dynamic(() => import('../../games/sudoku/SudokuGame'), { ssr: false });
const FlappyBirdGame = dynamic(() => import('../../games/flappyBird/FlappyBirdGame'), {
  ssr: false,
});
const Game2048 = dynamic(() => import('../../games/2048/2048Game'), { ssr: false });
const Hangman = dynamic<{}>(
  () => import('../../games/hangMan/HangManGame').then((mod) => mod.HangManGame),
  { ssr: false }
);

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
      case 'sudoku':
        return <SudokuGame />;
      case 'flappy-bird':
        return <FlappyBirdGame />;
      case 'stick-hero':
        return <StickHeroGame />;
      case 'hang-man':
        return <HangManGame />;
      case '2048':
        return <Game2048 />;
      default:
        return <div>Game not found</div>;
    }
  };

  return (
    <div className='flex'>
      <div className='flex-1 container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-6'>
          {isClient && slug ? `Playing ${slug}` : 'Loading...'}
        </h1>
        {renderGame()}
      </div>
      <ScoreBoard gameId={slug as string} />
    </div>
  );
};

export default GamePage;
