/**
 * Single source of truth for Billboard chart data cutoffs.
 *
 * 1963 — weekly Billboard 200 album chart begins; Hot 100 data exists back to 1958.
 * UI labels read min_year from generated JSON metadata (see Charts.tsx).
 *
 * Change here only, then run: npm run update-billboard
 */
module.exports = {
  MIN_YEAR: 1963,
};
