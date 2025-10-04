import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Artist Compare - Music Artist Comparison Tool | Billboard Charts, Grammy Awards & Spotify Data',
  description: 'Discover Artist Compare - the ultimate music artist comparison platform. Compare Billboard charts, Grammy awards, RIAA certifications, and Spotify streaming data. Free tool for music fans and industry professionals.',
  keywords: [
    'artist compare',
    'music comparison tool',
    'billboard charts comparison',
    'grammy awards comparison',
    'spotify streaming data',
    'music artist statistics',
    'RIAA certifications',
    'music industry data',
    'artist popularity comparison',
    'music analytics',
    'billboard hot 100',
    'billboard 200',
    'music streaming statistics',
    'artist ranking tool',
    'music data visualization'
  ],
  openGraph: {
    title: 'About Artist Compare - Music Artist Comparison Tool',
    description: 'The comprehensive platform for comparing music artists across Billboard charts, Grammy awards, RIAA certifications, and Spotify streaming data.',
    type: 'website',
    url: 'https://artist-compare.com/about',
    siteName: 'Artist Compare',
    images: [
      {
        url: '/og-image',
        width: 1200,
        height: 630,
        alt: 'Artist Compare - Music Artist Comparison Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Artist Compare - Music Artist Comparison Tool',
    description: 'Compare your favorite artists across Billboard charts, Grammy awards, and Spotify data.',
    images: ['/og-image'],
  },
  alternates: {
    canonical: '/about',
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

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col gap-12">
      {/* Navbar */}
      <nav className="w-full h-24 bg-gradient-to-r from-[#00FF44]/5 to-[#99FFD9]/12 rounded-b-[4rem] flex justify-between px-8 py-4 animate-in fade-in duration-1000">
        <Link href="/" className="bg-[#5EE9B5] border-3 border-[#376348] flex rounded-full items-center gap-2 px-4">
          <img src="/icon.png" alt="Artist Compare Logo" className="w-15 h-15" />
          <span className="font-bold text-black text-4xl">Artist Compare</span>
        </Link>
        <div className="bg-[#5EE9B5] border-3 border-[#376348] flex rounded-full items-center px-4">
          <Link href="/" className="font-bold text-black text-2xl">Go Back</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center gap-18 px-4 sm:px-6">
        {/* Header Section */}
        <section className="flex flex-col items-center gap-2 animate-in fade-in duration-1000 delay-200">
          <div className="bg-[#5EE9B5] border-3 border-[#376348] flex rounded-full items-center px-2 py-1">
            <span className="font-bold text-black text-base">About Us</span>
          </div>
          <h1 className="text-white font-extrabold text-6xl text-center">
            The Ultimate <span className="bg-gradient-to-r from-white/100 to-[#5EE9B5] bg-clip-text text-transparent">Music Comparison</span> Platform
          </h1>
          <p className="text-white font-medium text-2xl text-center max-w-4xl">
            Compare your favorite artists with comprehensive data from Billboard charts, Grammy awards, RIAA certifications, and Spotify streaming statistics.
          </p>
        </section>

        {/* What is Artist Compare */}
        <section className="w-full max-w-6xl animate-in fade-in duration-1000 delay-400">
          <div 
            className="rounded-3xl border-4 border-[#5EE9B5]/50 p-8 sm:p-12"
            style={{
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 80%, rgba(94, 233, 181, 0.24) 110%)',
              boxShadow: '0 0 30px -17px rgba(94, 233, 181, 0.83) inset, 0 0 30px -8px rgba(94, 233, 181, 0.74)',
            }}
          >
            <h2 className="text-white font-bold text-4xl text-center mb-6">
              What is Artist Compare?
            </h2>
            <p className="text-white text-xl text-center max-w-5xl mx-auto leading-relaxed">
              Artist Compare is the most comprehensive music artist comparison platform available. 
              We aggregate real-time data from multiple authoritative sources to provide accurate, 
              up-to-date comparisons between your favorite artists across all major music metrics.
            </p>
          </div>
        </section>

        {/* Data Sources */}
        <section className="w-full max-w-6xl animate-in fade-in duration-1000 delay-600">
          <h2 className="text-white font-bold text-4xl text-center mb-8">
            Our Data Sources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              className="rounded-3xl border-4 border-[#5EE9B5]/50 p-6 hover:border-[#5EE9B5] transition-all duration-300"
              style={{
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 80%, rgba(94, 233, 181, 0.24) 110%)',
                boxShadow: '0 0 15px -10px rgba(94, 233, 181, 0.4) inset, 0 0 15px -5px rgba(94, 233, 181, 0.3)',
              }}
            >
              <h3 className="text-[#5EE9B5] font-bold text-2xl mb-4">Billboard Charts</h3>
              <p className="text-white text-lg leading-relaxed">
                Comprehensive data from Billboard Hot 100 and Billboard 200 charts, including 
                number one hits, top 10 entries, total weeks on chart, and album performance metrics.
              </p>
            </div>
            <div 
              className="rounded-3xl border-4 border-[#5EE9B5]/50 p-6 hover:border-[#5EE9B5] transition-all duration-300"
              style={{
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 80%, rgba(94, 233, 181, 0.24) 110%)',
                boxShadow: '0 0 15px -10px rgba(94, 233, 181, 0.4) inset, 0 0 15px -5px rgba(94, 233, 181, 0.3)',
              }}
            >
              <h3 className="text-[#5EE9B5] font-bold text-2xl mb-4">Grammy Awards</h3>
              <p className="text-white text-lg leading-relaxed">
                Complete Grammy Awards database including wins, nominations, and recognition 
                across all categories from the Recording Academy's official records.
              </p>
            </div>
            <div 
              className="rounded-3xl border-4 border-[#5EE9B5]/50 p-6 hover:border-[#5EE9B5] transition-all duration-300"
              style={{
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 80%, rgba(94, 233, 181, 0.24) 110%)',
                boxShadow: '0 0 15px -10px rgba(94, 233, 181, 0.4) inset, 0 0 15px -5px rgba(94, 233, 181, 0.3)',
              }}
            >
              <h3 className="text-[#5EE9B5] font-bold text-2xl mb-4">RIAA Certifications</h3>
              <p className="text-white text-lg leading-relaxed">
                Official RIAA (Recording Industry Association of America) certifications 
                including Gold, Platinum, and Diamond status for singles and albums.
              </p>
            </div>
            <div 
              className="rounded-3xl border-4 border-[#5EE9B5]/50 p-6 hover:border-[#5EE9B5] transition-all duration-300"
              style={{
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 80%, rgba(94, 233, 181, 0.24) 110%)',
                boxShadow: '0 0 15px -10px rgba(94, 233, 181, 0.4) inset, 0 0 15px -5px rgba(94, 233, 181, 0.3)',
              }}
            >
              <h3 className="text-[#5EE9B5] font-bold text-2xl mb-4">Spotify Data</h3>
              <p className="text-white text-lg leading-relaxed">
                Real-time Spotify streaming data including monthly listeners, total streams, 
                follower counts, and popularity rankings from the world's largest music platform.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full max-w-6xl animate-in fade-in duration-1000 delay-800">
          <h2 className="text-white font-bold text-4xl text-center mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="rounded-3xl border-4 border-[#5EE9B5]/50 p-8 text-center hover:border-[#5EE9B5] transition-all duration-300"
              style={{
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 80%, rgba(94, 233, 181, 0.24) 110%)',
                boxShadow: '0 0 15px -10px rgba(94, 233, 181, 0.4) inset, 0 0 15px -5px rgba(94, 233, 181, 0.3)',
              }}
            >
              <div className="bg-[#5EE9B5] text-black rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-white font-bold text-2xl mb-4">Search Artists</h3>
              <p className="text-white text-lg leading-relaxed">
                Use our intelligent search to find any artist in our comprehensive database of thousands of popular musicians.
              </p>
            </div>
            <div 
              className="rounded-3xl border-4 border-[#5EE9B5]/50 p-8 text-center hover:border-[#5EE9B5] transition-all duration-300"
              style={{
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 80%, rgba(94, 233, 181, 0.24) 110%)',
                boxShadow: '0 0 15px -10px rgba(94, 233, 181, 0.4) inset, 0 0 15px -5px rgba(94, 233, 181, 0.3)',
              }}
            >
              <div className="bg-[#5EE9B5] text-black rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-white font-bold text-2xl mb-4">Compare Side-by-Side</h3>
              <p className="text-white text-lg leading-relaxed">
                Select two artists and instantly see detailed comparisons across all major music industry metrics.
              </p>
            </div>
            <div 
              className="rounded-3xl border-4 border-[#5EE9B5]/50 p-8 text-center hover:border-[#5EE9B5] transition-all duration-300"
              style={{
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 80%, rgba(94, 233, 181, 0.24) 110%)',
                boxShadow: '0 0 15px -10px rgba(94, 233, 181, 0.4) inset, 0 0 15px -5px rgba(94, 233, 181, 0.3)',
              }}
            >
              <div className="bg-[#5EE9B5] text-black rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-white font-bold text-2xl mb-4">Analyze Results</h3>
              <p className="text-white text-lg leading-relaxed">
                Review comprehensive statistics, charts, and data visualizations to settle any music debate.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full max-w-6xl animate-in fade-in duration-1000 delay-1000">
          <h2 className="text-white font-bold text-4xl text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details 
              className="rounded-3xl border-4 border-[#5EE9B5]/50 p-6 hover:border-[#5EE9B5] transition-all duration-300"
              style={{
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 80%, rgba(94, 233, 181, 0.24) 110%)',
                boxShadow: '0 0 15px -10px rgba(94, 233, 181, 0.4) inset, 0 0 15px -5px rgba(94, 233, 181, 0.3)',
              }}
            >
              <summary className="text-white font-bold text-xl cursor-pointer mb-4">
                How often is the data updated?
              </summary>
              <p className="text-white text-lg leading-relaxed">
                Our data is updated regularly to ensure accuracy. Billboard charts are updated weekly, 
                while streaming data and certifications are refreshed as new information becomes available. 
                We strive to provide the most current data possible.
              </p>
            </details>
            <details 
              className="rounded-3xl border-4 border-[#5EE9B5]/50 p-6 hover:border-[#5EE9B5] transition-all duration-300"
              style={{
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 80%, rgba(94, 233, 181, 0.24) 110%)',
                boxShadow: '0 0 15px -10px rgba(94, 233, 181, 0.4) inset, 0 0 15px -5px rgba(94, 233, 181, 0.3)',
              }}
            >
              <summary className="text-white font-bold text-xl cursor-pointer mb-4">
                Can I compare any two artists?
              </summary>
              <p className="text-white text-lg leading-relaxed">
                Yes! Our database includes thousands of popular music artists from various genres and eras. 
                Simply search for any artist and compare them with any other artist in our comprehensive system. 
                We cover mainstream, indie, and international artists.
              </p>
            </details>
            <details 
              className="rounded-3xl border-4 border-[#5EE9B5]/50 p-6 hover:border-[#5EE9B5] transition-all duration-300"
              style={{
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 80%, rgba(94, 233, 181, 0.24) 110%)',
                boxShadow: '0 0 15px -10px rgba(94, 233, 181, 0.4) inset, 0 0 15px -5px rgba(94, 233, 181, 0.3)',
              }}
            >
              <summary className="text-white font-bold text-xl cursor-pointer mb-4">
                Is Artist Compare free to use?
              </summary>
              <p className="text-white text-lg leading-relaxed">
                Yes, Artist Compare is completely free to use. We believe everyone should have access 
                to comprehensive music artist data and comparisons. No registration or subscription required.
              </p>
            </details>
            <details 
              className="rounded-3xl border-4 border-[#5EE9B5]/50 p-6 hover:border-[#5EE9B5] transition-all duration-300"
              style={{
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 80%, rgba(94, 233, 181, 0.24) 110%)',
                boxShadow: '0 0 15px -10px rgba(94, 233, 181, 0.4) inset, 0 0 15px -5px rgba(94, 233, 181, 0.3)',
              }}
            >
              <summary className="text-white font-bold text-xl cursor-pointer mb-4">
                What makes Artist Compare different from other music comparison tools?
              </summary>
              <p className="text-white text-lg leading-relaxed">
                Artist Compare aggregates data from multiple authoritative sources (Billboard, Grammy, RIAA, Spotify) 
                in one comprehensive platform. Our real-time data updates, intuitive interface, and detailed 
                visualizations provide the most complete artist comparison experience available.
              </p>
            </details>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-6xl animate-in fade-in duration-1000 delay-1200 text-center">
          <div 
            className="rounded-3xl border-4 border-[#5EE9B5]/50 p-12"
            style={{
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 80%, rgba(94, 233, 181, 0.24) 110%)',
              boxShadow: '0 0 30px -17px rgba(94, 233, 181, 0.83) inset, 0 0 30px -8px rgba(94, 233, 181, 0.74)',
            }}
          >
            <h2 className="text-white font-bold text-4xl mb-6">
              Ready to Settle the Debate?
            </h2>
            <p className="text-white text-xl mb-8 max-w-3xl mx-auto">
              Start comparing your favorite artists now and discover who truly dominates the music industry.
            </p>
            <Link 
              href="/" 
              className="inline-block bg-[#5EE9B5] hover:bg-[#5EE9B5]/80 text-black px-12 py-4 rounded-full font-bold text-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Start Comparing Artists
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}