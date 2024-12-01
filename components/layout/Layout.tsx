import React from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import styles from '../../styles/GradientBackground.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div className={`${styles.gradientBackground}`}>
        <Head>
          <title>Gaming Platform</title>
          <meta name='description' content='A next-generation gaming platform' />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <div className='flex flex-col min-h-screen'>
          <Header />
          <main className='flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8'>{children}</main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;
