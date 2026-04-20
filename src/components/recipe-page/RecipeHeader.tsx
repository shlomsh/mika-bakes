
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Home } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RecipeWithDetails } from './types';
import Breadcrumb from '@/components/Breadcrumb';
import { getCategoryThemeVars } from '@/lib/categoryTheme';

interface RecipeHeaderProps {
  recipe: RecipeWithDetails;
  isAuthenticated: boolean;
  isDeletePending: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const RecipeHeader: React.FC<RecipeHeaderProps> = ({ recipe, isAuthenticated, isDeletePending, onEdit, onDelete }) => {
  const categoryTheme = getCategoryThemeVars(recipe.categories?.color);
  const headerActionClassName =
    "rounded-full border-0 shadow-sm shadow-choco/10 font-fredoka transition-all duration-200 hover:-translate-y-0.5";

  return (
    <header className="w-full max-w-5xl mb-6 md:mb-10 flex flex-col relative z-10">
      <div className="flex items-start justify-between gap-4 mb-2">
        <Breadcrumb items={[
          { label: 'בית', to: '/', icon: <Home className="h-3.5 w-3.5" /> },
          ...(recipe.categories ? [{ label: recipe.categories.name, to: `/category/${recipe.categories.slug}` }] : []),
          { label: recipe.name },
        ]} />

        {isAuthenticated && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              aria-label="ערוך מתכון"
              className={`${headerActionClassName} bg-[var(--category-accent-button)] text-choco shadow-[var(--category-accent-shadow)] hover:bg-[var(--category-accent-button-hover)]`}
              style={categoryTheme}
            >
              <Pencil className="h-3.5 w-3.5 sm:ml-1.5" />
              <span className="hidden sm:inline text-sm">ערוך</span>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  aria-label="מחק מתכון"
                  className={`${headerActionClassName} bg-coral text-choco hover:bg-coralDeep`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent style={{ direction: 'rtl' }}>
                <AlertDialogHeader>
                  <AlertDialogTitle>האם אתה בטוחה?</AlertDialogTitle>
                  <AlertDialogDescription>
                    פעולה זו תמחק לצמיתות את המתכון ולא ניתן לשחזרו.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>ביטול</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    disabled={isDeletePending}
                    className="bg-coral text-choco hover:bg-coralDeep"
                  >
                    {isDeletePending ? 'מוחק...' : 'מחק'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {recipe.categories && (
        <div
          className="mb-3 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-fredoka text-choco ring-1 ring-white/70"
          style={{
            ...categoryTheme,
            backgroundColor: 'var(--category-accent-surface-strong)',
          }}
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: 'var(--category-accent)' }}
            aria-hidden="true"
          />
          {recipe.categories.name}
        </div>
      )}

      <h1 className="font-fredoka text-4xl md:text-5xl text-choco text-right mt-1 leading-tight">{recipe.name}</h1>
    </header>
  );
};

export default RecipeHeader;
