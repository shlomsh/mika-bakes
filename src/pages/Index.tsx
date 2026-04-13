import { useState } from "react";
import * as z from 'zod';

import MikaHero from "../components/MikaHero";
import CategoryCards from "../components/CategoryCards";
import RecipePicks from "../components/RecipePicks";
import SEOHead from "@/components/SEOHead";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import type { Category } from "@/types";
import CategoryForm, { categoryFormSchema } from "@/components/CategoryForm";
import { useToast } from "@/components/ui/use-toast";
import { useCategories } from "@/hooks/useCategories";
import AppHeader from "@/components/AppHeader";
import CategoryCardSkeleton from "@/components/skeletons/CategoryCardSkeleton";

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

const Index = () => {
  const { toast } = useToast();

  const { categories, isLoadingCategories, updateCategory } = useCategories();

  const [isFormOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleFormSubmit = (values: CategoryFormValues) => {
    if (editingCategory) {
      updateCategory.mutate({ values, id: editingCategory.id }, {
        onSuccess: () => {
          toast({ title: "הצלחה!", description: "הקטגוריה עודכנה בהצלחה." });
          setFormOpen(false);
          setEditingCategory(null);
        },
      });
    }
  };

  return (
    <>
      <SEOHead />
      <main
        className="min-h-screen w-full flex flex-col bg-gradient-mesh"
        style={{ direction: "rtl" }}
      >
        <AppHeader categories={categories} />

        <div className="w-full max-w-5xl mx-auto px-6 md:px-10 pb-20 flex-1 relative z-10">
          {/* Opening hero */}
          <MikaHero />

          {/* Divider */}
          <div className="divider-wavy my-10" />

          {/* Categories */}
          <section>
            <h2 className="font-fredoka text-2xl text-choco mb-5">גלו לפי קטגוריה</h2>
            {isLoadingCategories ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <CategoryCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <CategoryCards categories={categories || []} onEdit={handleEdit} />
            )}
          </section>

          {/* Picks */}
          <div className="mt-14">
            <RecipePicks />
          </div>
        </div>

        <Dialog
          open={isFormOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) setEditingCategory(null);
            setFormOpen(isOpen);
          }}
        >
          <DialogContent style={{ direction: "rtl" }}>
            <DialogHeader>
              <DialogTitle>עריכת קטגוריה</DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? `ערוך את פרטי הקטגוריה "${editingCategory.name}".`
                  : ""}
              </DialogDescription>
            </DialogHeader>
            <CategoryForm
              category={editingCategory}
              onSubmit={handleFormSubmit}
              isSubmitting={updateCategory.isPending}
            />
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
};

export default Index;
