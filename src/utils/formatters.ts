export const formatCOP = (value: number): string =>
  `$${value.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

export const formatPriceWithCurrency = (
  value: number,
  currency: 'COP' | 'USD' = 'COP'
): string => {
  if (currency === 'USD') return `$${value.toLocaleString('en-US')}`;
  return `${formatCOP(value)} ${currency}`;
};

export const formatRating = (rating: number): string => rating.toFixed(1);

export const formatReviews = (count: number): string =>
  count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count);
