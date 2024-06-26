'use client';

import './global.css';
import AppHeader from '../components/Header/AppHeader';
import AppFooter from '../components/Footer/AppFooter';
import AppProviders from './providers';
import Head from 'next/head';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <Head>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
      </Head>
      <body>
        <AppProviders className="h-screen flex flex-col justify-between">
          <AppHeader></AppHeader>
          <main className="grow p-5">{children}</main>
          <AppFooter></AppFooter>
        </AppProviders>
      </body>
    </html>
  );
}
