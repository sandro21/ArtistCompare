'use client';

import { useEffect } from 'react';

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: {
      (...args: any[]): void;
      q: any[];
    };
  }
}

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
        console.log('Performance metric:', entry.name, (entry as any).value);
        
        // Send to analytics (replace with your analytics service)
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'web_vitals', {
            name: entry.name,
            value: Math.round((entry as any).value || 0),
            event_category: 'Web Vitals',
          });
        }
      }
    });

    // Observe all performance entries
    observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });

    // Monitor specific Core Web Vitals
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS((metric) => {
        console.log('CLS:', metric);
        if ((window as any).gtag) {
          (window as any).gtag('event', 'web_vitals', {
            name: 'CLS',
            value: Math.round(metric.value * 1000),
            event_category: 'Web Vitals',
          });
        }
      });

      onINP((metric) => {
        console.log('INP:', metric);
        if ((window as any).gtag) {
          (window as any).gtag('event', 'web_vitals', {
            name: 'INP',
            value: Math.round(metric.value),
            event_category: 'Web Vitals',
          });
        }
      });

      onFCP((metric) => {
        console.log('FCP:', metric);
        if ((window as any).gtag) {
          (window as any).gtag('event', 'web_vitals', {
            name: 'FCP',
            value: Math.round(metric.value),
            event_category: 'Web Vitals',
          });
        }
      });

      onLCP((metric) => {
        console.log('LCP:', metric);
        if ((window as any).gtag) {
          (window as any).gtag('event', 'web_vitals', {
            name: 'LCP',
            value: Math.round(metric.value),
            event_category: 'Web Vitals',
          });
        }
      });

      onTTFB((metric) => {
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

    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
}
