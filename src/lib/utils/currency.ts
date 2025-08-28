/**
 * Currency utility functions for property management
 */

export const CURRENCY_CONFIG = {
  currency: 'KES',
  locale: 'en-KE',
  symbol: 'KES',
} as const;

/**
 * Format a number as currency
 */
export function formatCurrency(
  amount: number,
  options?: {
    showSymbol?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  const {
    showSymbol = true,
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  } = options || {};

  const formatter = new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
    style: showSymbol ? 'currency' : 'decimal',
    currency: CURRENCY_CONFIG.currency,
    minimumFractionDigits,
    maximumFractionDigits,
  });

  if (showSymbol) {
    return formatter.format(amount);
  }

  // For non-currency style, manually add symbol
  return `${CURRENCY_CONFIG.symbol} ${formatter.format(amount)}`;
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  if (!value || typeof value !== 'string') return 0;
  
  // Remove currency symbols and spaces
  const cleaned = value.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format currency for input fields (no currency symbol)
 */
export function formatCurrencyInput(amount: number): string {
  return formatCurrency(amount, { showSymbol: false });
}

/**
 * Validate currency amount
 */
export function isValidCurrencyAmount(amount: number): boolean {
  return typeof amount === 'number' && !isNaN(amount) && amount >= 0;
}

/**
 * Get currency display info
 */
export function getCurrencyInfo() {
  return {
    symbol: CURRENCY_CONFIG.symbol,
    currency: CURRENCY_CONFIG.currency,
    locale: CURRENCY_CONFIG.locale,
  };
}
