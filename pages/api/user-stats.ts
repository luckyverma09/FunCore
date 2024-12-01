import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });

    if (!session || !session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db();

    // Fetch user stats from the database
    // This is a placeholder implementation. You'll need to adjust this based on your actual data structure
    const userStats = await db.collection('userStats').findOne({ userEmail: session.user.email });

    if (!userStats) {
      return res.status(404).json({ message: 'User stats not found' });
    }

    res.status(200).json(userStats);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}
