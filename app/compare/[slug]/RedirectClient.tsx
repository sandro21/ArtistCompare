'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectClientProps {
  target: string;
}

export default function RedirectClient({ target }: RedirectClientProps) {
  const router = useRouter();

  useEffect(() => {
    // Longer delay to ensure crawlers can read the metadata before redirect
    const timer = setTimeout(() => {
      router.replace(target);
    }, 2000); // 2 second delay for crawlers

    return () => clearTimeout(timer);
  }, [target, router]);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <p>Loading comparison...</p>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          If you are not redirected,{' '}
          <a href={target} style={{ color: '#5EE9B5' }}>click here</a>.
        </p>
      </div>
    </div>
  );
}
