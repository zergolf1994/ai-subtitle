import './globals.css';
import type { AppProps } from 'next/app';
import Footer from '@/components/footer';
import Header from '@/components/header';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className='bg-white dark:bg-gray-800 w-full h-full flex justify-center items-center'>
      <div className='sm:w-full max-sm:px-2 sm:py-0 md:w-10/12 xl:w-8/12 h-full flex flex-col justify-between items-center'>
        <div className='flex-none h-64 flex justify-center items-center'>
          <Header></Header>
        </div>
        <main className='grow w-full md:w-10/12'>
          <Component {...pageProps} />
        </main>
        <div className='flex-none h-28 flex justify-center items-center'>
          <Footer></Footer>
        </div>
      </div>
    </div>
  );
}
