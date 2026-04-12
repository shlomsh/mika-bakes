
import React from 'react';
import RecipeHeader from './RecipeHeader';
import RecipeContent from './RecipeContent';
import AppHeader from '@/components/AppHeader';
import { RecipeWithDetails } from './types';

interface RecipeDisplayProps {
  recipe: RecipeWithDetails;
  isAuthenticated: boolean;
  isDeletePending: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = (props) => {
  return (
    <div className="min-h-screen w-full flex flex-col animate-fade-in bg-gradient-mesh" style={{ direction: "rtl" }}>
      <span className="baking-pattern" aria-hidden="true" />
      <AppHeader />
      <div className="flex flex-col items-center px-4 md:px-8 py-8 flex-1 relative z-10">
        <RecipeHeader {...props} />
        <main className="w-full max-w-5xl">
          <RecipeContent recipe={props.recipe} />
        </main>
      </div>
    </div>
  );
};

export default RecipeDisplay;
