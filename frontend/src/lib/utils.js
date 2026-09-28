import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS class names conditionally and merges layout conflicts.
 * Tailored to resolve style priorities seamlessly for your Tailwind v4 configurations.
 *
 * @param {...import("clsx").ClassValue} inputs - Array of classes or conditional structures
 * @returns {string} - A clean, space-separated string of resolved class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
