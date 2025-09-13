'use client';

interface InternalLinkingProps {
  currentArtists?: { artist1: string; artist2: string };
}

export default function InternalLinking({ currentArtists }: InternalLinkingProps) {
  const relatedComparisons = [
    { artist1: 'Drake', artist2: 'Kanye West', category: 'Rap Legends' },
    { artist1: 'Taylor Swift', artist2: 'Ariana Grande', category: 'Pop Queens' },
    { artist1: 'The Weeknd', artist2: 'Bruno Mars', category: 'R&B Stars' },
    { artist1: 'Billie Eilish', artist2: 'Olivia Rodrigo', category: 'Gen Z Icons' },
    { artist1: 'Post Malone', artist2: 'Travis Scott', category: 'Hip-Hop Stars' },
    { artist1: 'Ed Sheeran', artist2: 'John Mayer', category: 'Singer-Songwriters' },
    { artist1: 'Beyoncé', artist2: 'Rihanna', category: 'R&B Divas' },
    { artist1: 'Justin Bieber', artist2: 'Shawn Mendes', category: 'Pop Heartthrobs' }
  ];

  const categoryPages = [
    { title: 'Rap Artist Comparisons', description: 'Compare rap and hip-hop artists', href: '/category/rap' },
    { title: 'Pop Artist Comparisons', description: 'Compare pop music artists', href: '/category/pop' },
    { title: 'R&B Artist Comparisons', description: 'Compare R&B and soul artists', href: '/category/rnb' },
    { title: 'Rock Artist Comparisons', description: 'Compare rock and alternative artists', href: '/category/rock' },
    { title: 'Country Artist Comparisons', description: 'Compare country music artists', href: '/category/country' }
  ];

  const trendingComparisons = [
    'Drake vs Travis Scott',
    'Taylor Swift vs Billie Eilish',
    'The Weeknd vs Bruno Mars',
    'Post Malone vs Juice WRLD',
    'Ariana Grande vs Dua Lipa'
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Related Comparisons */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-200 mb-6">
          Related Artist Comparisons
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedComparisons
            .filter(comp => 
              !currentArtists || 
              (comp.artist1 !== currentArtists.artist1 && comp.artist2 !== currentArtists.artist2)
            )
            .slice(0, 6)
            .map((comparison, index) => (
            <a
              key={index}
              href={`/?artist1=${encodeURIComponent(comparison.artist1)}&artist2=${encodeURIComponent(comparison.artist2)}`}
              className="block bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">
                  {comparison.artist1} vs {comparison.artist2}
                </h3>
                <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                  {comparison.category}
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Compare {comparison.artist1} and {comparison.artist2} statistics
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Category Pages */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-200 mb-6">
          Browse by Music Genre
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryPages.map((category, index) => (
            <a
              key={index}
              href={category.href}
              className="block bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors group"
            >
              <h3 className="text-lg font-semibold text-gray-200 group-hover:text-blue-400 transition-colors mb-2">
                {category.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {category.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Trending Comparisons */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-200 mb-6">
          Trending Comparisons
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingComparisons.map((comparison, index) => (
            <a
              key={index}
              href={`/?search=${encodeURIComponent(comparison)}`}
              className="block bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors group"
            >
              <h3 className="font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">
                {comparison}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Popular comparison this week
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-gray-400">
          <li>
            <a href="/" className="hover:text-white transition-colors">
              Home
            </a>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <a href="/compare" className="hover:text-white transition-colors">
              Compare Artists
            </a>
          </li>
          {currentArtists && (
            <>
              <li className="text-gray-500">/</li>
              <li className="text-white">
                {currentArtists.artist1} vs {currentArtists.artist2}
              </li>
            </>
          )}
        </ol>
      </nav>
    </div>
  );
}
