
import React from 'react';
import RecipeHeader from './RecipeHeader';
import RecipeContent from './RecipeContent';
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
    <div className="min-h-screen w-full flex flex-col items-center p-4 md:p-8 animate-fade-in bg-gradient-mesh" style={{ direction: "rtl" }}>
      <span className="baking-pattern" aria-hidden="true" />
      <RecipeHeader {...props} />
      <main className="w-full max-w-5xl relative z-10">
        <RecipeContent recipe={props.recipe} />
      </main>
    </div>
  );
};

export default RecipeDisplay;
