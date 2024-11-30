import Image from 'next/image';

export const Heroes = () => {
  return (
    <div className='flex items-center justify-center max-w-5xl'>
      <div className='relative w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] md:h-[650px] md:w-[550px] overflow-hidden group '>
        <Image
          src='/homepage.png'
          fill
          className='object-contain mt-20 dark:hidden transition-transform duration-500 group-hover:scale-110'
          alt='Documents'
        />
      </div>
    </div>
  );
};

