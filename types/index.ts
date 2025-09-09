// Artist data structure
export interface Artist {
  artistName?: string;
  name?: string;
  spotifyId?: string | null;
  spotifyImageUrl?: string;
  image?: string;
  spotifyImage?: string;
  activeYears?: string;
  songsCount?: number;
  albumsCount?: number;
  streams?: {
    spotifyRank: number;
    monthlyListeners: number;
    totalStreams: number;
  };
  riaaCertifications?: {
    Gold: number;
    Platinum: number;
    Diamond: number;
  };
  charts?: {
    billboardHot100Number1s: number;
    billboardHot100Top10s: number;
    billboard200Number1s: number;
    totalWeeksOnHot100: number;
  };
  awards?: {
    grammyWins: number;
    grammyNominations: number;
    americanMusicAwards?: number;
    betAwards?: number;
    mtvVMAs?: number;
  };
}

// Search/Selection types
export interface ArtistPair {
  a: Artist;
  b: Artist;
}

// Spotify API types
export interface SpotifyArtist {
  id: string;
  name: string;
  images: Array<{ url: string; height: number; width: number }>;
  external_urls: { spotify: string };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  external_urls: { spotify: string };
}

// Music metrics types
export interface MusicMetrics {
  totalStreams: string;
  monthlyListeners: string;
  followers: string;
  monthlyListenersRank?: number | null;
  streamRank?: number | null;
}

// Component prop types
export interface ArtistComponentProps {
  artistA: Artist | null;
  artistB: Artist | null;
}
