import { NextResponse } from 'next/server';
import { logQuery } from '@/lib/db/trends';

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { artistA, artistB } = body;

		if (!artistA || !artistB) {
			return NextResponse.json(
				{ error: 'Missing artistA or artistB' },
				{ status: 400 }
			);
		}

		// Log query (fire-and-forget style, don't block on errors)
		await logQuery(artistA, artistB);

		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error('Error logging query:', error);
		// Still return success to not block user experience
		return NextResponse.json({ ok: false, error: 'Failed to log query' });
	}
}

