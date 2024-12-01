import type { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, email, password } = req.body;
  console.log('Received signup request:', { username, email }); // Added logging

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db();

    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return res.status(422).json({ message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const result = await db.collection('users').insertOne({
      username,
      email,
      password: hashedPassword,
    });

    console.log('User created:', result.insertedId); // Added logging
    res.status(201).json({ message: 'User created', userId: result.insertedId });
  } catch (error) {
    console.error('Signup error:', error); // Added error logging
    if (error instanceof Error) {
      res.status(500).json({ message: 'Something went wrong', error: error.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
}
