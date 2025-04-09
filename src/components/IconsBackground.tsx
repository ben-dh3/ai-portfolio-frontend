import React from 'react';
import Image from 'next/image';

const networkIcons = [
  { src: "https://storage.googleapis.com/zapper-fi-assets/networks/ethereum-icon.png", alt: "Ethereum", delay: 0, top: 0, left: 0, width: 40 },
  { src: "https://storage.googleapis.com/zapper-fi-assets/networks/arbitrum-icon.png", alt: "Arbitrum", delay: 4.59647, top: 0.587486, left: 63.6411, width: 83.5594 },
  { src: "https://storage.googleapis.com/zapper-fi-assets/networks/avalanche-icon.png", alt: "Avalanche", delay: 2.34602, top: 21.5673, left: 2.97062, width: 83.3803 },
  { src: "https://storage.googleapis.com/zapper-fi-assets/networks/base-icon.png", alt: "Base", delay: 3.47063, top: 32.6369, left: 50.5388, width: 60.1568 },
  { src: "https://storage.googleapis.com/zapper-fi-assets/networks/binance-smart-chain-icon.png", alt: "BNB Chain", delay: 0.273275, top: 47.5073, left: 1.56727, width: 47.1055 },
  { src: "https://storage.googleapis.com/zapper-fi-assets/networks/fantom-icon.png", alt: "Fantom", delay: 0.925998, top: 75.4743, left: 30.5173, width: 89.0363 },
];

const NetworkBackground = () => {
  return (
    <div 
      className="relative h-full w-full overflow-hidden"
      style={{ 
        filter: 'blur(3px)', 
        userSelect: 'none', 
        pointerEvents: 'none' 
      }}
    >
      <div 
        className="absolute inset-0 z-1"
        style={{
          background: 'linear-gradient(to right, var(--colors-background) 0, var(--colors-background) 180px, transparent, var(--colors-background) calc(100% - 320px), var(--colors-background) 100%)'
        }}
      >
        {networkIcons.map((icon, index) => (
          <Image
            key={index}
            src={icon.src}
            alt={icon.alt}
            className="absolute opacity-20 rounded-[25%] animate-float"
            style={{
              top: `${icon.top}%`,
              left: `${icon.left}%`,
              width: `${icon.width}px`,
              animationDelay: `${icon.delay}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NetworkBackground;