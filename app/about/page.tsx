import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Artist Compare - Music Artist Comparison Tool',
  description: 'Learn about Artist Compare, the comprehensive music artist comparison tool. Compare Billboard charts, Grammy awards, RIAA certifications, and Spotify streaming data.',
  keywords: [
    'about artist compare',
    'music comparison tool',
    'artist statistics',
    'billboard charts',
    'grammy awards',
    'music data',
    'artist comparison platform'
  ],
  openGraph: {
    title: 'About Artist Compare - Music Artist Comparison Tool',
    description: 'Learn about Artist Compare, the comprehensive music artist comparison tool for comparing your favorite artists.',
    type: 'website',
  },
  alternates: {
    canonical: '/about',
  },
}

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center min-h-screen gap-[clamp(1rem,4vh,2rem)] pt-6 px-4 sm:px-6 sm:gap-8 pb-24 sm:pb-16">
      {/* Header Section - Similar to main page */}
      <section className="w-full flex flex-col items-center gap-[clamp(0.75rem,2.5vh,1.5rem)] sm:gap-6">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide text-gray-200 uppercase">
            About Artist Compare
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mt-2 font-medium">
            The comprehensive platform for comparing music artists
          </p>
        </div>
      </section>

      {/* Main Content in styled container - Similar to Description component */}
      <section className="w-[95%] mx-auto mt-5 pb-4 pt-3 px-0 sm:w-[70%] sm:mt-8 sm:px-15 sm:py-11 rounded-4xl sm:rounded-[6rem] border border-emerald-400/100 relative"
        style={{
          background: "linear-gradient(180deg, rgba(0, 0, 0, 0.10) 0%, rgba(64, 167, 114, 0.25) 100%)",
          boxShadow: "none",
        }}
      >
        <div className="space-y-8 px-4 sm:px-8">
          {/* What is Artist Compare */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              What is Artist Compare?
            </h2>
            <p className="text-base sm:text-xl text-gray-300 max-w-5xl mx-auto font-medium">
              A powerful tool designed to help music fans, industry professionals, and curious minds 
              compare their favorite artists across multiple metrics with real-time data.
            </p>
          </div>

          {/* Data Sources Grid - Similar to trending battles */}
          <div className="w-full max-w-4xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">Our Data Sources</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              <div className="py-4 sm:py-5 rounded-2xl sm:rounded-[4rem] border border-emerald-400/30 transition-all duration-300 hover:scale-105 hover:border-emerald-400/60 hover:bg-emerald-900/20" 
                   style={{ background: "rgba(0,0,0,0.4)" }}>
                <div className="text-white font-bold text-base sm:text-xl px-4 mb-2">Billboard Charts</div>
                <div className="text-gray-300 text-sm sm:text-base px-4">
                  Hot 100 hits, album sales, and chart performance
                </div>
              </div>
              <div className="py-4 sm:py-5 rounded-2xl sm:rounded-[4rem] border border-emerald-400/30 transition-all duration-300 hover:scale-105 hover:border-emerald-400/60 hover:bg-emerald-900/20" 
                   style={{ background: "rgba(0,0,0,0.4)" }}>
                <div className="text-white font-bold text-base sm:text-xl px-4 mb-2">Grammy Awards</div>
                <div className="text-gray-300 text-sm sm:text-base px-4">
                  Wins, nominations, and recognition across all categories
                </div>
              </div>
              <div className="py-4 sm:py-5 rounded-2xl sm:rounded-[4rem] border border-emerald-400/30 transition-all duration-300 hover:scale-105 hover:border-emerald-400/60 hover:bg-emerald-900/20" 
                   style={{ background: "rgba(0,0,0,0.4)" }}>
                <div className="text-white font-bold text-base sm:text-xl px-4 mb-2">RIAA Certifications</div>
                <div className="text-gray-300 text-sm sm:text-base px-4">
                  Gold, Platinum, and Diamond certifications
                </div>
              </div>
              <div className="py-4 sm:py-5 rounded-2xl sm:rounded-[4rem] border border-emerald-400/30 transition-all duration-300 hover:scale-105 hover:border-emerald-400/60 hover:bg-emerald-900/20" 
                   style={{ background: "rgba(0,0,0,0.4)" }}>
                <div className="text-white font-bold text-base sm:text-xl px-4 mb-2">Spotify Data</div>
                <div className="text-gray-300 text-sm sm:text-base px-4">
                  Monthly listeners, streams, and popularity rankings
                </div>
              </div>
            </div>
          </div>

          {/* How It Works - Similar to features */}
          <div className="w-full max-w-5xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">How It Works</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="py-4 sm:py-5 rounded-2xl sm:rounded-[4rem] border border-emerald-400/30 transition-all duration-300 hover:scale-105 hover:border-emerald-400/60 hover:bg-emerald-900/20" 
                   style={{ background: "rgba(0,0,0,0.4)" }}>
                <div className="text-center">
                  <div className="bg-emerald-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-base font-bold mx-auto mb-3">
                    1
                  </div>
                  <div className="text-white font-bold text-base sm:text-xl px-4 mb-2">Search Artists</div>
                  <div className="text-gray-300 text-sm sm:text-base px-4">
                    Find any artist in our comprehensive database
                  </div>
                </div>
              </div>
              <div className="py-4 sm:py-5 rounded-2xl sm:rounded-[4rem] border border-emerald-400/30 transition-all duration-300 hover:scale-105 hover:border-emerald-400/60 hover:bg-emerald-900/20" 
                   style={{ background: "rgba(0,0,0,0.4)" }}>
                <div className="text-center">
                  <div className="bg-emerald-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-base font-bold mx-auto mb-3">
                    2
                  </div>
                  <div className="text-white font-bold text-base sm:text-xl px-4 mb-2">Compare Side-by-Side</div>
                  <div className="text-gray-300 text-sm sm:text-base px-4">
                    Select two artists for detailed comparisons
                  </div>
                </div>
              </div>
              <div className="py-4 sm:py-5 rounded-2xl sm:rounded-[4rem] border border-emerald-400/30 transition-all duration-300 hover:scale-105 hover:border-emerald-400/60 hover:bg-emerald-900/20" 
                   style={{ background: "rgba(0,0,0,0.4)" }}>
                <div className="text-center">
                  <div className="bg-emerald-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-base font-bold mx-auto mb-3">
                    3
                  </div>
                  <div className="text-white font-bold text-base sm:text-xl px-4 mb-2">Analyze Results</div>
                  <div className="text-gray-300 text-sm sm:text-base px-4">
                    Review comprehensive statistics and data
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section - Similar styling */}
          <div className="w-full max-w-5xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <details className="py-4 sm:py-6 rounded-2xl sm:rounded-[4rem] border border-emerald-400/30 transition-all duration-300 hover:border-emerald-400/60 hover:bg-emerald-900/20" 
                       style={{ background: "rgba(0,0,0,0.4)" }}>
                <summary className="font-bold text-white text-base sm:text-xl px-4 cursor-pointer">
                  How often is the data updated?
                </summary>
                <p className="text-gray-300 text-sm sm:text-base mt-3 px-4">
                  Our data is updated regularly. Billboard charts are updated weekly, 
                  while streaming data and certifications are refreshed as new information becomes available.
                </p>
              </details>
              <details className="py-4 sm:py-6 rounded-2xl sm:rounded-[4rem] border border-emerald-400/30 transition-all duration-300 hover:border-emerald-400/60 hover:bg-emerald-900/20" 
                       style={{ background: "rgba(0,0,0,0.4)" }}>
                <summary className="font-bold text-white text-base sm:text-xl px-4 cursor-pointer">
                  Can I compare any two artists?
                </summary>
                <p className="text-gray-300 text-sm sm:text-base mt-3 px-8">
                  Yes! Our database includes thousands of popular music artists. 
                  Simply search for any artist and compare them with any other artist in our system.
                </p>
              </details>
              <details className="py-4 sm:py-6 rounded-2xl sm:rounded-[4rem] border border-emerald-400/30 transition-all duration-300 hover:border-emerald-400/60 hover:bg-emerald-900/20" 
                       style={{ background: "rgba(0,0,0,0.4)" }}>
                <summary className="font-bold text-white text-base sm:text-xl px-4 cursor-pointer">
                  Is Artist Compare free to use?
                </summary>
                <p className="text-gray-300 text-sm sm:text-base mt-3 px-8">
                  Yes, Artist Compare is completely free to use. We believe everyone should have access 
                  to comprehensive music artist data and comparisons.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA - Similar to main page footer */}
      <div className="text-center mt-8">
        <p className="text-gray-400 mb-4 text-base sm:text-lg">
          Ready to start comparing artists?
        </p>
        <Link 
          href="/" 
          className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold transition-colors shadow-lg hover:scale-105 duration-200 text-base sm:text-lg"
        >
          Start Comparing Artists
        </Link>
      </div>
    </div>
  )
}