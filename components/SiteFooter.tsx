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
    <footer className="w-full mt-16 border-t border-[#5EE9B5]/20 bg-gradient-to-t from-[#5EE9B5]/8 to-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col items-center gap-5">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-300 hover:text-[#5EE9B5] text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-gray-500 text-xs text-center max-w-2xl leading-relaxed">
          Artist Compare participates in affiliate programs and may earn a commission on
          qualifying ticket purchases made through links on this site, at no extra cost to you.
          See our <Link href="/affiliate-disclosure" className="text-gray-400 hover:text-[#5EE9B5] underline">Affiliate Disclosure</Link>.
        </p>

        <p className="text-gray-600 text-xs">
          © {new Date().getFullYear()} Artist Compare. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
