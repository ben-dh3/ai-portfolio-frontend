import { useState } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AdviceResponse, portfolioApi, Portfolio } from '../../api/client';
import { useWallet } from '../../context/WalletContext';
import NetworkBackground from "../IconsBackground";

interface SaveWalletViewProps {
  onWalletSaved?: (walletAddress: string, portfolio: any, advice: any) => void;
}

const SaveWalletView: React.FC<SaveWalletViewProps> = ({ onWalletSaved }) => {
    const { walletAddress, setWalletAddress, setWalletVerified } = useWallet();
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const WALLET_ADDRESS_REGEX = /^(0x)?[0-9a-fA-F]{40}$/;

    const { mutate, isPending } = useMutation({
        mutationFn: async (address: string) => {
            const cachedPortfolio = queryClient.getQueryData<{ portfolio: Portfolio }>(['portfolio', address]);
            const cachedAdvice = queryClient.getQueryData<AdviceResponse>(['advice', address]);
            
            if (cachedPortfolio && cachedAdvice) {
                console.log('Using cached portfolio and advice data');
                return {
                    portfolio: cachedPortfolio.portfolio,
                    advice: cachedAdvice
                };
            }
            
            console.log('Fetching fresh portfolio and advice data');
            return portfolioApi.getPortfolioWithAdvice(address);
        },
        onSuccess: (data: { portfolio: Portfolio, advice: AdviceResponse }) => {
            setWalletVerified(true);
            if (onWalletSaved) {
                onWalletSaved(walletAddress, data.portfolio, data.advice);
            }
            console.log('Portfolio and advice loaded:', data);
        },
        onError: (err: Error) => {
            setError('Failed to load portfolio data. Please check the wallet address and try again.');
            console.error(err);
        }
    });

    const validateWalletAddress = (address: string) => {
        return WALLET_ADDRESS_REGEX.test(address);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!validateWalletAddress(walletAddress)) {
            setError('Invalid wallet address format');
            return;
          }

        mutate(walletAddress);
    };

    return (
        <div className="font-mulish text-primary-50 bg-primary-900 min-h-screen w-full flex items-center justify-center">
            <div className="container flex flex-col lg:flex-row w-full px-4 md:px-8 lg:px-16 py-16 gap-8">
                <div className="flex-1">
                    <h1 className="font-montserrat font-semibold text-4xl md:text-5xl lg:text-6xl">
                        AI PORTFOLIO ADVISOR
                    </h1>
                    <p className="text-lg mt-4">
                        The AI Portfolio Advisor is a tool that fetches your crypto wallet address portfolio data, and analyses it based on current news sentiment. Giving you current advice on your investment allocation.
                    </p>

                    {/* Address entry bar */}
                    <form onSubmit={handleSubmit} className="mt-8">
                        <div className="">
                            <input
                                id="walletAddress"
                                type="text"
                                placeholder="Wallet Address (0x000...000)"
                                className="font-mulish w-full placeholder-primary-200 bg-primary-700 py-3 px-4 text-center"
                                value={walletAddress}
                                onChange={(e) => setWalletAddress(e.target.value)}
                                disabled={isPending}
                            />
                            {error && (
                                <p className="mt-2 text-sm text-error">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isPending || !walletAddress}
                                className="w-full bg-primary-700 hover:bg-primary-800 text-white py-2 px-4 rounded mt-4 disabled:opacity-50"
                            >
                                {isPending ? 'Loading...' : 'Analyze Portfolio'}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="flex-1 flex items-center justify-center relative">
                   <NetworkBackground />
                </div>
            </div>
        </div>
    );
}

export default SaveWalletView