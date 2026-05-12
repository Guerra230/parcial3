export const formatCOP = (value: number): string => {
  return `$${value.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

export const formatPriceWithCurrency = (
  value: number,
  currency: 'COP' | 'USD' = 'COP'
): string => {
  if (currency === 'USD') {
    return `$${value.toLocaleString('en-US')}`;
  }
  return `${formatCOP(value)} ${currency}`;
};
