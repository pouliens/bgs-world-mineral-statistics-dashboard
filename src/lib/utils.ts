import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats large numbers into compact notation (e.g., 1.2M, 350K, 1.5B)
 * @param value The number to format
 * @param decimals Number of decimal places to show (default: 1)
 * @returns Formatted string
 */
export function formatCompactNumber(value: number, decimals: number = 1): string {
  if (value === 0) return '0';

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1e9) {
    return sign + (absValue / 1e9).toFixed(decimals) + 'B';
  } else if (absValue >= 1e6) {
    return sign + (absValue / 1e6).toFixed(decimals) + 'M';
  } else if (absValue >= 1e3) {
    return sign + (absValue / 1e3).toFixed(decimals) + 'K';
  }

  return sign + absValue.toFixed(decimals);
}

/**
 * Formats numbers for display without excessive decimal places
 * @param value The number to format
 * @param maxDecimals Maximum decimal places (default: 0 for whole numbers)
 * @returns Formatted string with thousand separators
 */
export function formatNumber(value: number, maxDecimals: number = 0): string {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: 0,
  });
}
