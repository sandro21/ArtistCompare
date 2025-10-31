'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectClientProps {
  target: string;
}

export default function RedirectClient({ target }: RedirectClientProps) {
  const router = useRouter();

  useEffect(() => {
    // Immediate redirect - metadata is already in HTML head for crawlers
    router.replace(target);
  }, [target, router]);

  // Return null to render nothing while redirecting
  return null;
}
