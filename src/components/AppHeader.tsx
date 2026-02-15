
import React from 'react';
import { Link } from 'react-router-dom';
import type { Category } from "@/types";
import { RecipeSearch } from './RecipeSearch';

interface AppHeaderProps {
  categories: Category[] | undefined;
}

const AppHeader: React.FC<AppHeaderProps> = ({ categories }) => {
  return (
    <header dir="rtl" className="w-full flex flex-col sm:flex-row items-center sm:justify-between gap-4 py-4 px-6 bg-gradient-to-l from-white via-white to-pastelYellow/30 border-b border-choco/5 shadow-sm animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="text-3xl group-hover:animate-bounce transition-transform" role="img" aria-hidden="true">🧁</span>
          <span className="font-fredoka text-2xl text-choco tracking-tight">ספר המתכונים של מיקה</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <RecipeSearch />
      </div>
    </header>
  );
};

export default AppHeader;
