
import React from 'react';
import AppHeader from '@/components/AppHeader';

const RecipeNotFound = () => (
  <div className="min-h-screen w-full flex flex-col bg-gradient-mesh" style={{ direction: 'rtl' }}>
    <AppHeader />
    <div className="flex flex-col items-center justify-center flex-1 px-8 text-center">
      <p className="text-6xl mb-4">🔍</p>
      <h1 className="font-fredoka text-3xl text-choco mb-3">אופס! מתכון לא נמצא</h1>
      <p className="text-choco/70 text-lg leading-relaxed max-w-md">
        לא הצלחנו למצוא את המתכון המבוקש. אולי הוא התחבא? נסה לחפש דרך סרגל החיפוש.
      </p>
    </div>
  </div>
);

export default RecipeNotFound;
