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
  return apiFetch<RecipePick[]>("/api/recipes/recommended");
};

const RecipePicks: React.FC = () => {
  const { data: recipes, isLoading, isError } = useQuery({
    queryKey: ["recommendedRecipes"],
    queryFn: fetchRecommendedRecipes,
  });

  if (isLoading) return <RecipePicksSkeleton />;

  if (isError || !recipes || recipes.length === 0) return null;

  const [featured, ...rest] = recipes;

  return (
    <section dir="rtl" className="animate-fade-up delay-200">
      <h2 className="font-fredoka text-2xl text-choco mb-5 flex items-center gap-2">
        <span aria-hidden="true">💛</span>
        הכי אהובים של מיקה
      </h2>

      {/* Featured pick — full-width tall card */}
      <TransitionLink
        to={`/recipe/${featured.id}`}
        className="group block mb-4 animate-fade-up"
      >
        <div className="relative rounded-2xl overflow-hidden h-60 md:h-80 card-lift">
          <img
            src={featured.image_url || "/placeholder.svg"}
            alt={featured.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-active:scale-105"
            style={
              {
                viewTransitionName: `recipe-hero-${featured.id}`,
              } as React.CSSProperties
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-choco/70 via-choco/15 to-transparent" />
          <div className="absolute bottom-0 right-0 left-0 p-5">
            <p className="font-fredoka text-2xl text-white leading-snug">
              {featured.name}
            </p>
            {featured.description && (
              <p className="text-white/75 text-sm mt-1 line-clamp-2 font-frankRuhl">
                {featured.description}
              </p>
            )}
          </div>
        </div>
      </TransitionLink>

      {/* Remaining picks — 2-col grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {rest.map((recipe, index) => (
            <TransitionLink
              key={recipe.id}
              to={`/recipe/${recipe.id}`}
              className="group block animate-fade-up"
              style={{ animationDelay: `${400 + index * 80}ms` }}
            >
              <div className="bg-off-white rounded-2xl overflow-hidden card-lift h-full flex flex-col">
                <img
                  src={recipe.image_url || "/placeholder.svg"}
                  alt={recipe.name}
                  className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105 group-active:scale-105"
                  style={
                    {
                      viewTransitionName: `recipe-hero-${recipe.id}`,
                    } as React.CSSProperties
                  }
                />
                <div className="p-3 flex-1">
                  <p className="font-fredoka text-base text-choco leading-snug group-hover:text-coral group-active:text-coral transition-colors duration-200">
                    {recipe.name}
                  </p>
                </div>
              </div>
            </TransitionLink>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecipePicks;
