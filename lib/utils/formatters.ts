export const parseMetricValue = (value: string): number => {
  if (!value) return 0;

  const cleanValue = value.toLowerCase().replace(/,/g, '');

  if (cleanValue.includes('billion')) {
    const num = parseFloat(cleanValue.replace('billion', '').trim());
    return Math.round(num * 1000000000);
  }

  if (cleanValue.includes('million')) {
    const num = parseFloat(cleanValue.replace('million', '').trim());
    return Math.round(num * 1000000);
  }

  if (cleanValue.includes('thousand') || cleanValue.includes('k')) {
    const num = parseFloat(cleanValue.replace(/thousand|k/g, '').trim());
    return Math.round(num * 1000);
  }

  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : Math.round(parsed);
};
