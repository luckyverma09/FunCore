import { GetServerSideProps } from 'next';
import Leaderboard from '../components/games/Leaderboard';

interface LeaderboardPageProps {
  entries: Array<{ id: string; username: string; score: number }>;
}

const LeaderboardPage = ({ entries }: LeaderboardPageProps) => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>Global Leaderboard</h1>
      <Leaderboard entries={entries} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // Fetch leaderboard data from your API or database
  const entries = [
    { id: '1', username: 'Player1', score: 1000 },
    { id: '2', username: 'Player2', score: 900 },
    { id: '3', username: 'Player3', score: 800 },
  ];

  return {
    props: {
      entries,
    },
  };
};

export default LeaderboardPage;
