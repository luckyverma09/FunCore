import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [gameStats, setGameStats] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  // Mock user data (fetch real data from Convex backend)
  useEffect(() => {
    setUserData({
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '/avatar.png',
      memberSince: '2023-01-15',
      lastLogin: '2024-11-28',
      totalGamesPlayed: 120,
      favoriteGame: 'Game2048',
      mostRecentGame: 'Sudoku',
      bestScore: { game: 'Game2048', score: 3000 },
      streak: 7,
    });

    // Mock game stats and leaderboard (fetch real data from Convex backend)
    setGameStats([
      { game: 'Game2048', highScore: 3000, averageScore: 2000, winPercentage: 70 },
      { game: 'Sudoku', highScore: 150, averageScore: 100, winPercentage: 60 },
    ]);

    setLeaderboard([
      { rank: 1, name: 'Player1', score: 4500 },
      { rank: 2, name: 'Player2', score: 4000 },
      { rank: 3, name: 'John Doe', score: 3000 },
    ]);
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 dark:from-[#1f1f1f] dark:to-[#333333] p-6'>
      <header className='flex items-center gap-6 pb-6 border-b'>
        <img src={userData?.avatar} alt='User Avatar' className='w-16 h-16 rounded-full' />
        <div>
          <h1 className='text-2xl font-bold'>{userData?.name}</h1>
          <p className='text-gray-500'>Email: {userData?.email}</p>
          <p className='text-gray-500'>Member Since: {userData?.memberSince}</p>
          <p className='text-gray-500'>Last Login: {userData?.lastLogin}</p>
        </div>
      </header>

      <main className='mt-6 space-y-10'>
        {/* General Stats */}
        <section className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <div className='bg-white p-4 rounded-lg shadow'>
            <h3 className='font-bold text-lg'>Total Games Played</h3>
            <p className='text-3xl font-semibold'>{userData?.totalGamesPlayed}</p>
          </div>
          <div className='bg-white p-4 rounded-lg shadow'>
            <h3 className='font-bold text-lg'>Favorite Game</h3>
            <p className='text-xl'>{userData?.favoriteGame}</p>
          </div>
          <div className='bg-white p-4 rounded-lg shadow'>
            <h3 className='font-bold text-lg'>Best Scoring Game</h3>
            <p className='text-xl'>
              {userData?.bestScore.game}: {userData?.bestScore.score}
            </p>
          </div>
        </section>

        {/* Game Stats */}
        <section>
          <h2 className='text-xl font-bold mb-4'>Game Statistics</h2>
          <div className='grid md:grid-cols-2 gap-6'>
            {gameStats.map((stat) => (
              <div key={stat.game} className='bg-white p-4 rounded-lg shadow'>
                <h3 className='font-bold text-lg'>{stat.game}</h3>
                <p>High Score: {stat.highScore}</p>
                <p>Average Score: {stat.averageScore}</p>
                <p>Win Percentage: {stat.winPercentage}%</p>
              </div>
            ))}
          </div>
        </section>

        {/* Leaderboard */}
        <section>
          <h2 className='text-xl font-bold mb-4'>Leaderboard</h2>
          <div className='bg-white p-4 rounded-lg shadow'>
            <table className='w-full text-left'>
              <thead>
                <tr className='border-b'>
                  <th className='py-2'>Rank</th>
                  <th className='py-2'>Name</th>
                  <th className='py-2'>Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((player) => (
                  <tr key={player.rank} className='border-b'>
                    <td className='py-2'>{player.rank}</td>
                    <td className='py-2'>{player.name}</td>
                    <td className='py-2'>{player.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
