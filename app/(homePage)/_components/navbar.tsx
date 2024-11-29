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
        'z-50 bg-background dark:bg-[#1f1f1f]  fixed top-0 w-full p-6 flex items-center',
        scrolled && 'border-b shadow-sm'
      )}
    >
      <Logo />
      <div className='ml-auto flex items-center gap-x-2'>
        {isLoading && <Spinner />}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode='modal'>
              <Button variant='ghost' size='sm'>
                Log In
              </Button>
            </SignInButton>
            <SignInButton mode='modal'>
              <Button size='sm'>Play</Button>
            </SignInButton>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <Button variant='ghost' asChild>
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
