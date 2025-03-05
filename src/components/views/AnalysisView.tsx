import React from 'react';
import { AdviceResponse } from "../../api/client";
import { useQuery } from '@tanstack/react-query';
import { portfolioApi } from '../../api/client';
import { useWallet } from '../../context/WalletContext';
import NewsCard from '../NewsCard';

const AnalysisView: React.FC = () => {
    const { walletAddress, isWalletVerified } = useWallet();
    
    const { data, isLoading, error, refetch } = useQuery<AdviceResponse>({
        queryKey: ['advice', walletAddress],
        queryFn: () => portfolioApi.getAdvice(walletAddress),
        enabled: !!walletAddress && isWalletVerified
      });

    const adviceData: AdviceResponse | undefined = data;

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

    if (!adviceData) {
        return <div className="text-center py-8">No analysis data available</div>;
    }

    return (
        <div className="gap-10 font-mulish text-primary-50 bg-primary-900 h-full w-full flex flex-col">
            
            <div className='bg-primary-800 py-8'>
                <div className='gap-4 p-4 bg-primary-900 flex justify-center lg:mx-40 rounded-2xl'>
                    <div className="flex flex-col">
                        <h2 className="font-montserrat font-bold text-2xl">Portfolio Analysis</h2>
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
    );
}

export default AnalysisView;