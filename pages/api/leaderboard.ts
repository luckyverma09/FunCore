import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db();

    const leaderboard = await db
      .collection('scores')
      .aggregate([
        {
          $group: {
            _id: '$userId',
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
            _id: 0,
            username: '$userDetails.username',
            score: '$totalScore',
          },
        },
        {
          $sort: { score: -1 },
        },
      ])
      .toArray();

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
}
