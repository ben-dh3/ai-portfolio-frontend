'use client';

import { useQuery } from '@tanstack/react-query';
import { Portfolio, portfolioApi } from '../../lib/api';
import { useWallet } from '../../context/WalletContext';
import PortfolioChart from '../../components/PortfolioChart';
import WalletContainer from '../../components/WalletContainer';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const networkIcons: Record<string, string> = {
    "Arbitrum": "/networks/arbitrum.svg",
    "Base": "/networks/base.svg",
    "Bnb": "/networks/bnb.svg",
    "Ethereum": "/networks/eth_logo.svg",
    "Optimism": "/networks/optimism.svg",
    "Polygon": "/networks/pol-token.svg",    
};

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

const formatBalance = (balance: number): string => {
    if (balance >= 1_000_000) {
        return `${(balance / 1_000_000).toFixed(2)}M`;
    } else if (balance >= 1_000) {
        return `${(balance / 1_000).toFixed(2)}K`;
    } else {
        return balance.toFixed(4);
    }
};

export default function PortfolioPage() {
  const { walletAddress, isWalletVerified, clearWallet } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!walletAddress || !isWalletVerified) {
      router.push('/');
    }
  }, [walletAddress, isWalletVerified, router]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['portfolio', walletAddress],
    queryFn: () => portfolioApi.refreshPortfolio(walletAddress),
    enabled: !!walletAddress && isWalletVerified,
  });

  const portfolioData: Portfolio | undefined = data?.portfolio;

  if (!portfolioData) {
    return <div className="text-center py-8">No portfolio data available</div>;
}

if (isLoading) {
    return <div className="text-center py-8">Loading portfolio data...</div>;
}

if (error) {
    return (
        <div className="text-center py-8">
            <p className="text-primary-100 mb-4">Error loading portfolio data</p>
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
      
      <div className="gap-10 bg-primary-900 h-full w-full flex flex-col">

<div className='bg-primary-800 py-8'>
    <div className="lg:gap-20 lg:mx-40 flex flex-col lg:flex-row">
        
        {/* Pie Chart */}
        <div className="flex flex-1 flex-row gap-4">
            <div className='font-bold text-2xl'>
                Portfolio Summary
            </div>
            <div>
                <PortfolioChart 
                    holdings={portfolioData.holdings} 
                    totalValue={portfolioData.totalValue} 
                />
            </div>
        </div>

        {/* Total Value Card */}
        <div className="justify-end flex flex-1 flex-col ">
            <div className='flex justify-between p-4 text-primary-100 bg-primary-900 rounded-2xl'>
                
                <div className='flex flex-col justify-center'>
                    <h2 className="text-md">Total Portfolio Value</h2>
                    <p className="text-primary-50 font-bold text-2xl">
                        {formatCurrency(portfolioData.totalValue)}
                    </p>
                    <p className="text-sm">
                        Last updated: {new Date(portfolioData.lastUpdated).toLocaleString()}
                    </p>
                </div>

                {/* Refresh Button in top right */}
                <button 
                    onClick={() => refetch()}
                    className="flex w-10 h-10 items-center justify-center bg-primary-700 hover:bg-primary-600 p-2 rounded-full"
                    aria-label="Refresh portfolio data"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                    </svg>
                </button>
            </div>   
        </div> 
    </div>
</div>

<div className='text-primary-50 lg:mx-40'>
    {/* Token List Header */}
    <div className="grid grid-cols-7 gap-4 px-4 py-2 bg-primary-700 font-semibold rounded-t-lg">
        <div className="col-span-2">Token</div>
        <div className="text-right">Price</div>
        <div className="text-right">Balance</div>
        <div className="text-right">Value</div>
        <div className="text-center">Network</div>
    </div>

    {/* Token List */}
    <div className="bg-primary-800 flex-1">
        {portfolioData.holdings.length === 0 ? (
            <div className="text-center py-8 text-primary-100">No tokens found</div>
        ) : (
            portfolioData.holdings.map((token, index) => (
                <div 
                    key={`${token.network}-${token.symbol}-${index}`}
                    className="grid grid-cols-7 gap-4 px-4 py-3 border-b border-primary-600 hover:bg-primary-900"
                >
                    {/* Token Icon & Symbol */}
                    <div className="col-span-2 flex items-center gap-2">
                        {token.imgUrl ? (
                            <Image 
                                src={token.imgUrl} 
                                alt={token.symbol} 
                                width={20}
                                height={20}
                                className="w-8 h-8 rounded-full"
                            />
                        ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-center">
                                <span className="text-xs">{token.symbol.substring(0, 2)}</span>
                            </div>
                        )}
                        <div>
                            <div className="font-medium">{token.symbol}</div>
                            <div className="text-xs text-gray-500">{token.name}</div>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="text-right self-center">
                        {formatCurrency(token.price)}
                    </div>

                    {/* Balance */}
                    <div className="text-right self-center">
                        {formatBalance(token.balance)}
                    </div>

                    {/* Value */}
                    <div className="text-right self-center font-medium">
                        {formatCurrency(token.balanceUSD)}
                    </div>

                    {/* Network */}
                    <div className="flex items-center justify-center">
                        <div className="flex items-center gap-1">
                            {networkIcons[token.network] ? (
                                <Image 
                                    src={networkIcons[token.network]} 
                                    alt={token.network} 
                                    width={20} 
                                    height={20}
                                    className="w-5 h-5 rounded-full"
                                />
                            ) : (
                                <div className="flex w-5 h-5 bg-gray-200 text-gray-800 font-bold text-center justify-center items-center rounded-full">
                                    {token.network.substring(0,1)}
                                </div>
                            )}
                            <span className="text-sm">{token.network}</span>
                        </div>
                    </div>
                </div>
            ))
        )}
    </div>
</div>
</div>
    </div>
  );
}