import './globals.css';
import type { AppProps } from 'next/app';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className='bg-white dark:bg-gray-800 p-12 h-auto w-screen flex flex-col justify-between'>
      <div className='flex-none'><Header></Header></div>
      <main className='grow p-12'>
        <Component {...pageProps} />
      </main>
      <div className='flex-none'><Footer></Footer></div>
    </div>
  );
}
