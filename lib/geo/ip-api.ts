export interface IpGeoResult {
  city: string | null;
  regionName: string | null;
  countryCode: string | null;
  org: string | null;
}

const EMPTY_GEO: IpGeoResult = {
  city: null,
  regionName: null,
  countryCode: null,
  org: null,
};

function isLookupableIp(ip: string): boolean {
  const normalized = ip.trim().toLowerCase();
  if (!normalized || normalized === 'unknown') return false;
  if (normalized === '::1' || normalized.startsWith('127.')) return false;
  if (normalized.startsWith('10.')) return false;
  if (normalized.startsWith('192.168.')) return false;

  const parts = normalized.split('.');
  if (parts.length === 4) {
    const second = Number(parts[1]);
    if (parts[0] === '172' && second >= 16 && second <= 31) return false;
  }

  return true;
}

/**
 * Resolve city, region, country code, and org from an IP via ip-api.com.
 * Returns null fields when lookup is skipped or fails.
 */
export async function lookupIpGeo(ip: string | null | undefined): Promise<IpGeoResult> {
  if (!ip || !isLookupableIp(ip)) return { ...EMPTY_GEO };

  const fields = 'status,message,city,regionName,countryCode,org';
  const url = `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=${fields}`;

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(3000),
      cache: 'no-store',
    });

    if (!res.ok) return { ...EMPTY_GEO };

    const data = (await res.json()) as {
      status?: string;
      city?: string;
      regionName?: string;
      countryCode?: string;
      org?: string;
    };

    if (data.status !== 'success') return { ...EMPTY_GEO };

    return {
      city: data.city?.trim() || null,
      regionName: data.regionName?.trim() || null,
      countryCode: data.countryCode?.trim() || null,
      org: data.org?.trim() || null,
    };
  } catch {
    return { ...EMPTY_GEO };
  }
}
