'use client';

import { useEffect } from 'react';

interface AdvancedSchemaProps {
  artist1?: string;
  artist2?: string;
  comparisonData?: {
    artist1Stats: any;
    artist2Stats: any;
  };
}

export default function AdvancedSchema({ artist1, artist2, comparisonData }: AdvancedSchemaProps) {
  useEffect(() => {
    if (!artist1 || !artist2) return;

    // Create comprehensive schema markup
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `${artist1} vs ${artist2} - Artist Comparison`,
      "description": `Compare ${artist1} and ${artist2} with detailed music statistics, Billboard charts, Grammy awards, and streaming data.`,
      "url": window.location.href,
      "mainEntity": {
        "@type": "ItemList",
        "name": `${artist1} vs ${artist2} Comparison`,
        "description": `Detailed comparison between ${artist1} and ${artist2}`,
        "itemListElement": [
          {
            "@type": "Person",
            "name": artist1,
            "jobTitle": "Musician",
            "description": `Music artist ${artist1} - compare statistics, awards, and achievements`,
            "sameAs": [
              `https://open.spotify.com/artist/${artist1.toLowerCase().replace(/\s+/g, '')}`,
              `https://www.billboard.com/artist/${artist1.toLowerCase().replace(/\s+/g, '-')}`
            ]
          },
          {
            "@type": "Person", 
            "name": artist2,
            "jobTitle": "Musician",
            "description": `Music artist ${artist2} - compare statistics, awards, and achievements`,
            "sameAs": [
              `https://open.spotify.com/artist/${artist2.toLowerCase().replace(/\s+/g, '')}`,
              `https://www.billboard.com/artist/${artist2.toLowerCase().replace(/\s+/g, '-')}`
            ]
          }
        ]
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": window.location.origin
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Compare Artists",
            "item": `${window.location.origin}/compare`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `${artist1} vs ${artist2}`,
            "item": window.location.href
          }
        ]
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${window.location.origin}/?artist1={artist1}&artist2={artist2}`
        },
        "query-input": "required name=artist1 name=artist2"
      }
    };

    // Add FAQ schema if we have comparison data
    if (comparisonData) {
      schema["@type"] = "FAQPage";
      schema["mainEntity"] = [
        {
          "@type": "Question",
          "name": `Who is more successful: ${artist1} or ${artist2}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Compare ${artist1} and ${artist2} using our comprehensive statistics including Billboard charts, Grammy awards, RIAA certifications, and Spotify streaming data.`
          }
        },
        {
          "@type": "Question", 
          "name": `What are the key differences between ${artist1} and ${artist2}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Our comparison tool shows detailed statistics for ${artist1} and ${artist2} including chart performance, awards, certifications, and streaming numbers to highlight their differences.`
          }
        }
      ];
    }

    // Add the schema to the page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    script.id = 'advanced-schema';
    
    // Remove existing schema if it exists
    const existingSchema = document.getElementById('advanced-schema');
    if (existingSchema) {
      existingSchema.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      const schemaElement = document.getElementById('advanced-schema');
      if (schemaElement) {
        schemaElement.remove();
      }
    };
  }, [artist1, artist2, comparisonData]);

  return null; // This component doesn't render anything
}
