import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

export interface NewsItem {
  title: string;
  url: string;
  domain: string;
  created_at?: string;
  published_at?: string;
}

interface NewsCardProps {
  news: NewsItem[];
  type: 'bearish' | 'bullish';
}

const NewsCard: React.FC<NewsCardProps> = ({ news, type }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNavigation = (direction: 'next' | 'prev') => {
    const totalNews = news.length;
    setCurrentIndex((prevIndex) => {
      if (direction === 'next') {
        return (prevIndex + 1) % totalNews;
      } else {
        return (prevIndex - 1 + totalNews) % totalNews;
      }
    });
  };

  if (!news || news.length === 0) return null;

  const currentNews = news[currentIndex];

  return (
    <div className="h-40 bg-primary-800 rounded-2xl flex flex-row">

        <button 
            onClick={() => handleNavigation('prev')} 
            className="rounded-l-2xl w-40 justify-center items-center flex text-primary-300 hover:text-primary-100 hover:bg-primary-700"
            aria-label="Previous news"
        >
            <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </button>

        <div className='w-full flex'>
            <a 
            href={currentNews.url} 
            target="_blank" 
            className="w-full p-4 justify-center flex flex-col text-primary-300 hover:text-primary-100 hover:bg-primary-700"
            >
                <div className="flex items-center justify-between">
                    <div className={`font-bold ${type === 'bearish' ? 'text-secondary-100' : 'text-secondary-50'}`}>
                        {type === 'bearish' ? 'Bearish' : 'Bullish'}
                    </div>
                    <div className="text-xs text-primary-400">{currentNews.domain}</div>
                </div>
                <div className="text-primary-50 font-semibold">{currentNews.title}</div>
            
                <FontAwesomeIcon icon={faExternalLinkAlt} className="self-end" />
            </a>
        </div>

        <button 
          onClick={() => handleNavigation('next')} 
          className="rounded-r-2xl w-40 justify-center items-center flex text-primary-400 hover:text-primary-200 hover:bg-primary-700"
          aria-label="Next news"
        >
          <FontAwesomeIcon icon={faChevronRight} size="lg" />
        </button>
      
        
        
        
    </div>
  );
};

export default NewsCard;