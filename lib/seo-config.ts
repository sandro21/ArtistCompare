// SEO Configuration and Constants

export const SEO_CONFIG = {
  // Site Information
  siteName: 'Artist Compare',
  siteUrl: 'https://artist-compare.vercel.app', // Update with your actual domain
  siteDescription: 'Compare your favorite music artists side-by-side with detailed statistics, Billboard charts, Grammy awards, and streaming data.',
  
  // Default Meta Tags
  defaultTitle: 'Compare Music Artists - Stats, Charts & Awards | Artist Compare',
  defaultDescription: 'Compare your favorite music artists side-by-side. View detailed stats, Billboard charts, Grammy awards, RIAA certifications, and streaming data. Find out who\'s the better artist!',
  
  // Keywords
  primaryKeywords: [
    'compare artists',
    'music artist comparison',
    'artist stats',
    'billboard charts',
    'grammy awards',
    'spotify streams',
    'music comparison tool',
    'artist battle',
    'music statistics',
    'artist rankings'
  ],
  
  // Long-tail Keywords
  longTailKeywords: [
    'better artist',
    'worst artist',
    'more popular artist',
    'less popular artist',
    'artist comparison',
    'artist comparison tool',
    'less successful artist',
    'more successful artist',
    'less streamed artist',
    'more streamed artist',
    'less charted artist',
    'more charted artist',
    'less awarded artist',
    'more awarded artist',
    'less certified artist',
    'more certified artist',
    'less nominated artist',
    'more nominated artist',
    'less wins artist',
    'less nominations artist',
    'more nominations artist',
    'more grammy nominations artist',
    'more grammy wins artist'
  ],
  
  // Social Media
  social: {
    twitter: '@your-twitter-handle', // Update with your Twitter handle
    facebook: 'https://facebook.com/your-page', // Update with your Facebook page
    instagram: 'https://instagram.com/your-handle', // Update with your Instagram
  },
  
  // Analytics
  analytics: {
    googleAnalytics: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
    googleSearchConsole: process.env.NEXT_PUBLIC_GSC_VERIFICATION || '',
  },
  
  // Performance
  performance: {
    targetLCP: 2.5, // seconds
    targetFID: 100, // milliseconds
    targetCLS: 0.1, // score
  },
  
  // Content Strategy
  content: {
    minWordCount: 300,
    targetWordCount: 800,
    maxWordCount: 1500,
    headingStructure: ['H1', 'H2', 'H3', 'H4'],
  },
  
  // Popular Comparisons for SEO
  popularComparisons: [
    { artist1: 'Drake', artist2: 'Kanye West', category: 'Rap Legends' },
    { artist1: 'Taylor Swift', artist2: 'Ariana Grande', category: 'Pop Queens' },
    { artist1: 'The Weeknd', artist2: 'Bruno Mars', category: 'R&B Stars' },
    { artist1: 'Billie Eilish', artist2: 'Olivia Rodrigo', category: 'Gen Z Icons' },
    { artist1: 'Post Malone', artist2: 'Travis Scott', category: 'Hip-Hop Stars' },
    { artist1: 'Ed Sheeran', artist2: 'John Mayer', category: 'Singer-Songwriters' },
    { artist1: 'Beyoncé', artist2: 'Rihanna', category: 'R&B Divas' },
    { artist1: 'Justin Bieber', artist2: 'Shawn Mendes', category: 'Pop Heartthrobs' },
    { artist1: 'Drake', artist2: 'Travis Scott', category: 'Rap Stars' },
    { artist1: 'Taylor Swift', artist2: 'Billie Eilish', category: 'Pop Icons' }
  ],
  
  // FAQ Data
  faqData: [
    {
      question: 'How accurate is the artist comparison data?',
      answer: 'Our data comes from official sources including Billboard, RIAA, Grammy Awards, and Spotify. We update our database regularly to ensure accuracy and provide the most current statistics for fair comparisons.'
    },
    {
      question: 'What data sources do you use for comparisons?',
      answer: 'We use multiple authoritative sources: Billboard Hot 100 and Billboard 200 for chart performance, RIAA for certifications, Grammy Awards for recognition, and Spotify for streaming data. This comprehensive approach ensures reliable comparisons.'
    },
    {
      question: 'What specific metrics do you compare?',
      answer: 'We compare Billboard Hot 100 hits, album sales, Grammy wins and nominations, RIAA Gold/Platinum/Diamond certifications, Spotify monthly listeners, total streams, and chart performance over time.'
    },
    {
      question: 'How often is the data updated?',
      answer: 'Our data is updated daily for streaming numbers and weekly for chart positions. Award and certification data is updated as new information becomes available from official sources.'
    },
    {
      question: 'Can I compare any two artists?',
      answer: 'Yes! Our database includes thousands of popular music artists. Simply search for any artist and compare them with any other artist in our system. We cover major genres and both established and emerging artists.'
    }
  ]
};

// Generate SEO-friendly URLs
export function generateSEOTitle(artist1: string, artist2: string): string {
  return `${artist1} vs ${artist2} - Artist Comparison | Artist Compare`;
}

export function generateSEODescription(artist1: string, artist2: string): string {
  return `Compare ${artist1} and ${artist2} - detailed stats, Billboard charts, Grammy awards, RIAA certifications, and Spotify streaming data. See who's the better artist!`;
}

// Generate meta keywords for specific comparisons
export function generateMetaKeywords(artist1: string, artist2: string): string[] {
  return [
    `${artist1} vs ${artist2}`,
    `${artist1} comparison`,
    `${artist2} comparison`,
    `${artist1} stats`,
    `${artist2} stats`,
    `${artist1} vs ${artist2} stats`,
    'music artist comparison',
    'billboard charts',
    'grammy awards',
    'spotify streams',
    'artist battle'
  ];
}

// Check if content meets SEO requirements
export function validateSEOContent(content: string, title: string): {
  isValid: boolean;
  issues: string[];
  score: number;
} {
  const issues: string[] = [];
  let score = 100;
  
  // Check word count
  const wordCount = content.split(/\s+/).length;
  if (wordCount < SEO_CONFIG.content.minWordCount) {
    issues.push(`Content too short (${wordCount} words, minimum ${SEO_CONFIG.content.minWordCount})`);
    score -= 20;
  }
  
  // Check title length
  if (title.length < 30) {
    issues.push('Title too short (minimum 30 characters)');
    score -= 10;
  } else if (title.length > 60) {
    issues.push('Title too long (maximum 60 characters)');
    score -= 5;
  }
  
  // Check for keywords
  const hasPrimaryKeywords = SEO_CONFIG.primaryKeywords.some(keyword => 
    content.toLowerCase().includes(keyword.toLowerCase())
  );
  if (!hasPrimaryKeywords) {
    issues.push('Missing primary keywords');
    score -= 15;
  }
  
  // Check for headings
  const hasHeadings = /<h[1-6]>/i.test(content);
  if (!hasHeadings) {
    issues.push('Missing heading structure');
    score -= 10;
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    score: Math.max(0, score)
  };
}
