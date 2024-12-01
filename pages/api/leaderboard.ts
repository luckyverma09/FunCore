import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';

type LeaderboardEntry = {
  id: string;
  username: string;
  score: number;
  gameId?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LeaderboardEntry[] | { message: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { gameId } = req.query;

  try {
    const client = await connectToDatabase();
    const db = client.db();

    let query = {};
    if (gameId) {
      query = { gameId: gameId as string };
    }

    const leaderboard = await db
      .collection('scores')
      .aggregate([
        { $match: query },
        { $sort: { score: -1 } },
        { $limit: 100 },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $project: {
            id: '$_id',
            username: { $arrayElemAt: ['$user.username', 0] },
            score: 1,
            gameId: 1,
          },
        },
      ])
      .toArray();

    res.status(200).json(leaderboard as LeaderboardEntry[]);
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
}
