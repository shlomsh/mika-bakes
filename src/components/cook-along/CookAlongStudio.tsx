import React, { useState, useEffect, useMemo } from 'react';
import { RecipeWithDetails } from '@/types';
import ModeSelector, { CookAlongMode } from './ModeSelector';
import { getCategoryThemeVars } from '@/lib/categoryTheme';
import { useIsMobile } from '@/hooks/use-mobile';

interface Props {
  recipe: RecipeWithDetails;
  mode: CookAlongMode;
  onModeChange: (mode: CookAlongMode) => void;
  onClose: () => void;
}

type IngItem = { description: string; section: string; key: string };
type StepItem =
  | { kind: 'heading'; title: string; key: string }
  | { kind: 'step'; description: string; step_number: number; key: string };

function buildIngredients(recipe: RecipeWithDetails): IngItem[] {
  const items: IngItem[] = [];
  recipe.recipe_ingredients.forEach((ing, i) =>
    items.push({ description: ing.description, section: 'מצרכים', key: `main-${i}` })
  );
  recipe.recipe_sauce_ingredients?.forEach((ing, i) =>
    items.push({ description: ing.description, section: 'לרוטב', key: `sauce-${i}` })
  );
  recipe.recipe_garnish_ingredients?.forEach((ing, i) =>
    items.push({ description: ing.description, section: 'לתוספת', key: `garnish-${i}` })
  );
  return items;
}

function buildSteps(recipe: RecipeWithDetails): StepItem[] {
  const items: StepItem[] = [];
  recipe.recipe_instructions.forEach(s =>
    items.push({ kind: 'step', description: s.description, step_number: s.step_number, key: `main-${s.step_number}` })
  );
  if (recipe.recipe_sauces?.length) {
    items.push({ kind: 'heading', title: 'רוטב', key: 'sauce-heading' });
    recipe.recipe_sauces.forEach(s =>
      items.push({ kind: 'step', description: s.description, step_number: s.step_number, key: `sauce-${s.step_number}` })
    );
  }
  if (recipe.recipe_garnish_instructions?.length) {
    items.push({ kind: 'heading', title: 'תוספת', key: 'garnish-heading' });
    recipe.recipe_garnish_instructions.forEach(s =>
      items.push({ kind: 'step', description: s.description, step_number: s.step_number, key: `garnish-${s.step_number}` })
    );
  }
  return items;
}

