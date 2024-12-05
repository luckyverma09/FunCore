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
            _id: { $toObjectId: '$userId' }, // Convert userId to ObjectId for matching
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
            id: { $toString: '$_id' }, // Ensure _id is returned as a string
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
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
}
