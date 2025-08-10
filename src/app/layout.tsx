/* src/app/layout.tsx */
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ThreeBackgroundWrapper from './ThreeBackgroundWrapper';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://xinyi-li.vercel.app'), // 解决了 metadataBase 警告
  title: 'Xinyi Li - Portfolio',
  description: 'Software Engineer & Full-Stack Developer - Personal Portfolio Website',
  keywords: ['portfolio', 'software engineer', 'full-stack developer', 'web developer', 'react', 'next.js', 'xinyi li'],
  authors: [{ name: 'Xinyi Li' }],
  openGraph: {
    title: 'Xinyi Li - Portfolio',
    description: 'Software Engineer & Full-Stack Developer - Personal Portfolio Website',
    url: 'https://xinyi-li.vercel.app',
    siteName: 'Xinyi Li Portfolio',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Xinyi Li Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xinyi Li - Portfolio',
    description: 'Software Engineer & Full-Stack Developer - Personal Portfolio Website',
    creator: '@xinyi_li',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#8b5cf6" />
      </head>
      <body className={inter.className}>
        <ThreeBackgroundWrapper />
        <div className="main-content-container">
         {children}
        </div>
      </body>
    </html>
  )
}