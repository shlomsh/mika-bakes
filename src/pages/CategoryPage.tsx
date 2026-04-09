import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, BookOpen, Plus } from 'lucide-react';
import type { Recipe, Category } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import TransitionLink from '@/components/TransitionLink';
import RecipeCardSkeleton from '@/components/skeletons/RecipeCardSkeleton';

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
      <div className="min-h-screen w-full flex flex-col items-center p-8 bg-floating-shapes" style={{ direction: "rtl" }}>
        <div className="w-full max-w-4xl mb-10">
          <div className="skeleton h-9 w-64 rounded mb-2" />
        </div>
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[0, 1, 2, 3, 4, 5].map((i) => <RecipeCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    const is404 = (error as Error & { status?: number }).status === 404;
    return (
      <div className="min-h-screen w-full flex flex-col items-center p-8 bg-gradient-mesh" style={{ direction: "rtl" }}>
        <header className="w-full max-w-4xl mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="font-fredoka text-3xl text-choco w-full text-right sm:w-auto">
            {is404 ? 'קטגוריה לא נמצאה' : 'שגיאה בטעינת הקטגוריה'}
          </h1>
          <div className="flex self-end sm:self-auto">
            <Button asChild variant="outline" className="text-choco border-choco hover:bg-choco/10 hidden sm:inline-flex">
              <Link to="/">
                <ArrowRight className="ml-2 h-4 w-4" />
                חזרה לדף הבית
              </Link>
            </Button>
            <Button asChild variant="outline" size="icon" className="text-choco border-choco hover:bg-choco/10 sm:hidden">
                <Link to="/" aria-label="חזרה לדף הבית">
                  <ArrowRight className="h-4 w-4" />
                </Link>
            </Button>
          </div>
        </header>
        <main className="w-full max-w-4xl">
          <p className="text-choco/80 text-lg text-center">
            {is404
              ? 'לא הצלחנו למצוא את הקטגוריה המבוקשת. נסה לחזור לדף הבית ולבחור קטגוריה אחרת.'
              : 'אירעה שגיאה בטעינת הקטגוריה. נסה שוב מאוחר יותר.'}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-8 bg-floating-shapes" style={{ direction: "rtl" }}>
      <span className="baking-pattern" aria-hidden="true" />
      <span className="bg-blob-extra" aria-hidden="true" />
      <header className="w-full max-w-4xl mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 animate-fade-up relative z-10">
        <h1 className="font-fredoka text-3xl text-choco w-full text-right sm:w-auto">
          מתכונים בקטגוריית: {formattedCategoryName}
        </h1>
        <div className="flex items-center gap-2 sm:gap-4 self-end sm:self-auto">
          {isAuthenticated && (
             <>
                {/* Desktop Add Recipe Button */}
                <Button asChild className="hidden sm:inline-flex">
                    <Link to={`/new-recipe?categoryId=${category.id}`}>
                      <Plus className="ml-2 h-4 w-4" />
                      הוסף מתכון
                    </Link>
                </Button>
                {/* Mobile Add Recipe Button */}
                <Button asChild size="icon" className="sm:hidden">
                    <Link to={`/new-recipe?categoryId=${category.id}`} aria-label="הוסף מתכון">
                      <Plus className="h-4 w-4" />
                    </Link>
                </Button>
             </>
          )}

          {/* Desktop Back Button */}
          <Button asChild variant="outline" className="text-choco border-choco hover:bg-choco/10 hidden sm:inline-flex">
            <Link to="/">
              <ArrowRight className="ml-2 h-4 w-4" />
              חזרה לדף הבית
            </Link>
          </Button>

          {/* Mobile Back Button */}
          <Button asChild variant="outline" size="icon" className="text-choco border-choco hover:bg-choco/10 sm:hidden">
            <Link to="/" aria-label="חזרה לדף הבית">
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>
      <main className="w-full max-w-4xl relative z-10">
        {recipesForCategory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipesForCategory.map((recipe: Recipe, index: number) => (
              <TransitionLink
                to={`/recipe/${recipe.id}`}
                className="group block animate-fade-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <Card
                  className="flex flex-col overflow-hidden shadow-lg card-lift ring-1 ring-white/80 h-full cursor-pointer"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.78)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={recipe.image_url || `https://via.placeholder.com/400x200/f0e0d0/a08070?text=${encodeURIComponent(recipe.name)}`}
                      alt={recipe.name}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      style={{ borderRadius: '1.25rem 1.25rem 0 0', viewTransitionName: `recipe-hero-${recipe.id}` } as React.CSSProperties}
                    />
                  </div>
                  <CardHeader className="flex-1">
                    <CardTitle className="font-fredoka text-xl text-choco transition-transform duration-300 group-hover:-translate-y-0.5">{recipe.name}</CardTitle>
                    {recipe.description && (
                      <CardDescription className="text-choco/75 line-clamp-2">
                        {recipe.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0 pb-4">
                    <div className="flex items-center justify-end gap-1 text-choco/35 group-hover:text-choco/65 transition-colors duration-300 text-sm font-fredoka">
                      <span>לצפייה במתכון</span>
                      <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </TransitionLink>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <BookOpen className="mx-auto h-16 w-16 text-choco/50 mb-4" />
            <p className="text-choco/80 text-lg">
              אוי, עוד אין מתכונים בקטגוריה זו.
            </p>
            <p className="text-choco/60 text-md">בקרוב נוסיף לכאן עוד המון מתכונים טעימים!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
