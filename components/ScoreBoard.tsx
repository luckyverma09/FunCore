import { useEffect, useState } from 'react';

interface Score {
  userId: string;
  score: number;
  createdAt: string;
}

const ScoreBoard = ({ gameId }: { gameId: string }) => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = async () => {
    try {
      const response = await fetch(`/api/scores/${gameId}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setScores(data);
      }
    } catch (error) {
      console.error('Error fetching scores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 5000);
    return () => clearInterval(interval);
  }, [gameId]);

  return (
    <div className='w-64 h-1/2 bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800 text-center'>High Scores</h2>
      {loading ? (
        <div className='text-center text-gray-500'>Loading scores...</div>
      ) : (
        <div className='space-y-3'>
          {scores.length > 0 ? (
            scores.map((score, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-2 rounded-lg ${
                  index === 0
                    ? 'bg-yellow-100'
                    : index === 1
                    ? 'bg-gray-100'
                    : index === 2
                    ? 'bg-orange-100'
                    : 'bg-white'
                }`}
              >
                <span className='font-semibold text-gray-700'>#{index + 1}</span>
                <span className='font-bold text-gray-900'>{score.score}</span>
              </div>
            ))
          ) : (
            <div className='text-center text-gray-500'>No scores yet</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;
