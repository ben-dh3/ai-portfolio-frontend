import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
  },
});

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

export interface NewsItem {
  title: string;
  url: string;
  domain: string;
  created_at?: string;
  published_at?: string;
}

export interface AdviceResponse {
  walletAddress: string;
  lastUpdated: string;
  recommendations: {
    text: {
      text: string,
      type: string
    },
    type: string
  };
  news?: {
    bearish: NewsItem[];
    bullish: NewsItem[];
  };
}

// API functions
export const portfolioApi = {
  saveWallet: async (walletAddress: string): Promise<{ walletAddress: string }> => {
    try {
      const response = await apiClient.post('/wallets', { walletAddress });
      return response.data;
    } catch (error) {
      console.error('Error saving wallet:', error);
      throw error;
    }
  },

  refreshPortfolio: async (walletAddress: string): Promise<{ portfolio: Portfolio }> => {
    try {
      const response = await apiClient.get(`/wallets/${walletAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error refreshing portfolio:', error);
      throw error;
    }
  },

  getAdvice: async (walletAddress: string): Promise<AdviceResponse> => {
    try {
      const response = await apiClient.get(`/wallets/${walletAddress}/advice`);
      return response.data;
    } catch (error) {
      console.error('Error getting advice:', error);
      throw error;
    }
  },

  getPortfolioWithAdvice: async (walletAddress: string): Promise<{
    portfolio: Portfolio;
    advice: AdviceResponse;
  }> => {
    try {
      await portfolioApi.saveWallet(walletAddress).catch(error => {
        if (error.response?.status !== 400) {
          throw error;
        }
      });

      const portfolioResponse = await portfolioApi.refreshPortfolio(walletAddress);
      
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