'use client';
import { useState, useEffect } from 'react';
import SectionWrapper from '../../components/SectionWrapper';
import { getArtistName } from '../../lib/utils/artist';
import type { Artist } from '../../types';

interface CommunityVoteProps {
  artistA: Artist | null;
  artistB: Artist | null;
}

type Phase =
  | { kind: 'idle' }
  | { kind: 'loading'; pending: 'a' | 'b' }
  | { kind: 'result'; votesA: number; votesB: number; voted: 'a' | 'b' };

function pairKey(n1: string, n2: string): string {
  const [a, b] = [n1.trim(), n2.trim()].sort((x, y) => x.localeCompare(y));
  return `${a}|||${b}`;
}

function lsKey(n1: string, n2: string): string {
  return `ac_vote_${pairKey(n1, n2)}`;
}

function artistImage(a: Artist): string {
  return a.spotifyImageUrl || a.spotifyImage || a.image || '';
}

export default function CommunityVote({ artistA, artistB }: CommunityVoteProps) {
  const nameA = getArtistName(artistA);
  const nameB = getArtistName(artistB);

  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });
  // Triggers the CSS bar slide-in after results mount
  const [barReady, setBarReady] = useState(false);

  // true if displayed artist A is the alphabetically-first slot in the DB
  const displayAIsDbA =
    [nameA, nameB].sort((x, y) => x.localeCompare(y))[0] === nameA;

  function mapDbToDisplay(dbVotesA: number, dbVotesB: number) {
    return {
      votesA: displayAIsDbA ? dbVotesA : dbVotesB,
      votesB: displayAIsDbA ? dbVotesB : dbVotesA,
    };
  }

  // Map displayed side ('a'|'b') → DB slot ('a'|'b')
  function toDbVote(side: 'a' | 'b'): 'a' | 'b' {
    if (displayAIsDbA) return side;
    return side === 'a' ? 'b' : 'a';
  }

  // On mount: check if this user already voted for this pair
  useEffect(() => {
    if (!nameA || !nameB) return;
    const stored = localStorage.getItem(lsKey(nameA, nameB)) as 'a' | 'b' | null;
    if (!stored) return;

    fetch(`/api/votes?a=${encodeURIComponent(nameA)}&b=${encodeURIComponent(nameB)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.votes) {
          const { votesA, votesB } = mapDbToDisplay(data.votes.votesA, data.votes.votesB);
          setPhase({ kind: 'result', votesA, votesB, voted: stored });
          setTimeout(() => setBarReady(true), 50);
        }
      })
      .catch(() => {/* silently stay idle */});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameA, nameB]);

  async function handleVote(side: 'a' | 'b') {
    setPhase({ kind: 'loading', pending: side });
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ a: nameA, b: nameB, vote: toDbVote(side) }),
      });
      const data = await res.json();
      if (data.votes) {
        localStorage.setItem(lsKey(nameA, nameB), side);
        const { votesA, votesB } = mapDbToDisplay(data.votes.votesA, data.votes.votesB);
        setPhase({ kind: 'result', votesA, votesB, voted: side });
        setTimeout(() => setBarReady(true), 50);
      } else {
        setPhase({ kind: 'idle' });
      }
    } catch {
      setPhase({ kind: 'idle' });
    }
  }

  if (!artistA || !artistB) return null;

  /* ── Results view ── */
  if (phase.kind === 'result') {
    const total = phase.votesA + phase.votesB;
    const pctA = Math.round((phase.votesA / total) * 100);
    const pctB = 100 - pctA;

    return (
      <SectionWrapper header="Community Verdict">
        {/* Artist name labels */}
        <div className="flex justify-between items-center mb-3 px-1">
          <div className="flex items-center gap-2 max-w-[45%]">
            {phase.voted === 'a' && (
              <span className="text-[#5EE9B5] text-xs">✓ your vote</span>
            )}
            <span className="text-sm font-semibold text-[#5EE9B5] truncate">{nameA}</span>
          </div>
          <div className="flex items-center gap-2 max-w-[45%] flex-row-reverse">
            {phase.voted === 'b' && (
              <span className="text-white/70 text-xs">your vote ✓</span>
            )}
            <span className="text-sm font-semibold text-white truncate">{nameB}</span>
          </div>
        </div>

        {/* Split bar */}
        <div className="relative h-11 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div
            className="h-full flex items-center justify-center transition-all duration-700 ease-out"
            style={{
              width: barReady ? `${pctA}%` : '50%',
              background: '#5EE9B5',
              minWidth: pctA > 0 ? '2rem' : '0',
            }}
          >
            {pctA > 12 && (
              <span className="text-black text-sm font-bold select-none">{pctA}%</span>
            )}
          </div>
          <div
            className="h-full flex items-center justify-center transition-all duration-700 ease-out"
            style={{
              width: barReady ? `${pctB}%` : '50%',
              background: 'rgba(255,255,255,0.80)',
              minWidth: pctB > 0 ? '2rem' : '0',
            }}
          >
            {pctB > 12 && (
              <span className="text-black text-sm font-bold select-none">{pctB}%</span>
            )}
          </div>
        </div>

        {/* Vote counts */}
        <div className="flex justify-between mt-2 px-1">
          <span className="text-xs text-white/40">{phase.votesA.toLocaleString()} votes</span>
          <span className="text-xs text-white/40">{phase.votesB.toLocaleString()} votes</span>
        </div>
      </SectionWrapper>
    );
  }

  /* ── Voting buttons view ── */
  const isLoading = phase.kind === 'loading';

  return (
    <SectionWrapper header="Community Verdict">
      <p className="text-center text-white/50 text-sm mb-5">Who do you think is better?</p>
      <div className="flex items-center gap-3">
        {/* Artist A */}
        <button
          disabled={isLoading}
          onClick={() => handleVote('a')}
          className="flex-1 flex flex-col items-center gap-2 rounded-2xl py-5 px-3 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            border: '2px solid rgba(94,233,181,0.35)',
            background: isLoading && phase.pending === 'a'
              ? 'rgba(94,233,181,0.15)'
              : 'rgba(94,233,181,0.05)',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              (e.currentTarget as HTMLButtonElement).style.border = '2px solid rgba(94,233,181,0.85)';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(94,233,181,0.12)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              (e.currentTarget as HTMLButtonElement).style.border = '2px solid rgba(94,233,181,0.35)';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(94,233,181,0.05)';
            }
          }}
        >
          {artistA.spotifyImageUrl || artistA.spotifyImage || artistA.image ? (
            <img
              src={artistImage(artistA)}
              alt={nameA}
              className="w-16 h-16 rounded-full object-cover"
              style={{ border: '2px solid rgba(94,233,181,0.50)' }}
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-black text-xl font-bold"
              style={{ background: '#5EE9B5' }}
            >
              {nameA[0]}
            </div>
          )}
          <span className="text-white font-semibold text-sm text-center leading-tight">{nameA}</span>
          <span className="text-xs font-medium" style={{ color: '#5EE9B5' }}>
            {isLoading && phase.pending === 'a' ? '…' : 'Vote'}
          </span>
        </button>

        {/* VS divider */}
        <span className="text-white/25 font-bold text-base shrink-0">vs</span>

        {/* Artist B */}
        <button
          disabled={isLoading}
          onClick={() => handleVote('b')}
          className="flex-1 flex flex-col items-center gap-2 rounded-2xl py-5 px-3 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            border: '2px solid rgba(255,255,255,0.18)',
            background: isLoading && phase.pending === 'b'
              ? 'rgba(255,255,255,0.10)'
              : 'rgba(255,255,255,0.04)',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              (e.currentTarget as HTMLButtonElement).style.border = '2px solid rgba(255,255,255,0.55)';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.09)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              (e.currentTarget as HTMLButtonElement).style.border = '2px solid rgba(255,255,255,0.18)';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
            }
          }}
        >
          {artistB.spotifyImageUrl || artistB.spotifyImage || artistB.image ? (
            <img
              src={artistImage(artistB)}
              alt={nameB}
              className="w-16 h-16 rounded-full object-cover"
              style={{ border: '2px solid rgba(255,255,255,0.28)' }}
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-black text-xl font-bold"
              style={{ background: 'rgba(255,255,255,0.80)' }}
            >
              {nameB[0]}
            </div>
          )}
          <span className="text-white font-semibold text-sm text-center leading-tight">{nameB}</span>
          <span className="text-xs font-medium text-white/55">
            {isLoading && phase.pending === 'b' ? '…' : 'Vote'}
          </span>
        </button>
      </div>
    </SectionWrapper>
  );
}
