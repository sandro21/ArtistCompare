"use client";
import React, { useState, useEffect } from 'react';
import type { Artist } from '../types';

interface StickyArtistImagesProps {
  artistA: Artist | null;
  artistB: Artist | null;
}

const StickyArtistImages: React.FC<StickyArtistImagesProps> = ({ artistA, artistB }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Get the viewport height and trigger much earlier (around 0.5 viewport heights)
      const viewportHeight = window.innerHeight;
      const triggerPoint = viewportHeight * 0.5;
      
      setIsSticky(currentScrollY > triggerPoint);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!artistA && !artistB) {
    return null;
  }

  return (
    <div 
      className={`transition-all duration-500 ease-in-out z-40 hidden sm:block ${
        isSticky 
          ? 'fixed top-16 w-screen pointer-events-none' 
          : 'absolute opacity-0 pointer-events-none'
      }`}
    >
      {/* Artist A - Left Side */}
      <div 
        className={`absolute transition-all duration-600 ease-out ${
          isSticky 
            ? 'left-20 md:left-24 opacity-100 transform translate-x-0 scale-100' 
            : 'left-1/2 opacity-0 transform -translate-x-1/2 scale-75'
        }`}
        style={{ 
          transitionDelay: isSticky ? '100ms' : '0ms'
        }}
      >
        <div className="flex flex-col items-center">
          {/* Bigger image with green glow */}
          <div 
            className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-green-400"
            style={{
              boxShadow: '0 0 18.3px -3px #419369 inset, 0 0 20.6px 2px #419369'
            }}
          >
            {artistA?.spotifyImageUrl ? (
              <img
                src={artistA.spotifyImageUrl}
                alt={`${artistA.artistName || artistA.name} profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-white text-xl md:text-2xl font-bold">
                  {(artistA?.artistName || artistA?.name)?.[0]?.toUpperCase() || 'A'}
                </span>
              </div>
            )}
          </div>
          
          {/* Artist name */}
          <div className="mt-3 text-center max-w-[140px]">
            <p className="text-white text-sm md:text-base font-bold">
              {(artistA?.artistName || artistA?.name)?.toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Artist B - Right Side */}
      <div 
        className={`absolute transition-all duration-600 ease-out ${
          isSticky 
            ? 'right-20 md:right-24 opacity-100 transform translate-x-0 scale-100' 
            : 'right-1/2 opacity-0 transform translate-x-1/2 scale-75'
        }`}
        style={{ 
          transitionDelay: isSticky ? '200ms' : '0ms'
        }}
      >
        <div className="flex flex-col items-center">
          {/* Bigger image with green glow */}
          <div 
            className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-green-400"
            style={{
              boxShadow: '0 0 18.3px -3px #419369 inset, 0 0 20.6px 2px #419369'
            }}
          >
            {artistB?.spotifyImageUrl ? (
              <img
                src={artistB.spotifyImageUrl}
                alt={`${artistB.artistName || artistB.name} profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-white text-xl md:text-2xl font-bold">
                  {(artistB?.artistName || artistB?.name)?.[0]?.toUpperCase() || 'B'}
                </span>
              </div>
            )}
          </div>
          
          {/* Artist name */}
          <div className="mt-3 text-center max-w-[140px]">
            <p className="text-white text-sm md:text-base font-bold">
              {(artistB?.artistName || artistB?.name)?.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyArtistImages;
