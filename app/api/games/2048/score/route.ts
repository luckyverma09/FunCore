import { NextResponse } from 'next/server';
import { submitScore } from '@/lib/database';

export async function POST(req: Request) {
  const { userId, score } = await req.json();
  if (!userId || score == null) {
    return NextResponse.json({ error: 'User ID and score are required.' }, { status: 400 });
  }
  await submitScore('Game2048', userId, score);
  return NextResponse.json({ message: 'Score submitted successfully!' });
}
