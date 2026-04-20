import React from 'react';

export type CookAlongMode = 'cozy' | 'studio';

const STORAGE_KEY = 'mika.cookAlongMode';

export function readStoredMode(): CookAlongMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'cozy' || v === 'studio') return v;
  } catch {}
  return 'cozy';
}

interface ModeSelectorProps {
  mode: CookAlongMode;
  onChange: (mode: CookAlongMode) => void;
}

const PILLS: { value: CookAlongMode; label: string }[] = [
  { value: 'cozy',   label: 'שלב אחר שלב' },
  { value: 'studio', label: 'מצב מטבח' },
];

const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onChange }) => {
  const handleChange = (next: CookAlongMode) => {
    try { localStorage.setItem(STORAGE_KEY, next); } catch {}
    onChange(next);
  };

  return (
    <div className="inline-flex items-center gap-1 bg-white/70 rounded-full p-1 border border-choco/10">
      {PILLS.map(pill => (
        <button
          key={pill.value}
          onClick={() => handleChange(pill.value)}
          className={[
            'px-3 py-1.5 rounded-full text-sm font-fredoka transition-colors whitespace-nowrap',
            mode === pill.value
              ? 'bg-choco text-white shadow-sm'
              : 'text-choco/60 hover:text-choco',
          ].join(' ')}
        >
          {pill.label}
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;
