'use client';

import { useQuery } from '@tanstack/react-query';
import { AdviceResponse, portfolioApi } from '../../lib/api';
import { useWallet } from '../../context/WalletContext';
import WalletContainer from '../../components/WalletContainer';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import NewsCard from '@/components/NewsCard';
import Link from 'next/link';

export default function AnalysisPage() {
  const { walletAddress, isWalletVerified, clearWallet } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!walletAddress || !isWalletVerified) {
      router.push('/');
    }
  }, [walletAddress, isWalletVerified, router]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['advice', walletAddress],
    queryFn: () => portfolioApi.getAdvice(walletAddress),
    enabled: !!walletAddress && isWalletVerified,
  });

  const adviceData: AdviceResponse | undefined = data;

  if (!adviceData) {
    return <div className="text-center py-8">No analysis data available</div>;
}

if (isLoading) {
    return <div className="text-center py-8">Loading analysis data...</div>;
}

if (error) {
    return (
        <div className="text-center py-8">
            <p className="text-red-400 mb-4">Error loading analysis data</p>
            <button 
                onClick={() => refetch()}
                className="bg-primary-700 hover:bg-primary-600 text-primary-50 px-4 py-2 rounded"
            >
                Try Again
            </button>
        </div>
    );
}

  if (!isWalletVerified) return null;

  return (
    <div className="gap-10 bg-primary-900 h-full w-full flex flex-col">
      <div className="bg-primary-800 p-3 flex justify-between border-b border-primary-600">
        <div className="text-md flex gap-4">
          <Link href="/portfolio" className="p-3 rounded-lg bg-primary-700">Portfolio</Link>
          <Link href="/analysis" className="p-3 rounded-lg bg-primary-800 hover:bg-primary-700">Analysis</Link>
        </div>
        <WalletContainer walletAddress={walletAddress} onClose={clearWallet} />
      </div>
      
      <div className="gap-10 text-primary-50 bg-primary-900 h-full w-full flex flex-col">
            
            <div className='bg-primary-800 py-8'>
                <div className='gap-4 p-4 bg-primary-900 flex justify-center lg:mx-40 rounded-2xl'>
                    <div className="flex flex-col">
                        <h2 className="font-bold text-2xl">Portfolio Analysis</h2>
                        <p className="text-sm">Last updated: {new Date(adviceData.lastUpdated).toLocaleString()}</p>
                    </div>
                    <button 
                        onClick={() => refetch()}
                        className="flex w-10 h-10 items-center justify-center bg-primary-700 hover:bg-primary-600 p-2 rounded-full"
                        aria-label="Refresh analysis data"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div className='gap-4 flex flex-col lg:flex-row lg:mx-40'>

                <div className="rounded-2xl p-4 flex-1 whitespace-pre-line text-wrap bg-primary-800">
                {adviceData.recommendations.text.text}
                </div>

                <div className='flex-1 space-y-4'>
                    {adviceData.news?.bullish && (
                        <NewsCard 
                            news={adviceData.news.bullish} 
                            type="bullish" 
                        />
                    )}
                    {adviceData.news?.bearish && (
                        <NewsCard 
                            news={adviceData.news.bearish} 
                            type="bearish" 
                        />
                    )}
                </div>
            </div>
           
        </div>
    </div>
  );
}