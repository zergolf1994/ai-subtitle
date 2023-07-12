import './globals.css';
import type { AppProps } from 'next/app';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className='bg-white dark:bg-gray-800 w-full h-auto flex justify-center items-center'>
      <div className='sm:w-full max-sm:px-2 sm:py-12 md:w-10/12 xl:w-8/12 h-full flex flex-col justify-between'>
        <div className='flex-none max-sm:pt-16 md:p-12'><Header></Header></div>
        <main className='grow w-full sm:p-4 md:p-12'>
          <Component {...pageProps} />
        </main>
        <div className='flex-none max-sm:pb-2'><Footer></Footer></div>
      </div>
    </div>
  );
}
