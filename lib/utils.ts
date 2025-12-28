import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format integer paisa/cents to INR string with symbol
// Input is stored as cents (e.g., 49900 for ₹499)
export function formatINR(cents?: number): string {
  const value = (cents ?? 0) / 100
  return `₹${value.toLocaleString("en-IN")}`
}
