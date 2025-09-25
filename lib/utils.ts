import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string): string {
  if (typeof amount === 'string') {
    return amount;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function calculateAge(dob: string): number {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export function getCoverageStatusColor(status: string): string {
  switch (status) {
    case 'covered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'prior_auth_required':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'not_covered':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'step_therapy':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getCoverageStatusIcon(status: string): string {
  switch (status) {
    case 'covered':
      return '✅';
    case 'prior_auth_required':
      return '⚠️';
    case 'not_covered':
      return '❌';
    case 'step_therapy':
      return '🔄';
    default:
      return '❓';
  }
}

export function simulateProcessingDelay(ms: number = 1000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateRandomId(): string {
  return Math.random().toString(36).substr(2, 9);
}
