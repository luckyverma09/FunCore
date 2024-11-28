import Image from 'next/image';

export const Heroes = () => {
  return (
    <div className='flex items-center justify-center max-w-5xl'>
      <div className='relative w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] md:h-[650px] md:w-[550px]'>
        <Image
          src='/homepage.png'
          fill
          className='object-contain dark:hidden'
          alt='Documents'
        />
      </div>
    </div>
  );
};


// import Image from 'next/image';

// export const Heroes = () => {
//   return (
//     <div className='flex flex-col items-center justify-center max-w-5xl'>
//       <div className='flex items-center'>
//         <div className='relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px]'>
//           <Image src='/homepage.png' fill className=' object-contain dark:hidden' alt='Documents' />
//           {/* <Image
//             src="/documents-dark.png"
//             fill
//             className=" object-contain hidden dark:block"
//             alt="Documents"
//           /> */}
//         </div>

//         {/* <div className=" relative h-[400px] w-[400px] hidden md:block">
//           <Image
//             src="/reading.png"
//             fill
//             className=" object-contain dark:hidden"
//             alt="Reading"
//           />
//           <Image
//             src="/reading-dark.png"
//             fill
//             className=" object-contain hidden dark:block"
//             alt="Reading"
//           />
//         </div> */}
//       </div>
//     </div>
//   );
// };
