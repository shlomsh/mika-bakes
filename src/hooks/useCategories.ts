import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/apiClient";
import type { Category } from "@/types";
import * as z from 'zod';
import { categoryFormSchema } from "@/components/CategoryForm";

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

const fetchCategories = async (): Promise<Category[]> => {
  return apiFetch<Category[]>('/api/categories');
};

export const useCategories = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { getToken } = useAuth();

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const updateMutation = useMutation<void, Error, { values: CategoryFormValues, id: string }>({
    mutationFn: async ({ values, id }) => {
      await apiFetch(`/api/categories/${id}`, {
        method: 'PUT',
        getToken,
        body: JSON.stringify({
          name: values.name,
          slug: values.slug,
          description: values.description ?? null,
          color: values.color ?? null,
          icon: values.icon ?? null,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "שגיאה", description: `עדכון הקטגוריה נכשל: ${err.message}` });
    },
  });

  return {
    categories,
    isLoadingCategories,
    updateCategory: updateMutation,
  };
};
