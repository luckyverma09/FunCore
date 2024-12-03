import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

type GameData = {
  _id: string;
  title: string;
  description: string;
  category: string;
  // Add other game properties as needed
};

type ErrorResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GameData | ErrorResponse>
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid game ID' });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db();
    const gamesCollection = db.collection('games');

    const game = await gamesCollection.findOne({ _id: new ObjectId(id) });

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.status(200).json({
      _id: game._id.toString(),
      title: game.title,
      description: game.description,
      category: game.category,
      // Include other game properties as needed
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
