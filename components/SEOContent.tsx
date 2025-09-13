'use client';

import { useState } from 'react';

interface SEOContentProps {
  artist1?: string;
  artist2?: string;
}

export default function SEOContent({ artist1, artist2 }: SEOContentProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const faqData = [
    {
      id: 'accuracy',
      question: 'How accurate is the artist comparison data?',
      answer: 'Our data comes from official sources including Billboard, RIAA, Grammy Awards, and Spotify. We update our database regularly to ensure accuracy and provide the most current statistics for fair comparisons.'
    },
    {
      id: 'sources',
      question: 'What data sources do you use for comparisons?',
      answer: 'We use multiple authoritative sources: Billboard Hot 100 and Billboard 200 for chart performance, RIAA for certifications, Grammy Awards for recognition, and Spotify for streaming data. This comprehensive approach ensures reliable comparisons.'
    },
    {
      id: 'metrics',
      question: 'What specific metrics do you compare?',
      answer: 'We compare Billboard Hot 100 hits, album sales, Grammy wins and nominations, RIAA Gold/Platinum/Diamond certifications, Spotify monthly listeners, total streams, and chart performance over time.'
    },
    {
      id: 'updates',
      question: 'How often is the data updated?',
      answer: 'Our data is updated daily for streaming numbers and weekly for chart positions. Award and certification data is updated as new information becomes available from official sources.'
    },
    {
      id: 'artists',
      question: 'Can I compare any two artists?',
      answer: 'Yes! Our database includes thousands of popular music artists. Simply search for any artist and compare them with any other artist in our system. We cover major genres and both established and emerging artists.'
    }
  ];

  const comparisonExamples = [
    { artist1: 'Drake', artist2: 'Kanye West', description: 'Compare rap legends with different styles and eras' },
    { artist1: 'Taylor Swift', artist2: 'Ariana Grande', description: 'Pop superstars with massive fanbases and chart success' },
    { artist1: 'The Weeknd', artist2: 'Bruno Mars', description: 'R&B and pop artists with distinct musical approaches' },
    { artist1: 'Billie Eilish', artist2: 'Olivia Rodrigo', description: 'Gen Z pop stars with unique sounds and massive appeal' },
    { artist1: 'Post Malone', artist2: 'Travis Scott', description: 'Hip-hop artists with different musical styles' },
    { artist1: 'Ed Sheeran', artist2: 'John Mayer', description: 'Singer-songwriters with guitar-driven music' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section for SEO */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-200 mb-6">
          {artist1 && artist2 ? `${artist1} vs ${artist2} - Complete Artist Comparison` : 'Compare Music Artists - Comprehensive Statistics & Analysis'}
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
          {artist1 && artist2 
            ? `Discover detailed statistics comparing ${artist1} and ${artist2}. Compare their Billboard chart performance, Grammy awards, RIAA certifications, and Spotify streaming data to see who comes out on top.`
            : 'Compare your favorite music artists with detailed statistics, Billboard charts, Grammy awards, and streaming data. Get comprehensive insights into artist performance and success metrics.'
          }
        </p>
      </section>

      {/* Comparison Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-200 mb-8 text-center">
          Popular Artist Comparisons
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparisonExamples.map((example, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
              <h3 className="text-xl font-semibold text-gray-200 mb-2">
                {example.artist1} vs {example.artist2}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{example.description}</p>
              <button 
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                onClick={() => window.location.href = `/?artist1=${encodeURIComponent(example.artist1)}&artist2=${encodeURIComponent(example.artist2)}`}
              >
                Compare Now →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-200 mb-8 text-center">
          Why Use Our Artist Comparison Tool?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-3">Comprehensive Data</h3>
            <p className="text-gray-400">
              Compare Billboard charts, Grammy awards, RIAA certifications, and Spotify streaming data all in one place.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-3">Real-Time Updates</h3>
            <p className="text-gray-400">
              Get the latest music statistics and streaming numbers for accurate, up-to-date comparisons.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-3">Easy to Use</h3>
            <p className="text-gray-400">
              Simply search for two artists and instantly see detailed side-by-side comparisons with visual charts.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-200 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqData.map((faq) => (
            <div key={faq.id} className="bg-gray-800 rounded-lg">
              <button
                className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-700 transition-colors"
                onClick={() => toggleSection(faq.id)}
              >
                <h3 className="text-lg font-semibold text-gray-200">{faq.question}</h3>
                <span className="text-gray-400 text-xl">
                  {expandedSection === faq.id ? '−' : '+'}
                </span>
              </button>
              {expandedSection === faq.id && (
                <div className="px-6 pb-6">
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SEO Keywords Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-200 mb-8 text-center">
          Popular Comparison Topics
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            'Billboard Chart Performance',
            'Grammy Awards Comparison',
            'Spotify Streaming Numbers',
            'RIAA Certifications',
            'Album Sales Statistics',
            'Song Popularity Rankings',
            'Artist Success Metrics',
            'Music Industry Recognition'
          ].map((topic, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg text-center hover:bg-gray-700 transition-colors">
              <span className="text-gray-300 font-medium">{topic}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
