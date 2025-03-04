import { useState } from 'react';
import './App.css';
import AnalysisView from './components/views/AnalysisView';
import PortfolioView from './components/views/PortfolioView';
import SaveWalletView from './components/views/SaveWalletView';
import { Portfolio, AdviceResponse } from './api/client';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import WalletContainer from './components/WalletContainer';
import { WalletProvider, useWallet } from './context/WalletContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 20,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { walletAddress, clearWallet, isWalletVerified } = useWallet();
  const [activeIndex, setActiveIndex] = useState(0);
  const queryClient = useQueryClient();
  
  // Handle wallet loaded from initial form
  const handleWalletSaved = (address: string, portfolio: Portfolio, advice: AdviceResponse) => {
    // Cache the data in React Query
    queryClient.setQueryData(['portfolio', address], { portfolio });
    queryClient.setQueryData(['advice', address], advice);
  };

  return (
    <div className="text-primary-50 bg-primary-900 h-screen flex flex-col">

      {/* Wallet display and nav */}
      {isWalletVerified && (
        <div className='bg-primary-800 font-mulish p-3 flex justify-between border-b border-primary-600'>
          
          <div className="">
            <div className="text-md flex gap-4">
              <button 
                className={`p-3 rounded-lg ${activeIndex === 0 ? 'bg-primary-700' : 'bg-primary-800 hover:bg-primary-700'}`}
                onClick={() => setActiveIndex(0)}
              >
                Portfolio
              </button>
              <button 
                className={`p-3 rounded-lg ${activeIndex === 1 ? 'bg-primary-700' : 'bg-primary-800 hover:bg-primary-700'}`}
                onClick={() => setActiveIndex(1)}
              >
                Analysis
              </button>
            </div>
          </div>
          
          <WalletContainer 
            walletAddress={walletAddress}
            onClose={clearWallet}
          />

        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1">
        {!walletAddress || !isWalletVerified ? (
          <SaveWalletView onWalletSaved={handleWalletSaved} />
        ) : (
          <>
            {activeIndex === 0 && (
              <PortfolioView />
            )}
            
            {activeIndex === 1 && (
              <AnalysisView />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <AppContent />
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;
