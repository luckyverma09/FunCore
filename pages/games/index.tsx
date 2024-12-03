import Link from 'next/link';

const games = [
  { id: 'sudoku', title: 'Sudoku' },
  { id: 'flappy-bird', title: 'Flappy Bird' },
  { id: 'stick-hero', title: 'Stick Hero' },
  { id: '2048', title: '2048' },
];

const GamesPage = () => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Available Games</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {games.map((game) => (
          <Link key={game.id} href={`/games/${game.id}`}>
            <div className='block p-6 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 cursor-pointer'>
              <h2 className='text-xl font-semibold text-center'>{game.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;
