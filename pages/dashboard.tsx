import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import UserStats from '../components/dashboard/UserStats';
import GameSelection from '../components/dashboard/GameSelection';

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>Dashboard</h1>
      <UserStats mostPlayedGame='Example Game' totalPlaytime={10} favoriteCategory='Puzzle' />
      <h2 className='text-2xl font-bold mt-12 mb-4'>Your Games</h2>
      <GameSelection games={[]} /> {/* Add your games data here */}
    </div>
  );
};

export default Dashboard;
