import { Heading } from './_components/heading';
import { Footer } from './_components/footer';
import { Heroes } from './_components/heroes';

export default function homePage() {
  return (
    <div className='min-h-full flex flex-col dark:bg-[#1f1f1f] bg-gradient-animation'>
      <div className='flex flex-col md:flex-row justify-center items-center md:justify-between gap-y-8 md:gap-x-12 flex-1 px-10 md:px-20 pb-10'>
        <Heading />
        <Heroes />
      </div>
      <Footer />
    </div>
  );
}
