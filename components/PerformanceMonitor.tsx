'use client';

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production and browser
    if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined') {
      return;
    }

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Log to console for debugging (remove in production)
        console.log('Performance metric:', entry.name, entry.value);
        
        // Send to analytics (replace with your analytics service)
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'web_vitals', {
            name: entry.name,
            value: Math.round(entry.value),
            event_category: 'Web Vitals',
          });
        }
      }
    });

    // Observe all performance entries
    observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });

    // Monitor specific Core Web Vitals
    if ('web-vitals' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS((metric) => {
          console.log('CLS:', metric);
          if ((window as any).gtag) {
            (window as any).gtag('event', 'web_vitals', {
              name: 'CLS',
              value: Math.round(metric.value * 1000),
              event_category: 'Web Vitals',
            });
          }
        });

        getFID((metric) => {
          console.log('FID:', metric);
          if ((window as any).gtag) {
            (window as any).gtag('event', 'web_vitals', {
              name: 'FID',
              value: Math.round(metric.value),
              event_category: 'Web Vitals',
            });
          }
        });

        getFCP((metric) => {
          console.log('FCP:', metric);
          if ((window as any).gtag) {
            (window as any).gtag('event', 'web_vitals', {
              name: 'FCP',
              value: Math.round(metric.value),
              event_category: 'Web Vitals',
            });
          }
        });

        getLCP((metric) => {
          console.log('LCP:', metric);
          if ((window as any).gtag) {
            (window as any).gtag('event', 'web_vitals', {
              name: 'LCP',
              value: Math.round(metric.value),
              event_category: 'Web Vitals',
            });
          }
        });

        getTTFB((metric) => {
          console.log('TTFB:', metric);
          if ((window as any).gtag) {
            (window as any).gtag('event', 'web_vitals', {
              name: 'TTFB',
              value: Math.round(metric.value),
              event_category: 'Web Vitals',
            });
          }
        });
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
}
