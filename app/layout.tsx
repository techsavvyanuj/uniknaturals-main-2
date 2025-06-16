import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/hooks/useCart';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Uniknaturals - Natural Hair and Skin Care Products',
  description: 'Discover high-quality natural hair and skin care products by Uniknaturals. Made with organic ingredients for healthy and beautiful hair and skin.',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-cream min-h-screen flex flex-col">
        <CartProvider>
          <AnnouncementBar />
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
