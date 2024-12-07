import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateFilename(filename: string, maxLength: number = 40): string {
  if (filename.length <= maxLength) return filename;
  
  const extension = filename.split('.').pop();
  const nameWithoutExtension = filename.slice(0, filename.lastIndexOf('.'));
  
  const truncatedLength = maxLength - 3 - (extension?.length ?? 0);
  return `${nameWithoutExtension.slice(0, truncatedLength)}...${extension}`;
}