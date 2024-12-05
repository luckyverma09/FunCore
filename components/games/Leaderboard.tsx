//components/games/Leaderboard.tsx
import { useEffect, useState } from 'react';

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries: initialEntries }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(initialEntries);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/leaderboard');
        if (response.ok) {
          const data = await response.json();
          setEntries(data);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className='text-center py-4'>Loading leaderboard...</div>;
  }

  return (
    <div className='bg-gradient-to-r from-lime-400 to-green-400 shadow-lg overflow-hidden sm:rounded-lg max-w-2xl mx-auto mt-8 '>
      <div className='px-6 py-5'>
        <h3 className='text-3xl leading-6 font-bold text-white'>Global Leaderboard</h3>
        <p className='mt-1 text-sm  text-black-200'>Total scores across all games</p>
      </div>
      <div className='bg-white rounded-t-lg shadow-inner'>
        <ul className='divide-y divide-gray-200'>
          {entries.map((entry, index) => (
            <li key={entry.id} className='px-6 py-4 hover:bg-gray-100'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <span
                    className={`font-medium mr-4 text-lg ${
                      index === 0
                        ? 'text-yellow-400'
                        : index === 1
                        ? 'text-gray-400'
                        : index === 2
                        ? 'text-orange-500'
                        : 'text-gray-600'
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <p className='text-lg font-medium text-gray-800'>{entry.username}</p>
                </div>
                <p className='text-lg font-semibold text-purple-600'>
                  {entry.score.toLocaleString()} pts
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  
};

export default Leaderboard;
