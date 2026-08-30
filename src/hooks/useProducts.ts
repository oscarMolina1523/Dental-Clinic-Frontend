import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { ProductDTO } from "../models/ProductModel";
import type ProductModel from "../models/ProductModel";
import ProductService from "../api/product.service";

const productService = new ProductService();

/* =========================================================
   GET PRODUCTS
========================================================= */

export function useProducts(
  page: number = 1,
  pageSize: number = 100
) {
  return useQuery<ProductModel[], Error>({
    queryKey: ["products", page, pageSize],

    queryFn: () => productService.getProducts(page, pageSize),
  });
}

/* =========================================================
   GET PRODUCT BY ID
========================================================= */

export function useProductById(id: string) {
  return useQuery<ProductModel | null, Error>({
    queryKey: ["productById", id],

    queryFn: () => productService.getById(id),

    enabled: !!id,
  });
}

/* =========================================================
   CREATE PRODUCT
========================================================= */

export function useAddProduct() {
  const queryClient = useQueryClient();

  return useMutation<ProductModel | null, Error, ProductDTO>({
    mutationKey: ["addProduct"],

    mutationFn: (product) =>
      productService.addProduct(product),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}

/* =========================================================
   UPDATE PRODUCT
========================================================= */

export interface UpdateProductVariables {
  id: string;
  product: ProductDTO;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation<
    ProductModel | null,
    Error,
    UpdateProductVariables
  >({
    mutationKey: ["updateProduct"],

    mutationFn: ({ id, product }) =>
      productService.updateProduct(id, product),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["productById", variables.id],
      });
    },
  });
}

/* =========================================================
   DELETE PRODUCT
========================================================= */

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationKey: ["deleteProduct"],

    mutationFn: (id) =>
      productService.deleteProduct(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}