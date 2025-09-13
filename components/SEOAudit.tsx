'use client';

import { useEffect, useState } from 'react';
import { validateSEOContent } from '../lib/seo-config';

interface SEOAuditProps {
  pageType: 'home' | 'comparison';
  artist1?: string;
  artist2?: string;
}

export default function SEOAudit({ pageType, artist1, artist2 }: SEOAuditProps) {
  const [auditResults, setAuditResults] = useState<any>(null);
  const [showAudit, setShowAudit] = useState(false);

  useEffect(() => {
    // Only run audit in development
    if (process.env.NODE_ENV !== 'development') return;

    const runAudit = () => {
      const results: {
        pageType: string;
        timestamp: string;
        checks: Array<{
          type: string;
          status: string;
          message: string;
          current: number;
          recommended?: number;
        }>;
      } = {
        pageType,
        timestamp: new Date().toISOString(),
        checks: []
      };

      // Check page title
      const title = document.title;
      if (title.length < 30) {
        results.checks.push({
          type: 'title',
          status: 'warning',
          message: 'Title too short (minimum 30 characters)',
          current: title.length,
          recommended: 30
        });
      } else if (title.length > 60) {
        results.checks.push({
          type: 'title',
          status: 'warning',
          message: 'Title too long (maximum 60 characters)',
          current: title.length,
          recommended: 60
        });
      } else {
        results.checks.push({
          type: 'title',
          status: 'pass',
          message: 'Title length is optimal',
          current: title.length
        });
      }

      // Check meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        const description = metaDescription.getAttribute('content') || '';
        if (description.length < 120) {
          results.checks.push({
            type: 'description',
            status: 'warning',
            message: 'Meta description too short (minimum 120 characters)',
            current: description.length,
            recommended: 120
          });
        } else if (description.length > 160) {
          results.checks.push({
            type: 'description',
            status: 'warning',
            message: 'Meta description too long (maximum 160 characters)',
            current: description.length,
            recommended: 160
          });
        } else {
          results.checks.push({
            type: 'description',
            status: 'pass',
            message: 'Meta description length is optimal',
            current: description.length
          });
        }
      } else {
        results.checks.push({
          type: 'description',
          status: 'error',
          message: 'Missing meta description',
          current: 0,
          recommended: 120
        });
      }

      // Check headings
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const h1Count = document.querySelectorAll('h1').length;
      
      if (h1Count === 0) {
        results.checks.push({
          type: 'headings',
          status: 'error',
          message: 'Missing H1 tag',
          current: 0,
          recommended: 1
        });
      } else if (h1Count > 1) {
        results.checks.push({
          type: 'headings',
          status: 'warning',
          message: 'Multiple H1 tags found',
          current: h1Count,
          recommended: 1
        });
      } else {
        results.checks.push({
          type: 'headings',
          status: 'pass',
          message: 'H1 tag structure is correct',
          current: h1Count
        });
      }

      // Check images for alt text
      const images = document.querySelectorAll('img');
      let imagesWithoutAlt = 0;
      images.forEach(img => {
        if (!img.alt || img.alt.trim() === '') {
          imagesWithoutAlt++;
        }
      });

      if (imagesWithoutAlt > 0) {
        results.checks.push({
          type: 'images',
          status: 'warning',
          message: `${imagesWithoutAlt} images missing alt text`,
          current: imagesWithoutAlt,
          recommended: 0
        });
      } else {
        results.checks.push({
          type: 'images',
          status: 'pass',
          message: 'All images have alt text',
          current: 0
        });
      }

      // Check for structured data
      const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
      if (structuredData.length === 0) {
        results.checks.push({
          type: 'structured_data',
          status: 'warning',
          message: 'No structured data found',
          current: 0,
          recommended: 1
        });
      } else {
        results.checks.push({
          type: 'structured_data',
          status: 'pass',
          message: 'Structured data found',
          current: structuredData.length
        });
      }

      // Check page speed (basic)
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.fetchStart;
          if (loadTime > 3000) {
            results.checks.push({
              type: 'performance',
              status: 'warning',
              message: 'Page load time is slow',
              current: Math.round(loadTime),
              recommended: 3000
            });
          } else {
            results.checks.push({
              type: 'performance',
              status: 'pass',
              message: 'Page load time is good',
              current: Math.round(loadTime)
            });
          }
        }
      }

      setAuditResults(results);
    };

    // Run audit after page load
    setTimeout(runAudit, 1000);
  }, [pageType, artist1, artist2]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development' || !auditResults) {
    return null;
  }

  const passCount = auditResults.checks.filter((check: any) => check.status === 'pass').length;
  const warningCount = auditResults.checks.filter((check: any) => check.status === 'warning').length;
  const errorCount = auditResults.checks.filter((check: any) => check.status === 'error').length;
  const totalScore = Math.round((passCount / auditResults.checks.length) * 100);

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <button
        onClick={() => setShowAudit(!showAudit)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
      >
        SEO Audit ({totalScore}%)
      </button>
      
      {showAudit && (
        <div className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">
            SEO Audit Results
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-green-600">✓ Pass: {passCount}</span>
              <span className="text-yellow-600">⚠ Warnings: {warningCount}</span>
              <span className="text-red-600">✗ Errors: {errorCount}</span>
            </div>
            <div className="border-t pt-2">
              {auditResults.checks.map((check: any, index: number) => (
                <div key={index} className="flex items-start space-x-2 py-1">
                  <span className={`text-xs ${
                    check.status === 'pass' ? 'text-green-600' :
                    check.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {check.status === 'pass' ? '✓' : check.status === 'warning' ? '⚠' : '✗'}
                  </span>
                  <div className="flex-1">
                    <div className="text-gray-800 dark:text-gray-200">{check.message}</div>
                    {check.current !== undefined && (
                      <div className="text-xs text-gray-500">
                        Current: {check.current}
                        {check.recommended && ` | Recommended: ${check.recommended}`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
