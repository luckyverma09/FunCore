import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// Dynamically import game components with SSR disabled
const SudokuGame = dynamic(() => import('../../games/sudoku/SudokuGame'), { ssr: false });
const FlappyBirdGame = dynamic(() => import('../../games/flappyBird/FlappyBirdGame'), {
  ssr: false,
});
const Game2048 = dynamic(() => import('../../games/2048/2048Game'), { ssr: false });

const GamePage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setIsLoading(false);
    }
  }, [slug]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const renderGame = () => {
    switch (slug) {
      case 'sudoku':
        return <SudokuGame />;
      case 'flappy-bird':
        return <FlappyBirdGame />;
      case '2048':
        return <Game2048 />;
      default:
        return <div>Game not found</div>;
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>{slug ? `Playing ${slug}` : 'Loading...'}</h1>
      {renderGame()}
    </div>
  );
};

export default GamePage;
