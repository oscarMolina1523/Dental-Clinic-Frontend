import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type Inventory from "../models/InventoryModel";
import type {
  CreateInventoryDTO,
  UpdateInventoryDTO,
} from "../models/InventoryModel";

import InventoryService from "../api/inventory.service";

const inventoryService = new InventoryService();

/* =========================================================
   GET INVENTORIES
========================================================= */

export function useInventories() {
  return useQuery<Inventory[], Error>({
    queryKey: ["inventories"],
    queryFn: () => inventoryService.getInventories(),
  });
}

/* =========================================================
   GET INVENTORY BY ID
========================================================= */

export function useInventoryById(id: string) {
  return useQuery<Inventory | null, Error>({
    queryKey: ["inventoryById", id],
    queryFn: () => inventoryService.getById(id),
    enabled: !!id,
  });
}

/* =========================================================
   CREATE INVENTORY
========================================================= */

export function useAddInventory() {
  const queryClient = useQueryClient();

  return useMutation<Inventory | null, Error, CreateInventoryDTO>({
    mutationKey: ["addInventory"],

    mutationFn: (inventory) =>
      inventoryService.addInventory(inventory),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventories"],
      });
    },
  });
}

/* =========================================================
   UPDATE INVENTORY
========================================================= */

export interface UpdateInventoryVariables {
  id: string;
  inventory: UpdateInventoryDTO;
}

export function useUpdateInventory() {
  const queryClient = useQueryClient();

  return useMutation<
    Inventory | null,
    Error,
    UpdateInventoryVariables
  >({
    mutationKey: ["updateInventory"],

    mutationFn: ({ id, inventory }) =>
      inventoryService.updateInventory(id, inventory),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["inventories"],
      });

      queryClient.invalidateQueries({
        queryKey: ["inventoryById", variables.id],
      });
    },
  });
}

/* =========================================================
   DELETE INVENTORY
========================================================= */

export function useDeleteInventory() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationKey: ["deleteInventory"],

    mutationFn: (id) =>
      inventoryService.deleteInventory(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventories"],
      });
    },
  });
}

/* =========================================================
   INCREASE STOCK
========================================================= */

export interface ChangeStockVariables {
  id: string;
  quantity: number;
}

export function useIncreaseStock() {
  const queryClient = useQueryClient();

  return useMutation<
    Inventory | null,
    Error,
    ChangeStockVariables
  >({
    mutationKey: ["increaseStock"],

    mutationFn: ({ id, quantity }) =>
      inventoryService.increaseStock(id, quantity),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["inventories"],
      });

      queryClient.invalidateQueries({
        queryKey: ["inventoryById", variables.id],
      });
    },
  });
}

/* =========================================================
   DECREASE STOCK
========================================================= */

export function useDecreaseStock() {
  const queryClient = useQueryClient();

  return useMutation<
    Inventory | null,
    Error,
    ChangeStockVariables
  >({
    mutationKey: ["decreaseStock"],

    mutationFn: ({ id, quantity }) =>
      inventoryService.decreaseStock(id, quantity),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["inventories"],
      });

      queryClient.invalidateQueries({
        queryKey: ["inventoryById", variables.id],
      });
    },
  });
}