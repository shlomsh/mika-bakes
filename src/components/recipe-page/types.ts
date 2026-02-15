// Local type aliases used by recipe-page components.
// The canonical RecipeWithDetails is in src/types/index.ts.
export type { RecipeWithDetails } from '@/types';

export interface Ingredient {
  description: string;
  sort_order: number;
}

export interface Instruction {
  description: string;
  step_number: number;
}

export interface Sauce {
  description: string;
  step_number: number;
}

export interface SauceIngredient {
  description: string;
  sort_order: number;
}

export interface GarnishIngredient {
  description: string;
  sort_order: number;
}

export interface GarnishInstruction {
  description: string;
  step_number: number;
}
