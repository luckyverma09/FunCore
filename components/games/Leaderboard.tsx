import React from 'react';

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  return (
    <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
      <div className='px-4 py-5 sm:px-6'>
        <h3 className='text-lg leading-6 font-medium text-gray-900'>Leaderboard</h3>
      </div>
      <div className='border-t border-gray-200'>
        <ul className='divide-y divide-gray-200'>
          {entries.map((entry, index) => (
            <li key={entry.id} className='px-4 py-4 sm:px-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <span className='font-medium text-indigo-600 mr-2'>{index + 1}.</span>
                  <p className='text-sm font-medium text-gray-900'>{entry.username}</p>
                </div>
                <p className='text-sm text-gray-500'>{entry.score} points</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;
