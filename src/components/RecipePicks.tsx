import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import TransitionLink from "@/components/TransitionLink";
import RecipePicksSkeleton from "@/components/skeletons/RecipePicksSkeleton";

type RecipePick = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
};

const fetchRecommendedRecipes = async (): Promise<RecipePick[]> => {
  return apiFetch<RecipePick[]>('/api/recipes/recommended');
};

const RecipePicks: React.FC = () => {
  const { data: recipes, isLoading, isError } = useQuery({
    queryKey: ['recommendedRecipes'],
    queryFn: fetchRecommendedRecipes,
  });

  if (isLoading) {
    return <RecipePicksSkeleton />;
  }

  return (
    <section
      className="rounded-3xl p-7 mt-8 animate-fade-up delay-200 bg-pastelOrange/20 ring-1 ring-choco/5"
      dir="rtl"
    >
      <h2 className="font-fredoka text-2xl mb-4 text-choco flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">💛</span>
        הכי אהובים של מיקה
      </h2>
      {isError || !recipes || recipes.length === 0 ? (
        <p className="text-choco/80">לא נמצאו מתכונים מומלצים כרגע.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {recipes.map((recipe, index) => (
            <div key={recipe.id} className="animate-fade-up" style={{ animationDelay: `${300 + index * 80}ms` }}>
            <TransitionLink
              to={`/recipe/${recipe.id}`}
              className="group flex items-center gap-4 p-3 rounded-xl bg-white/60 card-lift-flat no-underline"
            >
              <img
                src={recipe.image_url || '/placeholder.svg'}
                alt={recipe.name}
                className="w-16 h-16 object-cover rounded-xl border-2 border-white shadow-sm transition-transform duration-300 group-hover:scale-105"
                style={{ viewTransitionName: `recipe-hero-${recipe.id}` } as React.CSSProperties}
              />
              <div className="flex-1">
                <div className="font-fredoka text-lg text-choco transition-transform duration-300 group-hover:-translate-y-0.5">
                  {recipe.name}
                </div>
                <div className="text-choco/80 text-sm">{recipe.description}</div>
              </div>
            </TransitionLink>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecipePicks;
