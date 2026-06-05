'use client';
import { useState, useEffect } from 'react';
import SectionWrapper from '../../components/SectionWrapper';
import { getArtistName } from '../../lib/utils/artist';
import type { Artist } from '../../types';

const VOTE_THRESHOLD = 30;

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
  const [barReady, setBarReady] = useState(false);

  // true when displayed artist A occupies the alphabetically-first DB slot
  const displayAIsDbA =
    [nameA, nameB].sort((x, y) => x.localeCompare(y))[0] === nameA;

  function mapDbToDisplay(dbVA: number, dbVB: number) {
    return {
      votesA: displayAIsDbA ? dbVA : dbVB,
      votesB: displayAIsDbA ? dbVB : dbVA,
    };
  }

  function toDbVote(side: 'a' | 'b'): 'a' | 'b' {
    if (displayAIsDbA) return side;
    return side === 'a' ? 'b' : 'a';
  }

  function resolvePhase(
    dbVA: number,
    dbVB: number,
    voted: 'a' | 'b',
  ): Phase {
    const { votesA, votesB } = mapDbToDisplay(dbVA, dbVB);
    return { kind: 'result', votesA, votesB, voted };
  }

  // On mount: restore previous vote for this pair
  useEffect(() => {
    if (!nameA || !nameB) return;
    const stored = localStorage.getItem(lsKey(nameA, nameB)) as 'a' | 'b' | null;
    if (!stored) return;

    fetch(`/api/votes?a=${encodeURIComponent(nameA)}&b=${encodeURIComponent(nameB)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.votes) {
          const next = resolvePhase(data.votes.votesA, data.votes.votesB, stored);
          setPhase(next);
          if (next.kind === 'result') setTimeout(() => setBarReady(true), 50);
        }
      })
      .catch(() => {/* stay idle */});
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
        const next = resolvePhase(data.votes.votesA, data.votes.votesB, side);
        setPhase(next);
        if (next.kind === 'result') setTimeout(() => setBarReady(true), 50);
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
    const aWins = pctA >= pctB;

    // Gradient mirrors ComparisonBar: winner side gets green, loser side stays dark
    const gradient = aWins
      ? 'linear-gradient(90deg, rgba(94,233,181,0.70) 0%, #081111 55%)'
      : 'linear-gradient(90deg, #081111 45%, rgba(94,233,181,0.70) 100%)';

    return (
      <SectionWrapper header="People's Favorite">
        {/* Artist name labels */}
        <div className="flex justify-between items-end mb-2 px-1">
          <div className="flex flex-col items-start max-w-[45%]">
            <span className="text-sm font-semibold text-white truncate">{nameA}</span>
            {phase.voted === 'a' && (
              <span className="text-[10px] text-[#5EE9B5]/80 mt-0.5">your vote</span>
            )}
          </div>
          <div className="flex flex-col items-end max-w-[45%]">
            <span className="text-sm font-semibold text-white truncate">{nameB}</span>
            {phase.voted === 'b' && (
              <span className="text-[10px] text-[#5EE9B5]/80 mt-0.5 text-right">your vote</span>
            )}
          </div>
        </div>

        {/* Bar — styled like ComparisonBar */}
        <div
          className="flex justify-between items-center px-6 py-2.5 transition-all duration-700 ease-out"
          style={{
            borderRadius: '4.4375rem',
            border: '1px solid #5EE9B5',
            background: barReady ? gradient : 'linear-gradient(90deg, #081111 0%, #081111 100%)',
            width: '100%',
          }}
        >
          <span className="text-white font-bold text-base sm:text-lg">{pctA}%</span>
          <span className="text-white text-sm sm:text-base font-medium text-center leading-tight">
            Community&apos;s Favorite
          </span>
          <span className="text-white font-bold text-base sm:text-lg">{pctB}%</span>
        </div>

        {/* Vote count — only shown once the pair has enough votes */}
        {total >= VOTE_THRESHOLD && (
          <p className="text-center text-white/30 text-xs mt-2">
            {total.toLocaleString()} votes cast
          </p>
        )}
      </SectionWrapper>
    );
  }

  /* ── Voting buttons ── */
  const isLoading = phase.kind === 'loading';

  return (
    <SectionWrapper header="People's Favorite">
      <div className="flex items-center gap-3">
        {/* Artist A */}
        <button
          disabled={isLoading}
          onClick={() => handleVote('a')}
          className="flex-1 flex flex-col items-center gap-2 rounded-2xl py-5 px-3 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            border: '2px solid rgba(255,255,255,0.18)',
            background:
              isLoading && (phase as { pending: 'a' | 'b' }).pending === 'a'
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
          {artistImage(artistA) ? (
            <img
              src={artistImage(artistA)}
              alt={nameA}
              className="w-16 h-16 rounded-full object-cover"
              style={{ border: '2px solid rgba(255,255,255,0.25)' }}
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-black text-xl font-bold"
              style={{ background: 'rgba(255,255,255,0.80)' }}
            >
              {nameA[0]}
            </div>
          )}
          <span className="text-white font-semibold text-sm text-center leading-tight">{nameA}</span>
          <span className="text-xs font-medium text-white/50">
            {isLoading && (phase as { pending: 'a' | 'b' }).pending === 'a' ? '…' : 'Vote'}
          </span>
        </button>

        <span className="text-white/25 font-bold text-base shrink-0">vs</span>

        {/* Artist B */}
        <button
          disabled={isLoading}
          onClick={() => handleVote('b')}
          className="flex-1 flex flex-col items-center gap-2 rounded-2xl py-5 px-3 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            border: '2px solid rgba(255,255,255,0.18)',
            background:
              isLoading && (phase as { pending: 'a' | 'b' }).pending === 'b'
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
          {artistImage(artistB) ? (
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
            {isLoading && (phase as { pending: 'a' | 'b' }).pending === 'b' ? '…' : 'Vote'}
          </span>
        </button>
      </div>
    </SectionWrapper>
  );
}
