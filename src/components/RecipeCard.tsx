import React from 'react';
import TransitionLink from '@/components/TransitionLink';
import type { Recipe } from '@/types';

interface RecipeCardProps {
  recipe: Recipe;
  index?: number;
}

const RecipeCard: React.FC<RecipeCardProps> = React.memo(({ recipe, index = 0 }) => (
  <TransitionLink
    to={`/recipe/${recipe.id}`}
    className="group block animate-fade-up"
    style={{ animationDelay: `${index * 80}ms` }}
  >
    <div className="bg-off-white rounded-2xl overflow-hidden card-lift h-full flex flex-col">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={recipe.image_url || '/placeholder.svg'}
          alt={recipe.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ borderRadius: 0, viewTransitionName: `recipe-hero-${recipe.id}` } as React.CSSProperties}
        />
      </div>
      <div className="p-5 flex-1 flex flex-col gap-1.5">
        <h3 className="font-fredoka text-xl text-choco leading-snug group-hover:text-coral group-active:text-coral transition-colors duration-200">
          {recipe.name}
        </h3>
        {recipe.description && (
          <p className="text-sm text-choco/65 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        )}
      </div>
    </div>
  </TransitionLink>
));

export default RecipeCard;
