import React from "react";
import TransitionLink from "@/components/TransitionLink";
import DynamicIcon from "./DynamicIcon";
import { useAuth } from "@/hooks/useAuth";
import type { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCategoryBgStyle } from "@/lib/categoryColors";

interface CategoryCardsProps {
  categories: Category[];
  onEdit: (category: Category) => void;
}

const CategoryCards: React.FC<CategoryCardsProps> = ({ categories, onEdit }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-3 gap-3 w-full"
      dir="rtl"
    >
      {categories.map((cat, index) => (
        <div
          key={cat.id}
          className="relative group animate-fade-up"
          style={{ animationDelay: `${index * 70}ms` }}
        >
          <TransitionLink to={`/category/${cat.slug}`} className="no-underline block h-full">
            <div
              className="rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-2.5 h-32 card-lift cursor-pointer texture-noise ring-1 ring-white/60"
              style={getCategoryBgStyle(cat.color)}
            >
              {cat.icon && (
                <DynamicIcon
                  name={cat.icon}
                  className="w-9 h-9 text-choco/80 shrink-0"
                  strokeWidth={2}
                />
              )}
              <span className="font-fredoka text-lg text-choco leading-tight">
                {cat.name}
              </span>
            </div>
          </TransitionLink>

          {isAuthenticated && (
            <div className="absolute top-2 left-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
              <DropdownMenu dir="rtl">
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-7 w-7 p-0 rounded-full bg-white/60 hover:bg-white/90"
                    aria-label="אפשרויות"
                  >
                    <MoreVertical className="h-3.5 w-3.5 text-choco" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(cat)}>
                    <Edit className="ml-2 h-4 w-4" />
                    ערוך
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryCards;
