import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Compare Music Artists - Stats, Charts & Awards | Artist Compare",
    template: "%s | Artist Compare"
  },
  description: "Compare music artists side-by-side. View detailed stats, Billboard charts, Grammy awards, RIAA certifications, and streaming data.",
  keywords: [
    "compare artists",
    "music artist comparison", 
    "artist stats",
    "billboard charts",
    "grammy awards",
    "spotify streams",
    "music comparison tool",
    "artist battle",
    "music statistics",
    "artist rankings",
    "better artist",
    "worst artist",
    "more popular artist",
    "less popular artist",
    "artist comparison",
    "artist comparison tool",
    "less successful artist",
    "more successful artist",
    "less streamed artist",
    "more streamed artist",
    "less charted artist",
    "more charted artist",
    "less awarded artist",
    "more awarded artist",
    "less certified artist",
    "more certified artist",
    "less nominated artist",
    "more nominated artist",
    "less wins artist",
    "less nominations artist",
    "more nominations artist",
    "more grammy nominations artist",
    "more grammy wins artist",
  ],
  authors: [{ name: "Artist Compare" }],
  creator: "Artist Compare",
  publisher: "Artist Compare",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://artist-compare.vercel.app'), // Update with your actual domain
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://artist-compare.vercel.app',
    title: 'Compare Music Artists - Stats, Charts & Awards',
    description: 'Compare music artists side-by-side. View detailed stats, Billboard charts, Grammy awards, and streaming data.',
    siteName: 'Artist Compare',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Artist Compare - Compare Music Artists',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare Music Artists - Stats, Charts & Awards',
    description: 'Compare music artists side-by-side. View detailed stats, Billboard charts, Grammy awards, and streaming data.',
    images: ['/og-image.jpg'],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Artist Compare",
              "description": "Compare your favorite music artists side-by-side with detailed statistics, charts, and awards data.",
              "url": "https://artist-compare.vercel.app",
              "applicationCategory": "MusicApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "Artist Compare"
              },
              "featureList": [
                "Billboard Charts Comparison",
                "Grammy Awards Statistics", 
                "RIAA Certifications",
                "Spotify Streaming Data",
                "Artist Statistics"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
