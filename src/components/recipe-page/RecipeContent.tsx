import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ListChecks, Utensils, Soup, Sparkles } from 'lucide-react';
import { RecipeWithDetails } from './types';
import ModeSelector, { CookAlongMode, readStoredMode } from '@/components/cook-along/ModeSelector';
import { getCategoryThemeVars } from '@/lib/categoryTheme';

interface RecipeContentProps {
  recipe: RecipeWithDetails;
  cookAlongPath?: string;
}

const IngredientChecklist: React.FC<{ ingredients: { description: string }[]; rowAccent: string }> = ({ ingredients, rowAccent }) => (
  <div className="rounded-xl overflow-hidden">
    {ingredients.map((ingredient, index) => (
      <div
        key={index}
        className={`flex items-center gap-3 px-4 py-2.5 animate-fade-up ${index % 2 === 0 ? rowAccent : ''}`}
        style={{ animationDelay: `${index * 35}ms` }}
      >
        <span className="w-2 h-2 rounded-full bg-choco/40 shrink-0 mt-1.5" />
        <span className="text-choco/90 leading-snug">{ingredient.description}</span>
      </div>
    ))}
  </div>
);

const StepList: React.FC<{ steps: { step_number: number; description: string }[]; accentStyle?: React.CSSProperties; accentBg?: string; useHtml?: boolean }> = ({ steps, accentStyle, accentBg, useHtml }) => (
  <ol className="w-full list-none space-y-6 text-choco/90">
    {steps.map((step) => (
      <li key={step.step_number} className="flex items-start gap-x-4 animate-fade-up" style={{ animationDelay: `${step.step_number * 60}ms` }}>
        <div className={`step-circle ${accentBg || ''}`} style={accentStyle}>
          {step.step_number}
        </div>
        {useHtml ? (
          <div
            className="flex-1 pt-1 leading-relaxed text-choco/90"
            dangerouslySetInnerHTML={{ __html: step.description }}
          />
        ) : (
          <p className="flex-1 pt-1 leading-relaxed text-choco/90">
            {step.description}
          </p>
        )}
      </li>
    ))}
  </ol>
);

