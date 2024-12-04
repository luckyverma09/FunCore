import { useEffect, useState } from 'react';

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
}

const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
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

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className='text-center py-4'>Loading leaderboard...</div>;
  }

  return (
    <div className='bg-white shadow overflow-hidden sm:rounded-lg max-w-2xl mx-auto mt-8'>
      <div className='px-4 py-5 sm:px-6'>
        <h3 className='text-2xl leading-6 font-bold text-gray-900'>Global Leaderboard</h3>
        <p className='mt-1 text-sm text-gray-500'>Total scores across all games</p>
      </div>
      <div className='border-t border-gray-200'>
        <ul className='divide-y divide-gray-200'>
          {entries.map((entry, index) => (
            <li key={entry.id} className='px-4 py-4 sm:px-6 hover:bg-gray-50'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <span
                    className={`font-medium mr-4 text-lg ${
                      index === 0
                        ? 'text-yellow-500'
                        : index === 1
                        ? 'text-gray-400'
                        : index === 2
                        ? 'text-orange-500'
                        : 'text-gray-600'
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <p className='text-lg font-medium text-gray-900'>{entry.username}</p>
                </div>
                <p className='text-lg font-semibold text-indigo-600'>
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
