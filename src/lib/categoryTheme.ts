import type { CSSProperties } from 'react';
import { getCategoryColor } from './categoryColors';

type ThemeVarName =
  | '--category-accent'
  | '--category-accent-soft'
  | '--category-accent-surface'
  | '--category-accent-surface-strong'
  | '--category-accent-button'
  | '--category-accent-button-hover'
  | '--category-accent-border'
  | '--category-accent-shadow'
  | '--category-accent-track';

export type CategoryThemeVars = CSSProperties & Record<ThemeVarName, string>;

const mixWithWhite = (color: string, amount: number) =>
  `color-mix(in oklab, ${color} ${amount}%, white ${100 - amount}%)`;

const mixWithTransparent = (color: string, amount: number) =>
  `color-mix(in oklab, ${color} ${amount}%, transparent ${100 - amount}%)`;

export function getCategoryThemeVars(colorClass: string | null | undefined): CategoryThemeVars {
  const accent = getCategoryColor(colorClass);

  return {
    '--category-accent': accent,
    '--category-accent-soft': mixWithWhite(accent, 18),
    '--category-accent-surface': mixWithWhite(accent, 24),
    '--category-accent-surface-strong': mixWithWhite(accent, 36),
    '--category-accent-button': mixWithWhite(accent, 58),
    '--category-accent-button-hover': mixWithWhite(accent, 70),
    '--category-accent-border': mixWithWhite(accent, 48),
    '--category-accent-shadow': mixWithTransparent(accent, 34),
    '--category-accent-track': mixWithWhite(accent, 38),
  };
}
