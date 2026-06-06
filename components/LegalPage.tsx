import React from 'react';
import Link from 'next/link';
import SiteFooter from './SiteFooter';

interface LegalPageProps {
  badge: string;
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

const LegalPage: React.FC<LegalPageProps> = ({ badge, title, subtitle, lastUpdated, children }) => {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Navbar */}
      <nav className="w-full h-20 sm:h-24 bg-gradient-to-r from-[#00FF44]/5 to-[#99FFD9]/12 rounded-b-[3rem] sm:rounded-b-[4rem] flex justify-between px-4 sm:px-8 py-3 sm:py-4">
        <Link href="/" className="bg-[#5EE9B5] border-2 sm:border-3 border-[#376348] flex rounded-full items-center gap-2 px-3 sm:px-4">
          <img src="/icon.png" alt="Artist Compare Logo" className="w-10 h-10 sm:w-15 sm:h-15" />
          <span className="font-bold text-black text-xl sm:text-4xl">Artist Compare</span>
        </Link>
        <div className="bg-[#5EE9B5] border-2 sm:border-3 border-[#376348] flex rounded-full items-center px-3 sm:px-4">
          <Link href="/" className="font-bold text-black text-base sm:text-2xl">Compare Again</Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-10 sm:py-14">
        {/* Header */}
        <header className="flex flex-col items-center gap-3 text-center mb-10">
          <div className="bg-[#5EE9B5] border-3 border-[#376348] flex rounded-full items-center px-3 py-1">
            <span className="font-bold text-black text-sm">{badge}</span>
          </div>
          <h1 className="text-white font-extrabold text-3xl sm:text-5xl">{title}</h1>
          {subtitle && (
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl">{subtitle}</p>
          )}
          {lastUpdated && (
            <p className="text-gray-500 text-sm">Last updated: {lastUpdated}</p>
          )}
        </header>

        {/* Content card */}
        <article
          className="w-full max-w-3xl rounded-3xl border-2 border-[#5EE9B5]/40 p-6 sm:p-10 space-y-8"
          style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 85%, rgba(94, 233, 181, 0.18) 115%)',
            boxShadow: '0 0 30px -20px rgba(94, 233, 181, 0.6) inset, 0 0 25px -12px rgba(94, 233, 181, 0.5)',
          }}
        >
          {children}
        </article>
      </main>

      <SiteFooter />
    </div>
  );
};

/** Section heading inside a legal page. */
export const LegalSection: React.FC<{ heading: string; children: React.ReactNode }> = ({ heading, children }) => (
  <section className="space-y-3">
    <h2 className="text-[#5EE9B5] font-bold text-xl sm:text-2xl">{heading}</h2>
    <div className="text-gray-200 text-base leading-relaxed space-y-3">{children}</div>
  </section>
);

export default LegalPage;
