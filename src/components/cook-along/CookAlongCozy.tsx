import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { RecipeWithDetails } from '@/types';
import ModeSelector, { CookAlongMode } from './ModeSelector';
import { getCategoryThemeVars } from '@/lib/categoryTheme';

type CozyItem =
  | { kind: 'step'; description: string; step_number: number }
  | { kind: 'divider'; title: string }
  | { kind: 'done' };

function buildItems(recipe: RecipeWithDetails): CozyItem[] {
  const items: CozyItem[] = [];
  recipe.recipe_instructions.forEach(s =>
    items.push({ kind: 'step', description: s.description, step_number: s.step_number })
  );
  if (recipe.recipe_sauces?.length) {
    items.push({ kind: 'divider', title: 'עכשיו נכין את הרוטב' });
    recipe.recipe_sauces.forEach(s =>
      items.push({ kind: 'step', description: s.description, step_number: s.step_number })
    );
  }
  if (recipe.recipe_garnish_instructions?.length) {
    items.push({ kind: 'divider', title: 'עכשיו נכין את התוספת' });
    recipe.recipe_garnish_instructions.forEach(s =>
      items.push({ kind: 'step', description: s.description, step_number: s.step_number })
    );
  }
  items.push({ kind: 'done' });
  return items;
}

interface Props {
  recipe: RecipeWithDetails;
  mode: CookAlongMode;
  onModeChange: (mode: CookAlongMode) => void;
  onClose: () => void;
}

