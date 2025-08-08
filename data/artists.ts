export const artists = [
  {
    artistName: "Drake",
    spotifyImageUrl: "https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9",
    activeYears: "2001 - Present",
    songsCount: 300, // Approx: released + major features (simplified)
    albumsCount: 15, // Includes studio + collaborative/commercial projects
    streams: {
      spotifyRank: 3,
      monthlyListeners: 75_000_000, // Snapshot estimate
      totalStreams: 95_000_000_000, // Approx cumulative across catalogue (not official)
    },
    riaaCertifications: {
      Gold: 14, // Distinct Gold-certified releases (simplified sample)
      Platinum: 200, // Aggregated multi-platinum award count (simplified)
      Diamond: 5, // One Dance, God's Plan, Hotline Bling, Sicko Mode*, Life Is Good*
    },
    charts: {
      billboardHot100Number1s: 13, // Lead + credited features
      billboardHot100Top10s: 81, // Record Top 10 entries
      billboard200Number1s: 13, // Includes collaborative #1 albums (e.g., What a Time to Be Alive, Her Loss)
      totalWeeksOnHot100: 431, // Longest consecutive week streak
    },
    awards: {
      grammyWins: 5,
      grammyNominations: 55,
      americanMusicAwards: 7,
      betAwards: 17, // BET Awards (not including BET Hip Hop Awards)
      mtvVMAs: 3,
    },
    meta: {
      lastUpdated: "2025-01-20",
      sources: {
        charts: "Billboard / Wikipedia Drake achievements summary (Hot 100 & 200 records)",
        awards: "Wikipedia: List of awards and nominations received by Drake",
        certifications: "RIAA (simplified aggregated counts)",
      },
      notes: [
        "Hot 100 metrics include featured appearances.",
        "Billboard 200 #1s include collaborative projects.",
        "Weeks figure is consecutive streak, not lifetime cumulative weeks.",
        "Certification counts are simplified, not raw unit totals.",
        "Diamond singles list includes featured credits (*).",
      ],
    },
  },
  {
    artistName: "Kanye West",
    spotifyImageUrl: "https://i8.amplience.net/i/naras/kanye-west_MI0005472981-MN0000361014",
    activeYears: "1996 - Present",
    songsCount: 250, // Approx incl. major features
    albumsCount: 13, // Studio + major collaborative releases
    streams: {
      spotifyRank: 25,
      monthlyListeners: 55_000_000, // Snapshot estimate
      totalStreams: 60_000_000_000, // Approx cumulative (not official)
    },
    riaaCertifications: {
      Gold: 33,
      Platinum: 120, // Aggregated multi-platinum award count (simplified)
      Diamond: 1, // Stronger (pending verification if more are certified later)
    },
    charts: {
      billboardHot100Number1s: 4,
      billboardHot100Top10s: 22, // Lead + featured
      billboard200Number1s: 11, // Includes Watch the Throne, Vultures 1
      totalWeeksOnHot100: 250, // Placeholder (needs cumulative or streak clarification)
    },
    awards: {
      grammyWins: 24,
      grammyNominations: 75,
      americanMusicAwards: 3,
      betAwards: 11, // BET Awards only
      mtvVMAs: 5,
    },
    meta: {
      lastUpdated: "2025-01-20",
      sources: {
        charts: "Billboard / Wikipedia Kanye West chart history",
        awards: "Wikipedia: List of awards and nominations received by Kanye West",
        certifications: "RIAA (simplified aggregated counts)",
      },
      notes: [
        "Hot 100 metrics include featured appearances.",
        "Billboard 200 #1s include collaborative projects.",
        "Weeks metric is a placeholder requiring refined source.",
        "Certification counts simplified; not raw unit totals.",
      ],
    },
  },
];
