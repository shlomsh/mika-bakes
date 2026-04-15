// Category background colors.
//
// The database stores Tailwind class names (e.g. `bg-rose-200`), but the original
// assignments used three near-identical pink/rose hues at a washed-out `-200` shade.
// This module remaps those class names to the active palette.
//
// To change category card colors: edit the values in the map below.
// Colors are expressed in OKLCH for perceptual uniformity — equal lightness/chroma
// steps look equal, which HSL/hex does not guarantee.

const COLOR_REMAP: Record<string, string> = {
  // Active DB categories
  'bg-rose-200':    'oklch(73% 0.18 5)',    // deep rose-pink  — desserts (punchy hero)
  'bg-pink-200':    'oklch(78% 0.13 38)',   // warm peach      — savory pastries
  'bg-red-200':     'oklch(74% 0.11 320)',  // soft lilac      — stews

  // Extended palette for future categories
  'bg-yellow-200':  'oklch(82% 0.12 55)',
  'bg-sky-200':     'oklch(74% 0.10 270)',
  'bg-orange-200':  'oklch(78% 0.13 45)',
  'bg-green-200':   'oklch(76% 0.09 340)',
  'bg-purple-200':  'oklch(70% 0.12 305)',
  'bg-fuchsia-200': 'oklch(72% 0.14 335)',

  // Custom Tailwind pastel class names
  'bg-pastelYellow': 'oklch(82% 0.12 48)',
  'bg-pastelOrange': 'oklch(78% 0.13 40)',
  'bg-pastelGreen':  'oklch(76% 0.09 340)',
  'bg-pastelBlue':   'oklch(74% 0.10 275)',
};

const FALLBACK_COLOR = COLOR_REMAP['bg-pastelYellow'];

/**
 * Resolve a category's background color to a CSS color value.
 * Unknown/missing classes fall back to the default pastelYellow tone.
 */
export function getCategoryColor(colorClass: string | null | undefined): string {
  if (colorClass && COLOR_REMAP[colorClass]) return COLOR_REMAP[colorClass];
  return FALLBACK_COLOR;
}

/**
 * Ready-to-spread `style` object for setting a category's background color.
 */
export function getCategoryBgStyle(colorClass: string | null | undefined): { backgroundColor: string } {
  return { backgroundColor: getCategoryColor(colorClass) };
}
