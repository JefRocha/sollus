import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isMaster() {
  return process.env.NEXT_PUBLIC_IS_MASTER === 'true';
}

/**
 * Formata o nome do usuário com a primeira letra de cada palavra em maiúscula
 * @param name - Nome completo do usuário
 * @returns Nome formatado em Title Case
 */
export function formatUserName(name: string | undefined | null): string {
  if (!name) return '';

  return name
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
