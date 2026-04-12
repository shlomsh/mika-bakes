import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Plus, Home } from 'lucide-react';
import DynamicIcon from '@/components/DynamicIcon';
import type { Recipe, Category } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import RecipeCard from '@/components/RecipeCard';
import RecipeCardSkeleton from '@/components/skeletons/RecipeCardSkeleton';
import AppHeader from '@/components/AppHeader';
import Breadcrumb from '@/components/Breadcrumb';

const fetchCategoryAndRecipes = async (categorySlug: string | undefined): Promise<{ category: Category; recipes: Recipe[] }> => {
  if (!categorySlug) {
    throw new Error('Category slug is required');
  }
  return apiFetch<{ category: Category; recipes: Recipe[] }>(`/api/category/${categorySlug}`);
};

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['category', categoryName],
    queryFn: () => fetchCategoryAndRecipes(categoryName),
    enabled: !!categoryName,
  });

  const category = data?.category;
  const recipesForCategory = data?.recipes || [];

  const formattedCategoryName = category
    ? category.name
    : categoryName?.replace('-', ' ') || 'קטגוריה';

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-floating-shapes" style={{ direction: 'rtl' }}>
        <AppHeader />
        <div className="flex flex-col items-center px-8 py-10 relative z-10">
          <div className="w-full max-w-4xl mb-10">
            <div className="skeleton h-10 w-56 rounded-xl" />
          </div>
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4, 5].map((i) => <RecipeCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const is404 = (error as Error & { status?: number }).status === 404;
    return (
      <div className="min-h-screen w-full flex flex-col bg-gradient-mesh" style={{ direction: 'rtl' }}>
        <AppHeader />
        <div className="flex flex-col items-center px-8 py-10 relative z-10">
          <header className="w-full max-w-4xl mb-10">
            <h1 className="font-fredoka text-3xl text-choco text-right">
              {is404 ? 'קטגוריה לא נמצאה' : 'שגיאה בטעינת הקטגוריה'}
            </h1>
          </header>
          <main className="w-full max-w-4xl">
            <p className="text-choco/80 text-lg text-center">
              {is404
                ? 'לא הצלחנו למצוא את הקטגוריה המבוקשת. נסה לחזור לדף הבית ולבחור קטגוריה אחרת.'
                : 'אירעה שגיאה בטעינת הקטגוריה. נסה שוב מאוחר יותר.'}
            </p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-floating-shapes" style={{ direction: 'rtl' }}>
      <span className="baking-pattern" aria-hidden="true" />
      <span className="bg-blob-extra" aria-hidden="true" />
      <AppHeader />

      <div className="flex flex-col items-center px-8 py-10 relative z-10 flex-1">
        <header className="w-full max-w-4xl mb-10 flex flex-col gap-3 animate-fade-up">
          <Breadcrumb items={[
            { label: 'בית', to: '/', icon: <Home className="h-3.5 w-3.5" /> },
            { label: formattedCategoryName },
          ]} />
          <div className="flex flex-row justify-between items-center gap-4">
          <h1 className="font-fredoka text-4xl text-choco flex items-center gap-3">
            {category?.icon && (
              <span className={`inline-flex p-2 rounded-xl ${category.color || 'bg-pastelYellow'}`} aria-hidden="true">
                <DynamicIcon name={category.icon} className="w-7 h-7 text-choco" strokeWidth={2} />
              </span>
            )}
            {formattedCategoryName}
          </h1>
          {isAuthenticated && (
            <Button asChild className="shrink-0">
              <Link to={`/new-recipe?categoryId=${category.id}`} aria-label="הוסף מתכון">
                <Plus className="h-4 w-4 sm:ml-2" />
                <span className="hidden sm:inline">הוסף מתכון</span>
              </Link>
            </Button>
          )}
          </div>
        </header>

        <main className="w-full max-w-4xl relative z-10">
        {recipesForCategory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipesForCategory.map((recipe: Recipe, index: number) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🥐</p>
            <p className="font-fredoka text-2xl text-choco mb-2">עדיין אין מתכונים כאן</p>
            <p className="text-choco/60 leading-relaxed">מיקה עובדת על זה! בקרוב יגיעו מתכונים מדהימים לקטגוריה הזו.</p>
          </div>
        )}
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
