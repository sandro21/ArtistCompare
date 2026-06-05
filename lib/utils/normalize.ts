/**
 * Strip accents/diacritics so "Beyoncé" → "beyonce", "JAŸ-Z" → "jay-z".
 */
export function foldAccents(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Normalize artist name for Billboard JSON key lookup.
 * Matches keys produced by scripts/process-*-accurate.js (normalizeForGrouping).
 */
export function normalizeForBillboardLookup(name: string): string {
  if (!name) return '';

  return foldAccents(name)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Normalize for case-insensitive string comparison (Grammy, aliases).
 */
export function normalizeForComparison(name: string): string {
  if (!name) return '';

  return foldAccents(name)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}