const RecipeContent: React.FC<RecipeContentProps> = ({ recipe, cookAlongPath }) => {
  const [cookMode, setCookMode] = useState<CookAlongMode>(readStoredMode);
  const categoryTheme = getCategoryThemeVars(recipe.categories?.color);
  const categoryAccentCircle = {
    ...categoryTheme,
    backgroundColor: 'var(--category-accent-button)',
  } as React.CSSProperties;

  return (
    <div className="animate-fade-up">
      {/* Full-bleed hero image */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl mb-6">
        <img
          src={recipe.image_url || '/placeholder.svg'}
          alt={recipe.name}
          className="w-full h-72 md:h-96 object-cover"
          style={{ borderRadius: 0, viewTransitionName: `recipe-hero-${recipe.id}` } as React.CSSProperties}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-choco/60 via-choco/10 to-transparent" />
        {recipe.description && (
          <div className="absolute bottom-0 right-0 left-0 p-6 md:p-8">
            <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed drop-shadow-lg">
              {recipe.description}
            </p>
          </div>
        )}
      </div>

      {/* Cook-Along CTA */}
      {cookAlongPath && (
        <div
          className="rounded-3xl mb-6 overflow-hidden animate-fade-up shadow-md"
          style={{
            ...categoryTheme,
            backgroundColor: 'var(--category-accent-soft)',
            boxShadow: '0 18px 38px -28px var(--category-accent-shadow)',
          }}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-0">
            {/* Text block */}
            <div className="flex-1 px-6 pt-6 pb-4 sm:py-6 text-center sm:text-right">
              <h2 className="font-fredoka text-[1.6rem] leading-tight text-choco">בואו נבשל יחד 🧁</h2>
              <p className="text-sm text-choco/55 leading-relaxed mt-1">
                שלב אחר שלב, מסך גדול — הידיים נשארות במטבח.
              </p>
            </div>
            {/* Controls block */}
            <div className="flex flex-col sm:flex-row items-center gap-3 px-6 pb-6 sm:py-6 sm:border-r border-choco/8 shrink-0">
              <ModeSelector mode={cookMode} onChange={setCookMode} categoryColor={recipe.categories?.color} />
              <Link
                to={`${cookAlongPath}?mode=${cookMode}`}
                className="bg-[var(--category-accent-button)] hover:bg-[var(--category-accent-button-hover)] active:scale-95 transition-all text-choco font-fredoka text-lg px-6 py-2.5 rounded-2xl shadow-md shadow-[var(--category-accent-shadow)] flex items-center gap-2 no-tap-highlight"
                style={categoryTheme}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M16 5v14l-11-7z" /></svg>
                התחילו לבשל
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Ingredients — apricot tint */}
      {recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0 && (
        <section className="bg-pastelYellow/25 rounded-3xl p-6 md:p-8 mb-4 animate-fade-up delay-100">
          <h2 className="font-fredoka text-2xl text-choco mb-4 flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-choco/50 shrink-0" />
            מצרכים
          </h2>
          <IngredientChecklist ingredients={recipe.recipe_ingredients} rowAccent="bg-white/50" />
        </section>
      )}

      <div className="divider-wavy my-2" />

      {/* Instructions — clean off-white for maximum readability */}
      {recipe.recipe_instructions && recipe.recipe_instructions.length > 0 && (
        <section className="bg-off-white rounded-3xl p-6 md:p-8 mb-4 animate-fade-up delay-200">
          <h2 className="font-fredoka text-2xl text-choco mb-6 flex items-center gap-2">
            <Utensils className="h-5 w-5 text-choco/50 shrink-0" />
            אופן ההכנה
          </h2>
          <StepList steps={recipe.recipe_instructions} accentStyle={categoryAccentCircle} useHtml />
        </section>
      )}

      {/* Sauce — peach-orange tint */}
      {(recipe.recipe_sauces && recipe.recipe_sauces.length > 0 || (recipe.recipe_sauce_ingredients && recipe.recipe_sauce_ingredients.length > 0)) && (
        <>
          <div className="divider-wavy my-2" />
          <section className="bg-pastelOrange/25 rounded-3xl p-6 md:p-8 mb-4 animate-fade-up delay-300">
            <h2 className="font-fredoka text-2xl text-choco mb-4 flex items-center gap-2">
              <Soup className="h-5 w-5 text-choco/50 shrink-0" />
              רוטב
            </h2>

            {recipe.recipe_sauce_ingredients && recipe.recipe_sauce_ingredients.length > 0 && (
              <div className="mb-6">
                <h3 className="font-fredoka text-lg text-choco mb-3 flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-choco/50 shrink-0" />
                  מצרכים
                </h3>
                <IngredientChecklist ingredients={recipe.recipe_sauce_ingredients} rowAccent="bg-white/50" />
              </div>
            )}

            {recipe.recipe_sauces && recipe.recipe_sauces.length > 0 && (
              <div>
                <h3 className="font-fredoka text-lg text-choco mb-4 flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-choco/50 shrink-0" />
                  הכנה
                </h3>
                <StepList steps={recipe.recipe_sauces} accentBg="bg-pastelOrange" />
              </div>
            )}
          </section>
        </>
      )}

      {/* Garnish — mint green tint */}
      {(recipe.recipe_garnish_instructions && recipe.recipe_garnish_instructions.length > 0 || (recipe.recipe_garnish_ingredients && recipe.recipe_garnish_ingredients.length > 0)) && (
        <>
          <div className="divider-wavy my-2" />
          <section className="bg-pastelPlum/30 rounded-3xl p-6 md:p-8 mb-4 animate-fade-up delay-400">
            <h2 className="font-fredoka text-2xl text-choco mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-choco/50 shrink-0" />
              תוספת
            </h2>

            {recipe.recipe_garnish_ingredients && recipe.recipe_garnish_ingredients.length > 0 && (
              <div className="mb-6">
                <h3 className="font-fredoka text-lg text-choco mb-3 flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-choco/50 shrink-0" />
                  מצרכים
                </h3>
                <IngredientChecklist ingredients={recipe.recipe_garnish_ingredients} rowAccent="bg-white/50" />
              </div>
            )}

            {recipe.recipe_garnish_instructions && recipe.recipe_garnish_instructions.length > 0 && (
              <div>
                <h3 className="font-fredoka text-lg text-choco mb-4 flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-choco/50 shrink-0" />
                  הכנה
                </h3>
                <StepList steps={recipe.recipe_garnish_instructions} accentBg="bg-pastelPlum" />
              </div>
            )}
          </section>
        </>
      )}

      {/* Bottom CTA */}
      {cookAlongPath && (
        <section className="bg-off-white rounded-3xl p-6 md:p-8 animate-fade-up delay-500">
          <div
            className="p-5 rounded-2xl flex items-center justify-between gap-4 border"
            style={{
              ...categoryTheme,
              backgroundColor: 'var(--category-accent-soft)',
              borderColor: 'var(--category-accent-border)',
            }}
          >
            <div>
              <div className="font-fredoka text-choco">מוכנים לבשל?</div>
              <div className="text-sm text-choco/60">פתחו את מצב הבישול לקבלת הוראות צעד-צעד</div>
            </div>
            <Link
              to={`${cookAlongPath}?mode=${cookMode}`}
              className="bg-[var(--category-accent-button)] hover:bg-[var(--category-accent-button-hover)] transition-colors text-choco font-fredoka px-5 py-2.5 rounded-xl shadow shadow-[var(--category-accent-shadow)] flex items-center gap-2 shrink-0 no-tap-highlight"
              style={categoryTheme}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M16 5v14l-11-7z" /></svg>
              התחילו
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default RecipeContent;
