"use client";
import React, { useEffect, useState } from 'react';
import SectionWrapper from './SectionWrapper';

interface TrackRow {
  name: string;
  url: string;
  totalStreams: number;
  totalStreamsFormatted: string;
  dailyStreams?: number | null;
  dailyStreamsFormatted?: string | null;
  albumImage?: string | null;
  albumName?: string | null;
}

interface TopStreamsProps {
  artistAId?: string;
  artistBId?: string;
  artistAName?: string;
  artistBName?: string;
}

const TopStreams: React.FC<TopStreamsProps> = ({ artistAId, artistBId, artistAName = 'Artist A', artistBName = 'Artist B' }) => {
  const [aData, setAData] = useState<TrackRow[] | null>(null);
  const [bData, setBData] = useState<TrackRow[] | null>(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [errorA, setErrorA] = useState<string | null>(null);
  const [errorB, setErrorB] = useState<string | null>(null);

  useEffect(() => {
    if (!artistAId) return;
    setLoadingA(true); setErrorA(null); setAData(null);
    fetch(`/api/artist-top-streams?artistId=${encodeURIComponent(artistAId)}`)
      .then(r => r.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
        setAData(json.tracks || []);
      })
      .catch(e => setErrorA(e.message || 'Failed'))
      .finally(() => setLoadingA(false));
  }, [artistAId]);

  useEffect(() => {
    if (!artistBId) return;
    setLoadingB(true); setErrorB(null); setBData(null);
    fetch(`/api/artist-top-streams?artistId=${encodeURIComponent(artistBId)}`)
      .then(r => r.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
        setBData(json.tracks || []);
      })
      .catch(e => setErrorB(e.message || 'Failed'))
      .finally(() => setLoadingB(false));
  }, [artistBId]);

  const renderTable = (rows: TrackRow[] | null, loading: boolean, error: string | null, title: string, isRightSide: boolean = false) => (
    <div className="flex-1 min-w-[250px]">
      <h4 className={`text-sm tracking-wide text-emerald-300 mb-2 font-semibold ${isRightSide ? 'text-right' : ''}`}>{title}</h4>
      {loading && <div className="text-xs text-emerald-300/70">Loading...</div>}
      {error && <div className="text-xs text-red-400">{error}</div>}
      {!loading && !error && rows && (
        <ul className="space-y-1 text-xs">
          {rows.map(t => (
            <li key={t.url} className="flex justify-between items-center gap-3 p-2 rounded-lg border border-emerald-400/30 bg-black/30">
              {isRightSide ? (
                <>
                  <span className="tabular-nums text-emerald-200">{t.totalStreamsFormatted}</span>
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <a href={t.url} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 truncate text-right">{t.name}</a>
                    {t.albumImage && (
                      <img 
                        src={t.albumImage} 
                        alt={t.albumName || t.name}
                        className="w-8 h-8 rounded object-cover border border-emerald-400/40"
                      />
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 flex-1">
                    {t.albumImage && (
                      <img 
                        src={t.albumImage} 
                        alt={t.albumName || t.name}
                        className="w-8 h-8 rounded object-cover border border-emerald-400/40"
                      />
                    )}
                    <a href={t.url} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 truncate">{t.name}</a>
                  </div>
                  <span className="tabular-nums text-emerald-200 text-right">{t.totalStreamsFormatted}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <SectionWrapper header="Top Streamed Songs">
      <div className="flex flex-col md:flex-row gap-6">
        {renderTable(aData, loadingA, errorA, artistAName, false)}
        {renderTable(bData, loadingB, errorB, artistBName, true)}
      </div>
    </SectionWrapper>
  );
};

export default TopStreams;
