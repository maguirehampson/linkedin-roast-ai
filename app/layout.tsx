import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: 'LinkedIn Roast AI - Get Brutally Honest Feedback',
  description: 'Upload your LinkedIn profile and get brutally honest feedback from our AI career coach. Prepare to get roasted!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-900 text-white">
          <div className="relative">
            {children}
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  )
} 