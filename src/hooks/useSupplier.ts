import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import SupplierService from "../api/supplier.service";
import type SupplierModel from "../models/SupplierModel";
import type { SupplierDTO } from "../models/SupplierModel";

const supplierService = new SupplierService();

/* =========================================================
   GET SUPPLIERS
========================================================= */

export function useSuppliers() {
  return useQuery<SupplierModel[], Error>({
    queryKey: ["suppliers"],
    queryFn: () => supplierService.getSuppliers(),
  });
}

/* =========================================================
   GET SUPPLIER BY ID
========================================================= */

export function useSupplierById(id: string) {
  return useQuery<SupplierModel | null, Error>({
    queryKey: ["supplierById", id],
    queryFn: () => supplierService.getById(id),
    enabled: !!id,
  });
}

/* =========================================================
   CREATE SUPPLIER
========================================================= */

export function useAddSupplier() {
  const queryClient = useQueryClient();

  return useMutation<SupplierModel | null, Error, SupplierDTO>({
    mutationKey: ["addSupplier"],

    mutationFn: (supplier) => supplierService.addSupplier(supplier),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });
    },
  });
}

/* =========================================================
   UPDATE SUPPLIER
========================================================= */

export interface UpdateSupplierVariables {
  id: string;
  supplier: SupplierDTO;
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation<SupplierModel | null, Error, UpdateSupplierVariables>({
    mutationKey: ["updateSupplier"],

    mutationFn: ({ id, supplier }) => supplierService.updateSupplier(id, supplier),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["supplierById", variables.id] });
    },
  });
}

/* =========================================================
   DELETE SUPPLIER
========================================================= */

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationKey: ["deleteSupplier"],

    mutationFn: (id) => supplierService.deleteSupplier(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });
    },
  });
}