import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center py-2'>
      <Head>
        <title>FunCore</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='flex w-full flex-1 flex-col items-center justify-center px-20 text-center'>
        <h1 className='text-6xl font-bold text-white'>
          Welcome to <span className='text-lime-700'>FunCore</span>
        </h1>

        <p className='mt-3 text-2xl text-white'>Get started by exploring our games!</p>

        <div className='mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full'>
          <Link
            href='/games'
            className='group mt-6 w-96 rounded-xl border p-6 text-left bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg transition-transform transform hover:scale-105 hover:border-lime-500  duration-700 ease-in-out hover:shadow-lg'
          >
            <h3 className='text-2xl font-bold text-white transition-colors group-hover:text-lime-400'>
              Games &rarr;
            </h3>
            <p className='mt-4 text-xl text-white transition-colors group-hover:text-lime-400'>
              Explore our collection of exciting games.
            </p>
          </Link>

          <Link
            href='/leaderboard'
            className='group mt-6 w-96 rounded-xl border p-6 text-left bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg transition-transform transform hover:scale-105 hover:border-lime-500  duration-500 ease-in-out hover:shadow-lg'
          >
            <h3 className='text-2xl font-bold text-white transition-colors group-hover:text-lime-400'>
              Leaderboard &rarr;
            </h3>
            <p className='mt-4 text-xl text-white transition-colors group-hover:text-lime-400'>
              Check out the top players and their scores.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
