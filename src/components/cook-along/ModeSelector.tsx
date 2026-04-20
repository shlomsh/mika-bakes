import React from 'react';
import { getCategoryThemeVars } from '@/lib/categoryTheme';

export type CookAlongMode = 'cozy' | 'studio';

const STORAGE_KEY = 'mika.cookAlongMode';

export function readStoredMode(): CookAlongMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'cozy' || v === 'studio') return v;
  } catch {
    // Ignore storage access issues and fall back to the default mode.
  }
  return 'cozy';
}

interface ModeSelectorProps {
  mode: CookAlongMode;
  onChange: (mode: CookAlongMode) => void;
  categoryColor?: string | null;
}

const PILLS: { value: CookAlongMode; label: string }[] = [
  { value: 'cozy',   label: 'שלב אחר שלב' },
  { value: 'studio', label: 'מצב מטבח' },
];

const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onChange, categoryColor }) => {
  const categoryTheme = getCategoryThemeVars(categoryColor);

  const handleChange = (next: CookAlongMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage access issues and still let the UI switch modes.
    }
    onChange(next);
  };

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border bg-white/80 p-1 shadow-sm"
      style={{
        ...categoryTheme,
        borderColor: 'var(--category-accent-border)',
        boxShadow: '0 10px 24px -20px var(--category-accent-shadow)',
      }}
    >
      {PILLS.map(pill => (
        <button
          key={pill.value}
          onClick={() => handleChange(pill.value)}
          className={[
            'px-3 py-1.5 rounded-full text-sm font-fredoka transition-all whitespace-nowrap',
            mode === pill.value
              ? 'bg-[var(--category-accent-button)] text-choco shadow-sm shadow-[var(--category-accent-shadow)]'
              : 'text-choco/60 hover:bg-[var(--category-accent-soft)] hover:text-choco',
          ].join(' ')}
          aria-pressed={mode === pill.value}
        >
          {pill.label}
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;
