import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isInstitutionalEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
  if (!emailRegex.test(trimmed)) return false;

  const domain = trimmed.split('@')[1];
  if (!domain) return false;

  return (
    domain.endsWith('.edu') ||
    /\.edu\.[a-z]{2,}$/.test(domain) ||
    /\.ac\.[a-z]{2,}$/.test(domain) ||
    domain.endsWith('institution.org') ||
    domain.endsWith('.gov') ||
    domain.endsWith('.org') ||
    domain.includes('pacific.edu') ||
    domain.includes('harvard.edu') ||
    domain.includes('stanford.edu') ||
    domain.includes('mit.edu')
  );
}
