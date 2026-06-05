import type { Artist } from '../../types';

export const EMPTY_ARTIST: Artist = {
  artistName: '',
  name: '',
  spotifyId: null,
  spotifyImageUrl: '',
  activeYears: '',
  songsCount: 0,
  albumsCount: 0,
  streams: {
    spotifyRank: 0,
    monthlyListeners: 0,
    totalStreams: 0,
  },
  riaaCertifications: {
    Gold: 0,
    Platinum: 0,
    Diamond: 0,
  },
  charts: {
    billboardHot100Number1s: 0,
    billboardHot100Top10s: 0,
    billboard200Number1s: 0,
    totalWeeksOnHot100: 0,
  },
  awards: {
    grammyWins: 0,
    grammyNominations: 0,
  },
};

export function getArtistName(artist: Artist | null | undefined): string {
  if (!artist) return '';
  return artist.artistName || artist.name || '';
}

export function getArtistImage(artist: Artist | null | undefined): string {
  if (!artist) return '';
  return artist.spotifyImageUrl || artist.image || artist.spotifyImage || '';
}