const CookAlongCozy: React.FC<Props> = ({ recipe, mode, onModeChange, onClose }) => {
  const STORAGE_KEY = `mika.cozy.${recipe.id}`;
  const categoryTheme = getCategoryThemeVars(recipe.categories?.color);
  const items = useMemo(() => buildItems(recipe), [recipe]);
  const dotCount = useMemo(() => items.filter(i => i.kind !== 'done').length, [items]);

  const [idx, setIdx] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return Math.min(saved.stepIndex ?? 0, items.length - 1);
    } catch { return 0; }
  });

  const touchStartX = useRef<number | null>(null);
  const current = items[idx];
  const isDone = current.kind === 'done';

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ stepIndex: idx }));
    } catch {
      // Ignore storage access issues and keep the current session usable.
    }
  }, [idx, STORAGE_KEY]);

  const next = useCallback(() => setIdx(i => Math.min(items.length - 1, i + 1)), [items.length]);
  const prev = useCallback(() => setIdx(i => Math.max(0, i - 1)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') next();
      else if (e.key === 'ArrowRight') prev();
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev, onClose]);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 50) return;
    // RTL: swipe right (positive delta) = next, swipe left = prev
    if (delta > 0) next(); else prev();
  };

  const onTapZone = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    const x = e.clientX / e.currentTarget.clientWidth;
    // RTL: left 40% = next, right 40% = prev
    if (x < 0.4) next();
    else if (x > 0.6) prev();
  };

  const totalSteps = items.filter(i => i.kind === 'step').length;
  const currentStepNum = current.kind === 'step'
    ? items.slice(0, idx + 1).filter(i => i.kind === 'step').length
    : null;

  return (
    <div
      className="min-h-screen w-full flex flex-col bg-gradient-mesh animate-scale-in overflow-hidden"
      style={{ direction: 'rtl' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <span className="baking-pattern" aria-hidden="true" />

      {/* Header */}
      <header className="relative z-20 shrink-0 px-5 sm:px-8 pt-4 pb-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center justify-self-start gap-2 text-choco/70 hover:text-choco transition no-tap-highlight"
            aria-label="סגור"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
          <div className="justify-self-center">
            <ModeSelector mode={mode} onChange={onModeChange} categoryColor={recipe.categories?.color} />
          </div>
          <div className="min-w-[5.5rem] justify-self-end text-sm text-choco/60 font-fredoka tabular-nums text-left">
            {current.kind !== 'done' && currentStepNum != null
              ? `${currentStepNum}/${totalSteps}`
              : ''}
          </div>
        </div>
        <div className="text-center mt-2">
          <span className="font-fredoka text-base text-choco/70 truncate">{recipe.name}</span>
        </div>
      </header>

      {/* Progress dots */}
      <div className="relative z-10 px-5 sm:px-8 mb-4 shrink-0">
        <div className="flex items-center gap-1.5 max-w-3xl mx-auto">
          {items.map((item, i) => {
            if (item.kind === 'done') return null;
            const isActive = i === idx;
            const isPast = i < idx;
            return (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="flex flex-1 items-center appearance-none border-0 bg-transparent p-0 no-tap-highlight"
                aria-label={`עבור לפריט ${i + 1}`}
              >
                <span
                  className={[
                    'block h-1.5 w-full rounded-full transition-all',
                    isDone
                      ? 'bg-pastelGreen/70'
                      : isActive
                        ? 'bg-[var(--category-accent)]'
                        : isPast
                          ? 'bg-[var(--category-accent-track)]'
                          : 'bg-choco/10',
                  ].join(' ')}
                  style={categoryTheme}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Step card */}
      <main
        className="flex-1 flex flex-col items-center justify-start pt-10 sm:pt-14 px-5 sm:px-8 pb-28 relative z-10"
        onClick={onTapZone}
      >
        <div key={idx} className="w-full max-w-2xl animate-step-pop">
          {current.kind === 'step' && (
            <>
              <div className="text-center mb-5">
                <span
                  className="font-fredoka text-sm uppercase tracking-widest text-[var(--category-accent)]"
                  style={categoryTheme}
                >
                  שלב {currentStepNum} מתוך {totalSteps}
                </span>
              </div>
              <div className="bg-white/85 glass rounded-3xl p-8 sm:p-10 shadow-lg border border-white/70">
                <p className="font-frankRuhl text-choco leading-relaxed text-xl sm:text-2xl text-center">
                  {current.description}
                </p>
              </div>
            </>
          )}

          {current.kind === 'divider' && (
            <div className="bg-white/85 glass rounded-3xl p-10 shadow-lg border border-white/70 text-center">
              <div className="text-5xl mb-4">👩‍🍳</div>
              <p className="font-fredoka text-2xl sm:text-3xl text-choco">{current.title}</p>
            </div>
          )}

          {current.kind === 'done' && (
            <div className="rounded-3xl p-10 shadow-lg border border-pastelGreen/50 text-center bg-[color:oklch(98%_0.02_145)]">
              <div className="text-5xl mb-4">🎉</div>
              <p className="font-fredoka text-3xl text-choco mb-2">סיימתם!</p>
              <p className="text-choco/70 mb-8">כל הכבוד — המנה מוכנה!</p>
              <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="bg-coral hover:bg-coralDeep transition-colors text-white font-fredoka text-lg px-8 py-3 rounded-2xl shadow-lg shadow-coral/30"
              >
                חזרה למתכון
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Bottom nav */}
      <div className="fixed bottom-0 inset-x-0 z-20 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-3 px-5 sm:px-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {/* prev — right side in RTL */}
          <button
            onClick={prev}
            disabled={idx === 0}
            className="w-14 h-14 rounded-full bg-white/90 border border-choco/10 shadow-lg grid place-items-center disabled:opacity-30 hover:bg-white transition no-tap-highlight"
            aria-label="שלב קודם"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-choco">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

          {/* next — left side in RTL */}
          {current.kind !== 'done' ? (
            <button
              onClick={next}
              className="w-14 h-14 rounded-full bg-[var(--category-accent-button)] hover:bg-[var(--category-accent-button-hover)] text-choco shadow-xl shadow-[var(--category-accent-shadow)] grid place-items-center no-tap-highlight transition-colors"
              style={categoryTheme}
              aria-label="שלב הבא"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
          ) : (
            <div className="w-14 h-14" />
          )}
        </div>
      </div>
    </div>
  );
};

export default CookAlongCozy;
