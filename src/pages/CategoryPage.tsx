import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, Plus } from 'lucide-react';
import type { Recipe, Category } from '@/types';
import { useAuth } from '@/hooks/useAuth';

const fetchCategoryAndRecipes = async (categorySlug: string | undefined): Promise<{ category: Category | null; recipes: Recipe[] }> => {
  if (!categorySlug) {
    return { category: null, recipes: [] };
  }

  try {
    return await apiFetch<{ category: Category; recipes: Recipe[] }>(`/api/category/${categorySlug}`);
  } catch {
    return { category: null, recipes: [] };
  }
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
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-8" style={{ background: "#faf9f7", direction: "rtl" }}>
        <p className="text-choco text-xl">טוען מתכונים...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center p-8" style={{ background: "#faf9f7", direction: "rtl" }}>
        <header className="w-full max-w-4xl mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="font-fredoka text-3xl text-choco w-full text-right sm:w-auto">
            קטגוריה לא נמצאה
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
            לא הצלחנו למצוא את הקטגוריה המבוקשת. נסה לחזור לדף הבית ולבחור קטגוריה אחרת.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-8" style={{ background: "#faf9f7", direction: "rtl" }}>
      <header className="w-full max-w-4xl mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
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
      <main className="w-full max-w-4xl">
        {recipesForCategory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipesForCategory.map((recipe: Recipe) => (
              <Card key={recipe.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
                <img
                  src={recipe.image_url || `https://via.placeholder.com/400x200/f0e0d0/a08070?text=${encodeURIComponent(recipe.name)}`}
                  alt={recipe.name}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle className="font-fredoka text-xl text-choco">{recipe.name}</CardTitle>
                  {recipe.description && (
                    <CardDescription className="text-choco/75 h-12 overflow-hidden text-ellipsis">
                      {recipe.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button asChild className="w-full bg-pastelBlue hover:bg-pastelBlue/90 text-choco font-bold">
                    <Link to={`/recipe/${recipe.id}`}>
                      הצג מתכון
                    </Link>
                  </Button>
                </CardContent>
              </Card>
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
