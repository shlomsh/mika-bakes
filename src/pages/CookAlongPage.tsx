import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/apiClient';
import { RecipeWithDetails } from '@/types';
import CookAlong from '@/components/cook-along/CookAlong';
import RecipeLoading from '@/components/recipe-page/RecipeLoading';
import RecipeNotFound from '@/components/recipe-page/RecipeNotFound';
import SEOHead from '@/components/SEOHead';

const CookAlongPage: React.FC = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();

  const { data: recipe, isLoading } = useQuery({
    queryKey: ['recipe', recipeId || null],
    queryFn: () =>
      recipeId
        ? apiFetch<RecipeWithDetails>(`/api/recipe/${recipeId}`)
        : Promise.resolve(null),
  });

  if (isLoading) return <RecipeLoading />;
  if (!recipe) return <RecipeNotFound />;

  return (
    <>
      <SEOHead
        title={`מבשלים: ${recipe.name} - ספר המתכונים של מיקה`}
        description={`בישול שלב-אחר-שלב: ${recipe.name}`}
        url={`/recipe/${recipeId}/cook`}
      />
      <CookAlong
        recipe={recipe}
        onClose={() => navigate(`/recipe/${recipeId}`)}
      />
    </>
  );
};

export default CookAlongPage;
