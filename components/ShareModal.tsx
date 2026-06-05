'use client';
import { useState, useEffect, useCallback } from 'react';
import type { SharePayload } from '../types';

interface ShareModalProps {
  payload: SharePayload;
  onClose: () => void;
}

function buildOgUrl(payload: SharePayload): string {
  const compact = payload.bars.map((b) => ({ l: b.label, a: b.valueA, b: b.valueB }));
  const params = new URLSearchParams({
    a: payload.artistAName,
    b: payload.artistBName,
    title: payload.sectionTitle,
    bars: JSON.stringify(compact),
  });
  if (payload.artistAImg) params.set('aImg', payload.artistAImg);
  if (payload.artistBImg) params.set('bImg', payload.artistBImg);
  if (payload.source)    params.set('source', payload.source);
  return `/api/og/share?${params.toString()}`;
}

function buildShareUrl(payload: SharePayload): string {
  if (typeof window === 'undefined') return '';
  const base = window.location.href.split('?')[0];
  const existing = new URLSearchParams(window.location.search);
  existing.set('section', payload.sectionId);
  return `${base}?${existing.toString()}`;
}

export default function ShareModal({ payload, onClose }: ShareModalProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const ogUrl = buildOgUrl(payload);

  const shareUrl = typeof window !== 'undefined' ? buildShareUrl(payload) : '';

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard denied */ }
  }, [shareUrl]);

  const handleTwitter = useCallback(() => {
    const text = encodeURIComponent(
      `Who wins this matchup? ${payload.artistAName} vs ${payload.artistBName} — ${payload.sectionTitle}`,
    );
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
    );
  }, [payload, shareUrl]);

  const handleReddit = useCallback(() => {
    const title = encodeURIComponent(
      `${payload.artistAName} vs ${payload.artistBName} — ${payload.sectionTitle}`,
    );
    window.open(
      `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${title}`,
      '_blank',
    );
  }, [payload, shareUrl]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const res = await fetch(ogUrl);
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objUrl;
      a.download = `${payload.artistAName.replace(/\s+/g, '-')}-vs-${payload.artistBName.replace(/\s+/g, '-')}-${payload.sectionId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objUrl);
    } catch { /* fail silently */ }
    setDownloading(false);
  }, [ogUrl, payload]);

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Card */}
      <div
        className="w-full max-w-[600px] flex flex-col"
        style={{
          background: '#0d1a15',
          border: '1px solid rgba(94,233,181,0.25)',
          borderRadius: '1.5rem',
          boxShadow: '0 0 60px -20px rgba(94,233,181,0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <span className="text-white font-semibold text-sm tracking-wide uppercase" style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em' }}>
            Share {payload.sectionTitle}
          </span>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors"
            style={{ lineHeight: 1 }}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Preview image — 1200:630 aspect ratio */}
        <div className="mx-5" style={{ borderRadius: '1rem', overflow: 'hidden', aspectRatio: '1200/630', background: '#0a0e0d', position: 'relative' }}>
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgba(94,233,181,0.4)', borderTopColor: 'transparent' }} />
            </div>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ogUrl}
            alt="Share preview"
            className="w-full h-full object-cover"
            style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
            onLoad={() => setImgLoaded(true)}
          />
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-4 gap-2 p-5">
          {/* Copy link */}
          <button
            onClick={handleCopy}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-150"
            style={{
              background: copied ? 'rgba(94,233,181,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${copied ? 'rgba(94,233,181,0.50)' : 'rgba(255,255,255,0.10)'}`,
            }}
          >
            {copied ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3.5 9.5l4 4 7-8" stroke="#5EE9B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="6" y="6" width="9" height="9" rx="1.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
                <path d="M12 6V4.5A1.5 1.5 0 0010.5 3h-7A1.5 1.5 0 002 4.5v7A1.5 1.5 0 003.5 13H5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
            <span className="text-[11px] font-medium" style={{ color: copied ? '#5EE9B5' : 'rgba(255,255,255,0.55)' }}>
              {copied ? 'Copied!' : 'Copy link'}
            </span>
          </button>

          {/* Twitter / X */}
          <button
            onClick={handleTwitter}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-150"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.09)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M13.5 2.5h2.25L11.25 8 16.5 15.5H12L8.5 10.75 4.5 15.5H2.25l4.75-5.75L1.5 2.5H6.1l3.15 4.5 4.25-4.5Z" fill="rgba(255,255,255,0.7)"/>
            </svg>
            <span className="text-[11px] font-medium text-white/55">Post on X</span>
          </button>

          {/* Reddit */}
          <button
            onClick={handleReddit}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-150"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.09)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4"/>
              <circle cx="9" cy="8.5" r="3" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4"/>
              <circle cx="6.5" cy="10" r="0.8" fill="rgba(255,255,255,0.7)"/>
              <circle cx="11.5" cy="10" r="0.8" fill="rgba(255,255,255,0.7)"/>
              <path d="M7 11.5s.5 1 2 1 2-1 2-1" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M12.5 5.5l-1.5.5M12.5 5.5a1 1 0 110 .8" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className="text-[11px] font-medium text-white/55">Reddit</span>
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-150 disabled:opacity-40"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
            onMouseEnter={(e) => { if (!downloading) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.09)'; }}
            onMouseLeave={(e) => { if (!downloading) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
          >
            {downloading ? (
              <div className="w-[18px] h-[18px] rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgba(255,255,255,0.4)', borderTopColor: 'transparent' }} />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2v9m0 0L6 8m3 3l3-3" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 13.5v.5a1.5 1.5 0 001.5 1.5h9A1.5 1.5 0 0015 14v-.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
            <span className="text-[11px] font-medium text-white/55">
              {downloading ? 'Saving…' : 'Download'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
