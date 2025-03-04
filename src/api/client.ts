import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const API_KEY = process.env.REACT_APP_API_KEY; 

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
  },
});

// Types for API responses
export interface TokenHolding {
  symbol: string;
  name: string;
  balance: number;
  balanceUSD: number;
  price: number;
  imgUrl: string;
  tokenAddress: string;
  network: string;
}

export interface Portfolio {
  holdings: TokenHolding[];
  totalValue: number;
  lastUpdated: string;
}

export interface AdviceResponse {
  walletAddress: string;
  lastUpdated: string;
  recommendations: {
    text: string,
    type: string
  }
}

// API functions
export const portfolioApi = {
  // Save a new wallet address
  saveWallet: async (walletAddress: string): Promise<{ walletAddress: string }> => {
    try {
      const response = await apiClient.post('/wallets', { walletAddress });
      return response.data;
    } catch (error) {
      console.error('Error saving wallet:', error);
      throw error;
    }
  },

  // Refresh portfolio data for a wallet
  refreshPortfolio: async (walletAddress: string): Promise<{ portfolio: Portfolio }> => {
    try {
      const response = await apiClient.get(`/wallets/${walletAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error refreshing portfolio:', error);
      throw error;
    }
  },

  // Get AI-generated advice for a wallet
  getAdvice: async (walletAddress: string): Promise<AdviceResponse> => {
    try {
      const response = await apiClient.get(`/wallets/${walletAddress}/advice`);
      return response.data;
    } catch (error) {
      console.error('Error getting advice:', error);
      throw error;
    }
  },

  // Combined function to handle complete portfolio flow
  getPortfolioWithAdvice: async (walletAddress: string): Promise<{
    portfolio: Portfolio;
    advice: AdviceResponse;
  }> => {
    /* check the cache first for stored data and return that if possible */
    try {
      // First save the wallet if it's new
      await portfolioApi.saveWallet(walletAddress).catch(error => {
        if (error.response?.status !== 400) {
          throw error;
        }
      });

      // Then refresh the portfolio data
      const portfolioResponse = await portfolioApi.refreshPortfolio(walletAddress);
      
      // Finally get advice based on the refreshed data
      const adviceResponse = await portfolioApi.getAdvice(walletAddress);
      
      return {
        portfolio: portfolioResponse.portfolio,
        advice: adviceResponse
      };
    } catch (error) {
      console.error('Error in portfolio flow:', error);
      throw error;
    }
  }
};