const CookAlongStudio: React.FC<Props> = ({ recipe, mode, onModeChange, onClose }) => {
  const categoryTheme = getCategoryThemeVars(recipe.categories?.color);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [ingredientsOpen, setIngredientsOpen] = useState(false);

  const ingredients = useMemo(() => buildIngredients(recipe), [recipe]);
  const steps = useMemo(() => buildSteps(recipe), [recipe]);
  const sections = useMemo(() => Array.from(new Set(ingredients.map(i => i.section))), [ingredients]);
  // Hover is a transient desktop preview; click/scroll sets the persistent selection
  const activeIdx = !isMobile && hoveredIdx !== null ? hoveredIdx : selectedIdx;
  const totalSteps = useMemo(() => steps.filter(s => s.kind === 'step').length, [steps]);
  const activeStepNum = useMemo(
    () => steps.slice(0, activeIdx + 1).filter(s => s.kind === 'step').length,
    [steps, activeIdx]
  );
  const progress = totalSteps > 0 ? (activeStepNum / totalSteps) * 100 : 0;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const Sidebar = () => (
    <div className="space-y-4">
      {sections.map(section => {
        const sectionItems = ingredients.filter(i => i.section === section);
        return (
          <div key={section}>
            {sections.length > 1 && (
              <div
                className="font-fredoka text-xs uppercase tracking-widest mb-2 px-1 text-[var(--category-accent)]"
                style={categoryTheme}
              >
                {section}
              </div>
            )}
            <ul className="space-y-0.5">
              {sectionItems.map(ing => (
                <li key={ing.key}>
                  <button
                    onClick={() => setChecked(c => ({ ...c, [ing.key]: !c[ing.key] }))}
                    className={[
                      'w-full text-right flex items-start gap-2.5 px-3 py-2 rounded-xl transition-colors text-sm',
                      checked[ing.key]
                        ? 'line-through text-choco/40 bg-pastelGreen/30'
                        : 'text-choco/85 hover:bg-pastelYellow/20',
                    ].join(' ')}
                  >
                    <span className={[
                      'mt-0.5 flex-shrink-0 w-4 h-4 rounded border transition-colors',
                      checked[ing.key]
                        ? 'bg-pastelGreen border-pastelGreen/60'
                        : 'border-choco/25 bg-white',
                    ].join(' ')}>
                      {checked[ing.key] && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-choco/60 p-0.5">
                          <path d="m5 12 5 5L20 7" />
                        </svg>
                      )}
                    </span>
                    <span className="flex-1 leading-snug">{ing.description}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      className="min-h-screen w-full flex flex-col bg-off-white animate-scale-in"
      style={{ direction: 'rtl' }}
    >
      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-choco/8 shrink-0">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-3 pb-2">
          {/* Controls row */}
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center justify-self-start gap-2 text-choco/70 hover:text-choco no-tap-highlight shrink-0 transition-colors"
              aria-label="סגור"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
              <span className="text-sm font-fredoka hidden sm:inline">סגור</span>
            </button>
            <div className="justify-self-center">
              <ModeSelector mode={mode} onChange={onModeChange} categoryColor={recipe.categories?.color} />
            </div>
            <div className="justify-self-end text-sm text-choco/60 font-fredoka tabular-nums">
              {activeStepNum}/{totalSteps}
            </div>
          </div>
          {/* Recipe title row */}
          <div className="text-center mt-1.5">
            <span className="font-fredoka text-base text-choco/70">{recipe.name}</span>
          </div>
        </div>
        {/* Progress strip */}
        <div className="h-0.5 bg-choco/5 mt-2">
          <div
            className="h-full bg-[var(--category-accent)] transition-all duration-500"
            style={{ ...categoryTheme, width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">

          {/* Ingredients */}
          <aside>
            {/* Mobile: collapsible */}
            <div className="lg:hidden">
              <button
                onClick={() => setIngredientsOpen(o => !o)}
                className="w-full flex items-center justify-between gap-2 hover:bg-[var(--category-accent-surface)] transition-colors rounded-xl px-4 py-3 mb-3 font-fredoka text-choco"
                style={{
                  ...categoryTheme,
                  backgroundColor: 'var(--category-accent-soft)',
                }}
              >
                <span>מצרכים ({ingredients.length})</span>
                <svg
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`w-4 h-4 transition-transform ${ingredientsOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {ingredientsOpen && (
                <div className="bg-white/70 rounded-2xl p-4 mb-4 border border-choco/5">
                  <Sidebar />
                </div>
              )}
            </div>

            {/* Desktop: sticky sidebar */}
            <div className="hidden lg:block sticky top-20">
              <div className="font-fredoka text-lg text-choco mb-3">מצרכים</div>
              <div className="bg-white/70 rounded-2xl p-4 border border-choco/5 max-h-[calc(100vh-10rem)] overflow-y-auto no-scrollbar">
                <Sidebar />
              </div>
            </div>
          </aside>

          {/* Steps */}
          <main className="space-y-4 pb-16">
            {steps.map((item, i) => {
              if (item.kind === 'heading') {
                return (
                  <div key={item.key} className="flex items-center gap-3 pt-2">
                    <div className="flex-1 h-px bg-choco/10" />
                    <span className="font-fredoka text-base text-choco/55">{item.title}</span>
                    <div className="flex-1 h-px bg-choco/10" />
                  </div>
                );
              }

              const isActive = i === activeIdx;
              return (
                <article
                  key={item.key}
                  onClick={() => setSelectedIdx(i)}
                  onMouseEnter={() => {
                    if (!isMobile) setHoveredIdx(i);
                  }}
                  onMouseLeave={() => {
                    if (!isMobile) setHoveredIdx(null);
                  }}
                  onFocus={() => setSelectedIdx(i)}
                  onBlur={() => setHoveredIdx(null)}
                  tabIndex={0}
                  className={[
                    'rounded-2xl p-5 sm:p-6 border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--category-accent-border)] cursor-pointer',
                    isActive
                      ? 'border-[var(--category-accent-border)] bg-[var(--category-accent-soft)] shadow-sm'
                      : 'border-transparent bg-white/60',
                  ].join(' ')}
                  style={categoryTheme}
                >
                  <div className="flex items-start gap-4">
                    <div className={[
                      'w-9 h-9 rounded-full flex items-center justify-center font-fredoka text-base shrink-0 transition-colors',
                      isActive ? 'bg-[var(--category-accent)] text-white' : 'bg-[var(--category-accent-button)] text-choco',
                    ].join(' ')}
                    style={categoryTheme}>
                      {item.step_number}
                    </div>
                    <p className="text-choco/85 leading-relaxed flex-1 pt-1">{item.description}</p>
                  </div>
                </article>
              );
            })}

            {/* Completion card */}
            <div className="rounded-2xl p-6 border border-pastelGreen/50 text-center mt-4 bg-[color:oklch(98%_0.02_145)] shadow-sm shadow-pastelGreen/20">
              <div className="text-3xl mb-2">🎉</div>
              <div className="font-fredoka text-xl text-choco">סיימתם! בתיאבון</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CookAlongStudio;
