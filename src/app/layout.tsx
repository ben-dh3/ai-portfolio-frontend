import { mulish } from './fonts';
import './globals.css';
import type { Metadata } from 'next';
import ClientProviders from './ClientProviders';

export const metadata: Metadata = {
  title: 'AI Crypto Portfolio',
  description: 'Analyze your crypto portfolio with AI-powered insights',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mulish.className} antialiased`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}