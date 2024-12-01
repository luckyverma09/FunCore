// app/games/page.tsx
import { GameWrapper } from '@/components/games/GameWrapper';

export default function GamesPage() {
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>Games</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <GameWrapper gameName='2048' />
        <GameWrapper gameName='flappy-bird' />
      </div>
    </div>
  );
}
