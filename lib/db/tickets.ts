import { neon } from '@neondatabase/serverless';
import type { TicketInfo } from '../../types';

const sql = neon(process.env.POSTGRES_URL || process.env.DATABASE_URL || '');

// Tour data changes slowly; refresh at most once per day.
const TTL_MS = 24 * 60 * 60 * 1000;

let tableReady: Promise<void> | null = null;

async function ensureTable(): Promise<void> {
  if (!tableReady) {
    tableReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS artist_tickets (
          spotify_id TEXT PRIMARY KEY,
          payload    JSONB NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `;
    })();
  }
  return tableReady;
}

/**
 * Return cached ticket info for an artist, or null if missing/expired.
 */
export async function getCachedTickets(spotifyId: string): Promise<TicketInfo | null> {
  try {
    await ensureTable();
    const rows = await sql`
      SELECT payload, updated_at
      FROM artist_tickets
      WHERE spotify_id = ${spotifyId}
    `;
    if (rows.length === 0) return null;

    const updatedAt = new Date(rows[0].updated_at).getTime();
    if (Date.now() - updatedAt > TTL_MS) return null;

    return rows[0].payload as TicketInfo;
  } catch (error) {
    console.error('getCachedTickets error:', error);
    return null;
  }
}

/**
 * Upsert ticket info for an artist and stamp it as freshly updated.
 */
export async function saveCachedTickets(spotifyId: string, info: TicketInfo): Promise<void> {
  try {
    await ensureTable();
    await sql`
      INSERT INTO artist_tickets (spotify_id, payload, updated_at)
      VALUES (${spotifyId}, ${JSON.stringify(info)}, NOW())
      ON CONFLICT (spotify_id)
      DO UPDATE SET payload = ${JSON.stringify(info)}, updated_at = NOW()
    `;
  } catch (error) {
    console.error('saveCachedTickets error:', error);
  }
}
