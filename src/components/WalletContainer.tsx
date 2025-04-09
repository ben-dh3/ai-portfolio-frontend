import React from 'react';

interface WalletContainerProps {
  walletAddress: string;
  onClose: () => void;
}

const WalletContainer: React.FC<WalletContainerProps> = ({ 
  walletAddress, 
  onClose
}) => {
  if (!walletAddress) return null;
  
  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
      <button 
        onClick={onClose}
        className="rounded-xl p-3 border border-primary-600 bg-primary-800 text-primary-50 hover:bg-primary-700 transition-colors"
        aria-label="Close wallet"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">
              {formatWalletAddress(walletAddress)}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </div>
      </button>
  );
};

export default WalletContainer;