import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import CategoryService from "../api/category.service";
import type Category from "../models/CategoryModel";
import type { CategoryDTO } from "../models/CategoryModel";

const categoryService = new CategoryService();

/* =========================================================
   GET CATEGORIES
========================================================= */

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
  });
}

/* =========================================================
   GET Category BY ID
========================================================= */

export function useCategoryById(id: string) {
  return useQuery<Category | null, Error>({
    queryKey: ["categoryById", id],
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
  });
}

/* =========================================================
   CREATE Category
========================================================= */

export function useAddCategory() {
  const queryClient = useQueryClient();

  return useMutation<Category | null, Error, CategoryDTO>({
    mutationKey: ["addCategory"],

    mutationFn: (category) => categoryService.addCategory(category),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
}

/* =========================================================
   UPDATE Category
========================================================= */

export interface UpdateCategoryVariables {
  id: string;
  category: CategoryDTO;
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation<Category | null, Error, UpdateCategoryVariables>({
    mutationKey: ["updateCategory"],

    mutationFn: ({ id, category }) => categoryService.updateCategory(id, category),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categoryById", variables.id] });
    },
  });
}

/* =========================================================
   DELETE Category
========================================================= */

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationKey: ["deleteCategory"],

    mutationFn: (id) => categoryService.deleteCategory(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
}