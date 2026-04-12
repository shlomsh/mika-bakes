
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

interface CategoryCardsProps {
  categories: Category[];
  onEdit: (category: Category) => void;
}

const CategoryCards: React.FC<CategoryCardsProps> = ({ categories, onEdit }) => {
  const { isAuthenticated } = useAuth();

  return (
    <aside className="flex flex-col gap-4 w-full" dir="rtl">
      {categories.map((cat, index) => (
        <div key={cat.id} className="relative group animate-fade-up" style={{ animationDelay: `${index * 60}ms` }}>
          <TransitionLink to={`/category/${cat.slug}`} className="no-underline">
            <div
              className={`rounded-2xl shadow-lg p-4 flex items-center gap-4 ${cat.color || 'bg-gray-200'} relative card-lift cursor-pointer texture-noise ring-1 ring-white/60`}
              dir="rtl"
            >
              {cat.icon && (
                <div className="bg-white/30 rounded-xl p-1.5 shrink-0 transition-transform duration-300 group-hover:scale-105">
                  <DynamicIcon name={cat.icon} className="w-10 h-10 text-choco opacity-85" strokeWidth={2} />
                </div>
              )}
              <div className="flex-grow">
                <span className="font-fredoka text-xl text-choco tracking-wide transition-transform duration-300 group-hover:-translate-y-0.5 inline-block">{cat.name}</span>
                {cat.description && <p className="mt-1 text-choco/75 text-sm leading-tight">{cat.description}</p>}
              </div>
            </div>
          </TransitionLink>
          {isAuthenticated && (
            <div className="absolute top-2 left-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
              <DropdownMenu dir="rtl">
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-full bg-white/50 hover:bg-white/80">
                    <MoreVertical className="h-4 w-4 text-choco" />
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
    </aside>
  );
};

export default CategoryCards;
