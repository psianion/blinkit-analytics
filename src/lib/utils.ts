import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (num: number): string => {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`; // Crores
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`; // Lakhs
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`; // Thousands
  return num.toString();
};
