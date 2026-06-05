import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL || process.env.DATABASE_URL || '');

// Lazy table initialization — runs once per serverless cold start
let tableReady: Promise<void> | null = null;

async function ensureTable(): Promise<void> {
  if (!tableReady) {
    tableReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS artist_votes (
          pair_key   TEXT PRIMARY KEY,
          artist_a   TEXT NOT NULL,
          artist_b   TEXT NOT NULL,
          votes_a    INTEGER NOT NULL DEFAULT 1,
          votes_b    INTEGER NOT NULL DEFAULT 1,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `;
    })();
  }
  return tableReady;
}

/**
 * Sort two artist names alphabetically and return the canonical pair key.
 * Guarantees "Drake vs Jay-Z" and "Jay-Z vs Drake" map to the same row.
 */
export function normalizePair(
  name1: string,
  name2: string,
): { artistA: string; artistB: string; pairKey: string } {
  const [artistA, artistB] = [name1.trim(), name2.trim()].sort((a, b) =>
    a.localeCompare(b),
  );
  return { artistA, artistB, pairKey: `${artistA}|||${artistB}` };
}

export interface VoteResult {
  artistA: string;
  artistB: string;
  votesA: number;
  votesB: number;
}

export async function getVotes(
  name1: string,
  name2: string,
): Promise<VoteResult | null> {
  await ensureTable();
  const { pairKey } = normalizePair(name1, name2);

  const rows = await sql`
    SELECT artist_a, artist_b, votes_a, votes_b
    FROM artist_votes
    WHERE pair_key = ${pairKey}
  `;

  if (rows.length === 0) return null;

  return {
    artistA: rows[0].artist_a,
    artistB: rows[0].artist_b,
    votesA: Number(rows[0].votes_a),
    votesB: Number(rows[0].votes_b),
  };
}

/**
 * Cast a vote atomically.
 * voteFor: 'a' = vote for the alphabetically-first artist,
 *          'b' = vote for the alphabetically-second artist.
 * On first vote for a pair, inserts the row with votes 2/1.
 * On subsequent votes, increments the selected column at DB level.
 */
export async function castVote(
  name1: string,
  name2: string,
  voteFor: 'a' | 'b',
): Promise<VoteResult> {
  await ensureTable();
  const { artistA, artistB, pairKey } = normalizePair(name1, name2);

  const rows =
    voteFor === 'a'
      ? await sql`
          INSERT INTO artist_votes (pair_key, artist_a, artist_b, votes_a, votes_b)
          VALUES (${pairKey}, ${artistA}, ${artistB}, 2, 1)
          ON CONFLICT (pair_key) DO UPDATE
            SET votes_a    = artist_votes.votes_a + 1,
                updated_at = NOW()
          RETURNING artist_a, artist_b, votes_a, votes_b
        `
      : await sql`
          INSERT INTO artist_votes (pair_key, artist_a, artist_b, votes_a, votes_b)
          VALUES (${pairKey}, ${artistA}, ${artistB}, 1, 2)
          ON CONFLICT (pair_key) DO UPDATE
            SET votes_b    = artist_votes.votes_b + 1,
                updated_at = NOW()
          RETURNING artist_a, artist_b, votes_a, votes_b
        `;

  return {
    artistA: rows[0].artist_a,
    artistB: rows[0].artist_b,
    votesA: Number(rows[0].votes_a),
    votesB: Number(rows[0].votes_b),
  };
}
