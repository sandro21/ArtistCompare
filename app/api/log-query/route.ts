import { NextResponse } from 'next/server';
import { logQuery } from '@/lib/db/trends';
import { cookies } from 'next/headers';

// Generate or get session ID from cookie
async function getOrCreateSessionId(): Promise<string> {
	const cookieStore = await cookies();
	let sessionId = cookieStore.get('session_id')?.value;
	
	if (!sessionId) {
		// Generate a new session ID
		sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
	}
	
	return sessionId;
}

// Get client IP address from request
function getClientIp(request: Request): string | null {
	// Check various headers for IP (handles proxies, load balancers, etc.)
	const forwarded = request.headers.get('x-forwarded-for');
	if (forwarded) {
		return forwarded.split(',')[0].trim();
	}
	
	const realIp = request.headers.get('x-real-ip');
	if (realIp) {
		return realIp;
	}
	
	// Fallback (won't work in serverless, but good to have)
	return null;
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { artistA, artistB, sessionId } = body;

		if (!artistA || !artistB) {
			return NextResponse.json(
				{ error: 'Missing artistA or artistB' },
				{ status: 400 }
			);
		}

		// Get IP address and user agent from request
		const ipAddress = getClientIp(request);
		const userAgent = request.headers.get('user-agent') || null;
		const finalSessionId = sessionId || await getOrCreateSessionId();
		
		// Get referrer and origin
		const referrer = request.headers.get('referer') || request.headers.get('referrer') || null;
		const origin = request.headers.get('origin') || null;
		
		// Get all request headers as JSON object
		const requestHeaders: Record<string, string> = {};
		request.headers.forEach((value, key) => {
			requestHeaders[key] = value;
		});

		// Log query (fire-and-forget style, don't block on errors)
		await logQuery(artistA, artistB, ipAddress, userAgent, finalSessionId, referrer, origin, requestHeaders);

		const response = NextResponse.json({ ok: true, sessionId: finalSessionId });
		
		// Set session cookie if it doesn't exist
		if (!sessionId) {
			response.cookies.set('session_id', finalSessionId, {
				maxAge: 60 * 60 * 24 * 30, // 30 days
				httpOnly: true,
				sameSite: 'lax'
			});
		}

		return response;
	} catch (error) {
		console.error('Error logging query:', error);
		// Still return success to not block user experience
		return NextResponse.json({ ok: false, error: 'Failed to log query' });
	}
}


