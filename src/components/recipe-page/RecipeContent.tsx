import React from 'react';
import { ListChecks, Utensils, Soup, Sparkles } from 'lucide-react';
import { RecipeWithDetails } from './types';

interface RecipeContentProps {
  recipe: RecipeWithDetails;
}

const IngredientChecklist: React.FC<{ ingredients: { description: string }[]; accentColor: string }> = ({ ingredients, accentColor }) => (
  <div className="rounded-2xl overflow-hidden border border-choco/5">
    {ingredients.map((ingredient, index) => (
      <div
        key={index}
        className={`flex items-center gap-3 px-4 py-2.5 animate-fade-up ${index % 2 === 0 ? accentColor : 'bg-white'}`}
        style={{ animationDelay: `${index * 35}ms` }}
      >
        <span className="w-2 h-2 rounded-full bg-choco/30 shrink-0" />
        <span className="text-choco/90 leading-snug">{ingredient.description}</span>
      </div>
    ))}
  </div>
);

const StepList: React.FC<{ steps: { step_number: number; description: string }[]; accentBg: string; useHtml?: boolean }> = ({ steps, accentBg, useHtml }) => (
  <ol className="w-full list-none space-y-6 text-choco/90">
    {steps.map((step) => (
      <li key={step.step_number} className="flex items-start gap-x-4 animate-fade-up" style={{ animationDelay: `${step.step_number * 60}ms` }}>
        <div className={`step-circle ${accentBg}`}>
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

const RecipeContent: React.FC<RecipeContentProps> = ({ recipe }) => {
  return (
    <div className="animate-fade-up">
      {/* Full-bleed hero image with overlay */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl mb-8">
        <img
          src={recipe.image_url || `https://via.placeholder.com/600x400/f0e0d0/a08070?text=${encodeURIComponent(recipe.name)}`}
          alt={recipe.name}
          className="w-full h-72 md:h-96 object-cover"
          style={{ borderRadius: 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-choco/60 via-choco/10 to-transparent" />
        {recipe.description && (
          <div className="absolute bottom-0 right-0 left-0 p-6 md:p-8">
            <p className="text-white/90 text-lg md:text-xl font-inter max-w-2xl leading-relaxed drop-shadow-lg">
              {recipe.description}
            </p>
          </div>
        )}
      </div>

      {/* Ingredients section */}
      {recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0 && (
        <section className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-4 animate-fade-up delay-100">
          <h2 className="font-fredoka text-xl text-choco mb-4 flex items-center">
            <ListChecks className="ml-2 text-pastelOrange hover-wobble" />
            מצרכים:
          </h2>
          <IngredientChecklist ingredients={recipe.recipe_ingredients} accentColor="bg-pastelYellow/20" />
        </section>
      )}

      {/* Wavy divider */}
      <div className="divider-wavy my-2" />

      {/* Instructions section */}
      {recipe.recipe_instructions && recipe.recipe_instructions.length > 0 && (
        <section className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-4 animate-fade-up delay-200">
          <h2 className="font-fredoka text-xl text-choco mb-6 flex items-center">
            <Utensils className="ml-2 text-pastelBlue hover-wobble" />
            אופן ההכנה:
          </h2>
          <StepList steps={recipe.recipe_instructions} accentBg="bg-pastelBlue" useHtml />
        </section>
      )}

      {/* Sauce section */}
      {(recipe.recipe_sauces && recipe.recipe_sauces.length > 0 || (recipe.recipe_sauce_ingredients && recipe.recipe_sauce_ingredients.length > 0)) && (
        <>
          <div className="divider-wavy my-2" />
          <section className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-4 animate-fade-up delay-300">
            <h2 className="font-fredoka text-xl text-choco mb-4 flex items-center">
              <Soup className="ml-2 text-pastelOrange hover-wobble" />
              רוטב:
            </h2>

            {recipe.recipe_sauce_ingredients && recipe.recipe_sauce_ingredients.length > 0 && (
              <div className="mb-6">
                <h3 className="font-fredoka text-lg text-choco mb-3 flex items-center">
                  <ListChecks className="ml-2 text-pastelOrange" />
                  מצרכים לרוטב:
                </h3>
                <IngredientChecklist ingredients={recipe.recipe_sauce_ingredients} accentColor="bg-pastelOrange/20" />
              </div>
            )}

            {recipe.recipe_sauces && recipe.recipe_sauces.length > 0 && (
              <div>
                <h3 className="font-fredoka text-lg text-choco mb-4 flex items-center">
                  <Utensils className="ml-2 text-pastelOrange" />
                  אופן הכנת הרוטב:
                </h3>
                <StepList steps={recipe.recipe_sauces} accentBg="bg-pastelOrange" />
              </div>
            )}
          </section>
        </>
      )}

      {/* Garnish section */}
      {(recipe.recipe_garnish_instructions && recipe.recipe_garnish_instructions.length > 0 || (recipe.recipe_garnish_ingredients && recipe.recipe_garnish_ingredients.length > 0)) && (
        <>
          <div className="divider-wavy my-2" />
          <section className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-4 animate-fade-up delay-400">
            <h2 className="font-fredoka text-xl text-choco mb-4 flex items-center">
              <Sparkles className="ml-2 text-pastelYellow hover-wobble" />
              תוספת:
            </h2>

            {recipe.recipe_garnish_ingredients && recipe.recipe_garnish_ingredients.length > 0 && (
              <div className="mb-6">
                <h3 className="font-fredoka text-lg text-choco mb-3 flex items-center">
                  <ListChecks className="ml-2 text-pastelYellow" />
                  מצרכים לתוספת:
                </h3>
                <IngredientChecklist ingredients={recipe.recipe_garnish_ingredients} accentColor="bg-pastelYellow/20" />
              </div>
            )}

            {recipe.recipe_garnish_instructions && recipe.recipe_garnish_instructions.length > 0 && (
              <div>
                <h3 className="font-fredoka text-lg text-choco mb-4 flex items-center">
                  <Utensils className="ml-2 text-pastelYellow" />
                  אופן הכנת התוספת:
                </h3>
                <StepList steps={recipe.recipe_garnish_instructions} accentBg="bg-pastelYellow" />
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default RecipeContent;
