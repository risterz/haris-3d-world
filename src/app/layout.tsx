import type { Metadata } from 'next'
import { Fredoka, Plus_Jakarta_Sans } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-fredoka',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://haris-profile.vercel.app'),
  title: 'Haris — Playful 3D Driving Portfolio',
  description:
    'Drive through Haris Al-Harraz Bin Razali’s interactive 3D world to explore full-stack web apps, 3D WebGL playgrounds, skills, and engineering journey.',
  keywords: [
    '3D portfolio',
    'interactive 3D website',
    'Three.js',
    'React Three Fiber',
    'Next.js',
    'full-stack developer',
    'Haris Al-Harraz',
    'risterz',
  ],
  authors: [{ name: 'Haris Al-Harraz Bin Razali' }],
  creator: 'Haris Al-Harraz Bin Razali',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://haris-profile.vercel.app',
    siteName: 'Haris 3D Portfolio',
    title: 'Haris — Playful 3D Driving Portfolio',
    description:
      'Drive a 3D toy truck across a sunlit interactive world to explore projects, skills, and journey.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://haris-profile.vercel.app',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fredoka.variable} ${jakarta.variable}`}>
      <head>
        <meta name="theme-color" content="#F4C89A" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="font-sans bg-sand-300 text-ink-900 antialiased overflow-hidden selection:bg-sunny-500 selection:text-ink-900">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3200,
            style: {
              background: '#FFFBF2',
              color: '#1A1E2E',
              border: '2px solid #1A1E2E',
              boxShadow: '3px 3px 0px #1A1E2E',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '0.875rem',
            },
          }}
        />
      </body>
    </html>
  )
}
