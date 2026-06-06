/**
 * Centralizes affiliate link wrapping so the tracking ID lives in exactly one place.
 *
 * SeatGeek affiliate tracking appends an `aid` (affiliate id) query parameter to any
 * seatgeek.com destination URL. If no affiliate id is configured, the raw URL is
 * returned unchanged so the feature still works (just without attribution).
 */
const SEATGEEK_AFFILIATE_ID = process.env.SEATGEEK_AFFILIATE_ID;

export function wrapSeatGeekUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl) return null;

  if (!SEATGEEK_AFFILIATE_ID) return rawUrl;

  try {
    const url = new URL(rawUrl);
    url.searchParams.set('aid', SEATGEEK_AFFILIATE_ID);
    return url.toString();
  } catch {
    return rawUrl;
  }
}
