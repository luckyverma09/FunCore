import { GetServerSideProps } from 'next';
import { connectToDatabase } from '../lib/mongodb';
import { ObjectId } from 'mongodb';
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
  try {
    const client = await connectToDatabase();
    const db = client.db();

    const leaderboard = await db
      .collection('scores')
      .aggregate([
        {
          $group: {
            _id: { $toObjectId: '$userId' },
            totalScore: { $sum: '$score' },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $unwind: '$userDetails',
        },
        {
          $project: {
            id: { $toString: '$_id' },
            username: '$userDetails.username',
            score: '$totalScore',
          },
        },
        {
          $sort: { score: -1 },
        },
        {
          $limit: 10,
        },
      ])
      .toArray();

    return {
      props: {
        entries: JSON.parse(JSON.stringify(leaderboard)),
      },
    };
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return {
      props: {
        entries: [],
      },
    };
  }
};

export default LeaderboardPage;
