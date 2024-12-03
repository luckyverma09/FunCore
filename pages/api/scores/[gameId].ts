import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { connectToDatabase } from '../../../lib/mongodb';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'You must be signed in to save scores.' });
  }

  const { gameId } = req.query;
  const client = await connectToDatabase();
  const db = client.db();

  if (req.method === 'POST') {
    try {
      const { score } = req.body;
      await db.collection('scores').insertOne({
        userId: session.user.id,
        gameId,
        score,
        createdAt: new Date(),
      });
      return res.status(200).json({ message: 'Score saved successfully' });
    } catch (error) {
      console.error('Error saving score:', error);
      return res.status(500).json({ message: 'Error saving score' });
    }
  }

  if (req.method === 'GET') {
    try {
      const scores = await db
        .collection('scores')
        .find({ gameId })
        .sort({ score: -1 })
        .limit(10)
        .toArray();
      return res.status(200).json(scores);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching scores' });
    }
  }
}
