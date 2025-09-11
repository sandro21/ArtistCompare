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
    if (!artistAId || !artistAName) return;
    setLoadingA(true); setErrorA(null); setAData(null);
    fetch(`/api/music-metrics?artistName=${encodeURIComponent(artistAName)}&spotifyId=${encodeURIComponent(artistAId)}&topTracksOnly=true`)
      .then(r => r.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
        setAData(json.tracks || []);
      })
      .catch(e => setErrorA(e.message || 'Failed'))
      .finally(() => setLoadingA(false));
  }, [artistAId, artistAName]);

  useEffect(() => {
    if (!artistBId || !artistBName) return;
    setLoadingB(true); setErrorB(null); setBData(null);
    fetch(`/api/music-metrics?artistName=${encodeURIComponent(artistBName)}&spotifyId=${encodeURIComponent(artistBId)}&topTracksOnly=true`)
      .then(r => r.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
        setBData(json.tracks || []);
      })
      .catch(e => setErrorB(e.message || 'Failed'))
      .finally(() => setLoadingB(false));
  }, [artistBId, artistBName]);

  const renderTable = (rows: TrackRow[] | null, loading: boolean, error: string | null, title: string, isRightSide: boolean = false) => (
    <div className="flex-1 min-w-[150px] sm:min-w-[250px]">
      {loading && <div className="text-xs text-emerald-300/70">Loading...</div>}
      {error && <div className="text-xs text-red-400">{error}</div>}
      {!loading && !error && rows && (
        <ul className="space-y-1 sm:space-y-2 text-sm">
          {rows.map((t, index) => {
            // Compare with the same position track from the other side
            const otherSideData = isRightSide ? aData : bData;
            const otherTrack = otherSideData?.[index];
            const isHigher = otherTrack ? t.totalStreams > otherTrack.totalStreams : false;
            const isLower = otherTrack ? t.totalStreams < otherTrack.totalStreams : false;
            
            return (
              <li key={t.url} className="p-2 rounded-lg border border-emerald-400/30 bg-black/30">
                {isRightSide ? (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div className="flex items-center gap-2 flex-1 justify-end min-w-0 sm:order-2">
                      <div className="flex flex-col items-end">
                        <a href={t.url} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 text-right min-w-0 max-w-[90px] sm:max-w-[180px] md:max-w-[140px] truncate block" title={t.name}>
                          {t.name}
                        </a>
                        <span className={`tabular-nums text-right text-xs sm:block md:hidden ${
                          isHigher ? 'text-emerald-400 font-bold' : 
                          isLower ? 'text-emerald-100' : 
                          'text-emerald-200'
                        }`}>{t.totalStreamsFormatted}</span>
                      </div>
                      {t.albumImage && (
                        <img 
                          src={t.albumImage} 
                          alt={t.albumName || t.name}
                          className="w-9 h-9 rounded object-cover border border-emerald-400/40 flex-shrink-0"
                        />
                      )}
                    </div>
                    <span className={`tabular-nums text-right flex-shrink-0 hidden md:block md:order-1 ${
                      isHigher ? 'text-emerald-400 font-bold' : 
                      isLower ? 'text-emerald-100' : 
                      'text-emerald-200'
                    }`}>{t.totalStreamsFormatted}</span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {t.albumImage && (
                        <img 
                          src={t.albumImage} 
                          alt={t.albumName || t.name}
                          className="w-9 h-9 rounded object-cover border border-emerald-400/40 flex-shrink-0"
                        />
                      )}
                      <div className="flex flex-col">
                        <a href={t.url} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 min-w-0 max-w-[90px] sm:max-w-[180px] md:max-w-[140px] truncate block" title={t.name}>
                          {t.name}
                        </a>
                        <span className={`tabular-nums text-xs sm:block md:hidden ${
                          isHigher ? 'text-emerald-400 font-bold' : 
                          isLower ? 'text-emerald-100' : 
                          'text-emerald-200'
                        }`}>{t.totalStreamsFormatted}</span>
                      </div>
                    </div>
                    <span className={`tabular-nums text-right flex-shrink-0 hidden md:block ${
                      isHigher ? 'text-emerald-400 font-bold' : 
                      isLower ? 'text-emerald-100' : 
                      'text-emerald-200'
                    }`}>{t.totalStreamsFormatted}</span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  return (
    <SectionWrapper header="Top Streamed Songs">
      <div className="flex flex-row gap-1 md:gap-6">
        {renderTable(aData, loadingA, errorA, artistAName, false)}
        {renderTable(bData, loadingB, errorB, artistBName, true)}
      </div>
    </SectionWrapper>
  );
};

export default TopStreams;
