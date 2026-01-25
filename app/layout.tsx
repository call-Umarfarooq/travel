import type { Metadata } from "next";
import { Poppins, Volkhov } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const volkhov = Volkhov({
  variable: "--font-volkhov",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Travel - Explore the World",
  description: "Discover amazing travel destinations and packages",
};

import { CartProvider } from '@/context/CartContext';
import WhatsAppButton from '@/components/layout/WhatsAppButton';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{__html: `
          @media (max-width: 768px) {
            ::-webkit-scrollbar {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
            }
            * {
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
          }
        `}} />
      </head>
      <body
        className={`${poppins.variable} ${volkhov.variable} font-sans antialiased overflow-x-hidden`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <CartProvider>
          {children}
        </CartProvider>
        <WhatsAppButton />
      </body>
    </html>
  );
}
