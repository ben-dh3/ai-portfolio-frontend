import React, { createContext, useContext, useState, useEffect } from 'react';

interface WalletContextType {
  walletAddress: string;
  setWalletAddress: (address: string) => void;
  clearWallet: () => void;
  isWalletVerified: boolean;
  setWalletVerified: (isVerified: boolean) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isWalletVerified, setWalletVerified] = useState(false);

  useEffect(() => {
    const savedWallet = localStorage.getItem('walletAddress');
    if (savedWallet && isWalletVerified) {
      setWalletAddress(savedWallet);
    }
  }, [isWalletVerified]);
  
  // Save to localStorage
  useEffect(() => {
    if (walletAddress && isWalletVerified) {
      localStorage.setItem('walletAddress', walletAddress);
    } else {
      localStorage.removeItem('walletAddress');
    }
  }, [walletAddress, isWalletVerified]);
  
  const clearWallet = () => {
    setWalletAddress('');
    setWalletVerified(false);
  };
  
  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress, clearWallet, isWalletVerified, setWalletVerified }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};