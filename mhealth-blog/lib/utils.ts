import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
  if (!name) return "";

  const parts = name.trim().split(" ");
  
  // Get the first letter of the first word
  const firstInitial = parts[0]?.charAt(0).toUpperCase() || "";
  
  // Get the first letter of the second word (if it exists)
  const secondInitial = parts.length > 1 ? parts[1].charAt(0).toUpperCase() : "";

  return `${firstInitial}${secondInitial}`;
}

export function timeAgo(timestamp: number) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return count === 1 ? `1 ${interval.label} ago` : `${count} ${interval.label}s ago`;
    }
  }

  return 'just now';
}