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

function buildShareUrl(payload: SharePayload, ogRelativeUrl: string): string {
  if (typeof window === 'undefined') return '';
  const base = window.location.href.split('?')[0];
  // Build params from payload directly — never trust window.location.search,
  // which may still contain a previous comparison's artist params.
  const sp = new URLSearchParams({
    artist1: payload.artistAName,
    artist2: payload.artistBName,
    share: payload.sectionId,
  });
  // encodeURIComponent first so btoa never sees non-Latin-1 chars
  try { sp.set('d', btoa(encodeURIComponent(ogRelativeUrl))); } catch { /* skip */ }
  return `${base}?${sp.toString()}`;
}

export default function ShareModal({ payload, onClose }: ShareModalProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const ogUrl = buildOgUrl(payload);

  const shareUrl = typeof window !== 'undefined' ? buildShareUrl(payload, ogUrl) : '';

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
      setTimeout(() => setCopied(false), 2500);
    } catch { /* clipboard denied */ }
  }, [shareUrl]);

  // Auto-copy when the modal opens
  useEffect(() => {
    handleCopy();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <span className="font-semibold text-base" style={{ color: '#ffffff' }}>
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
            className="group flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-200 hover:scale-[1.04] active:scale-95"
            style={{
              background: copied ? 'rgba(94,233,181,0.15)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${copied ? 'rgba(94,233,181,0.55)' : 'rgba(255,255,255,0.14)'}`,
              boxShadow: copied ? '0 0 12px rgba(94,233,181,0.15)' : undefined,
            }}
          >
            {copied ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3.5 9.5l4 4 7-8" stroke="#5EE9B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="transition-transform duration-200 group-hover:-translate-y-0.5">
                <rect x="6" y="6" width="9" height="9" rx="1.5" stroke="#ffffff" strokeWidth="1.5"/>
                <path d="M12 6V4.5A1.5 1.5 0 0010.5 3h-7A1.5 1.5 0 002 4.5v7A1.5 1.5 0 003.5 13H5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
            <span className="text-[11px] font-medium" style={{ color: copied ? '#5EE9B5' : '#ffffff' }}>
              {copied ? 'Link copied!' : 'Copy link'}
            </span>
          </button>

          {/* Twitter / X */}
          <button
            onClick={handleTwitter}
            className="group flex flex-col items-center gap-1.5 py-3 rounded-xl border border-white/[0.14] bg-white/[0.06] transition-all duration-200 hover:bg-white/[0.13] hover:border-white/30 hover:scale-[1.04] active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="transition-transform duration-200 group-hover:-translate-y-0.5">
              <path d="M13.5 2.5h2.25L11.25 8 16.5 15.5H12L8.5 10.75 4.5 15.5H2.25l4.75-5.75L1.5 2.5H6.1l3.15 4.5 4.25-4.5Z" fill="#ffffff"/>
            </svg>
            <span className="text-[11px] font-medium text-white">Post on X</span>
          </button>

          {/* Reddit */}
          <button
            onClick={handleReddit}
            className="group flex flex-col items-center gap-1.5 py-3 rounded-xl border border-white/[0.14] bg-white/[0.06] transition-all duration-200 hover:bg-[rgba(255,69,0,0.15)] hover:border-[rgba(255,69,0,0.4)] hover:scale-[1.04] active:scale-95"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff" className="transition-transform duration-200 group-hover:-translate-y-0.5">
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
            </svg>
            <span className="text-[11px] font-medium text-white">Reddit</span>
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="group flex flex-col items-center gap-1.5 py-3 rounded-xl border border-white/[0.14] bg-white/[0.06] transition-all duration-200 hover:bg-white/[0.13] hover:border-white/30 hover:scale-[1.04] active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
          >
            {downloading ? (
              <div className="w-[18px] h-[18px] rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgba(255,255,255,0.4)', borderTopColor: 'transparent' }} />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="transition-transform duration-200 group-hover:translate-y-0.5">
                <path d="M9 2v9m0 0L6 8m3 3l3-3" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 13.5v.5a1.5 1.5 0 001.5 1.5h9A1.5 1.5 0 0015 14v-.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
            <span className="text-[11px] font-medium text-white">
              {downloading ? 'Saving…' : 'Download'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
