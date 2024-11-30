'use client';

import { useScrollTop } from '@/hooks/use-scroll-top';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { useConvexAuth } from 'convex/react';
import { SignInButton, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';
import { Ghost } from 'lucide-react';
import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';

const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();

  return (
    <div
      className={cn(
        'z-50 fixed top-0 w-full p-6 flex items-center transition-all duration-300',
        scrolled
          ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-md border-b border-gray-200'
          : 'bg-background dark:bg-[#1f1f1f]'
      )}
    >
      <Logo />
      <div className='ml-auto flex items-center gap-x-4'>
        {isLoading && <Spinner />}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode='modal'>
              <Button
                variant='ghost'
                size='sm'
                className='hover:text-white hover:bg-purple-600 transition-all duration-300 rounded-full'
              >
                Log In
              </Button>
            </SignInButton>
            <SignInButton mode='modal'>
              <Button
                size='sm'
                className='bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition-all duration-300 rounded-full px-6 py-2'
              >
                Play
              </Button>
            </SignInButton>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <Button
              variant='ghost'
              asChild
              className='hover:text-white hover:bg-blue-600 transition-all duration-300 rounded-full'
            >
              <Link href='/documents'>Play</Link>
            </Button>
            <UserButton afterSignOutUrl='/' />
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
