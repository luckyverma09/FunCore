import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { connectToDatabase } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db();

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { username, email } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}