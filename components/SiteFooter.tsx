import React from 'react';
import Link from 'next/link';

const footerLinks = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/affiliate-disclosure', label: 'Affiliate Disclosure' },
];

const SiteFooter: React.FC = () => {
  return (
    <footer className="fixed bottom-0 inset-x-0 z-50 py-2 bg-black border-t border-[#5EE9B5]/15">
      <nav className="flex flex-wrap justify-center gap-x-3 gap-y-1 px-2 max-w-full">
        {footerLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-gray-400 hover:text-[#5EE9B5] text-[11px] sm:text-xs font-medium transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
};

export default SiteFooter;
