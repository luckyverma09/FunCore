import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/database';

export async function GET() {
  const leaderboard = await getLeaderboard('Game2048');
  return NextResponse.json(leaderboard);
}
