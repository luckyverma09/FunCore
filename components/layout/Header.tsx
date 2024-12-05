import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Header: React.FC = () => {
  const { data: session } = useSession();

  return (
    <header className="bg-black">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="Top"
      >
        <div className="w-full py-6 flex items-center justify-between border-b border-lime-500 lg:border-none">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-lime-400 text-2xl font-extrabold tracking-wide hover:text-purple-500 transition-colors"
            >
              FunCore
            </Link>
            <div className="hidden ml-10 space-x-8 lg:block">
              <Link
                href="/dashboard"
                className="text-base font-medium text-lime-300 hover:text-purple-400 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/games"
                className="text-base font-medium text-lime-300 hover:text-purple-400 transition-colors"
              >
                Games
              </Link>
            </div>
          </div>
          <div className="ml-10 space-x-4">
            {session ? (
              <>
                <span className="text-lime-300 text-base font-medium mr-4">
                  Welcome, {session.user.name}
                </span>
                <Link
                  href="/profile"
                  className="inline-block bg-lime-500 py-2 px-4 border border-transparent rounded-lg text-base font-medium text-black hover:bg-lime-400 transition-transform transform hover:scale-105"
                >
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="inline-block bg-gray-800 py-2 px-4 border border-lime-500 rounded-lg text-base font-medium text-lime-300 hover:bg-gray-700 hover:text-purple-300 transition-transform transform hover:scale-105"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-block bg-lime-500 py-2 px-4 border border-transparent rounded-lg text-base font-medium text-black hover:bg-lime-400 transition-transform transform hover:scale-105"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="inline-block bg-gray-800 py-2 px-4 border border-lime-500 rounded-lg text-base font-medium text-lime-300 hover:bg-gray-700 hover:text-purple-300 transition-transform transform hover:scale-105"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;