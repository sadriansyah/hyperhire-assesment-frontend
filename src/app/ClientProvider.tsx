'use client';

import React from 'react';
import { Provider } from 'react-redux';
import store from '@/store';
import localFont from 'next/font/local';

// Load fonts
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </Provider>
  );
};

export default ClientProvider;
