import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import InventoryOrchestratorService from "../api/inventoryOrchestrator.service";

import type {
  CreateInventoryOrchestratorRequest,
  UpdateAmountInventoryOrchestratorRequest,
  ExpireInventoryOrchestratorLoteRequest,
  InventoryOrchestratorResponse,
} from "../models/InventoryOrchestratorModel";

const inventoryOrchestratorService =
  new InventoryOrchestratorService();

/* =========================================================
   CREATE LOT
========================================================= */

export function useCreateInventoryLote() {
  const queryClient = useQueryClient();

  return useMutation<
    InventoryOrchestratorResponse | null,
    Error,
    CreateInventoryOrchestratorRequest
  >({
    mutationKey: ["createInventoryLote"],

    mutationFn: (data) =>
      inventoryOrchestratorService.createLote(data),

    onSuccess: () => {
      // El lote cambió
      queryClient.invalidateQueries({
        queryKey: ["inventoryLotes"],
      });

      // El inventario general cambió
      queryClient.invalidateQueries({
        queryKey: ["inventories"],
      });

      // Se creó un movimiento
      queryClient.invalidateQueries({
        queryKey: ["inventoryMovements"],
      });
    },
  });
}

/* =========================================================
   INCREASE LOT STOCK
========================================================= */

export interface IncreaseInventoryLoteVariables {
  id: string;
  data: UpdateAmountInventoryOrchestratorRequest;
}

export function useIncreaseInventoryLoteStock() {
  const queryClient = useQueryClient();

  return useMutation<
    InventoryOrchestratorResponse | null,
    Error,
    IncreaseInventoryLoteVariables
  >({
    mutationKey: ["increaseInventoryLoteStock"],

    mutationFn: ({ id, data }) =>
      inventoryOrchestratorService.increaseLoteStock(
        id,
        data
      ),

    onSuccess: (_, variables) => {
      // Actualizar lista de lotes
      queryClient.invalidateQueries({
        queryKey: ["inventoryLotes"],
      });

      // Actualizar lote específico
      queryClient.invalidateQueries({
        queryKey: ["inventoryLoteById", variables.id],
      });

      // Actualizar inventario general
      queryClient.invalidateQueries({
        queryKey: ["inventories"],
      });

      // Actualizar movimientos
      queryClient.invalidateQueries({
        queryKey: ["inventoryMovements"],
      });
    },
  });
}

/* =========================================================
   DECREASE LOT STOCK
========================================================= */

export interface DecreaseInventoryLoteVariables {
  id: string;
  data: UpdateAmountInventoryOrchestratorRequest;
}

export function useDecreaseInventoryLoteStock() {
  const queryClient = useQueryClient();

  return useMutation<
    InventoryOrchestratorResponse | null,
    Error,
    DecreaseInventoryLoteVariables
  >({
    mutationKey: ["decreaseInventoryLoteStock"],

    mutationFn: ({ id, data }) =>
      inventoryOrchestratorService.decreaseLoteStock(
        id,
        data
      ),

    onSuccess: (_, variables) => {
      // Actualizar lista de lotes
      queryClient.invalidateQueries({
        queryKey: ["inventoryLotes"],
      });

      // Actualizar lote específico
      queryClient.invalidateQueries({
        queryKey: ["inventoryLoteById", variables.id],
      });

      // Actualizar inventario general
      queryClient.invalidateQueries({
        queryKey: ["inventories"],
      });

      // Actualizar movimientos
      queryClient.invalidateQueries({
        queryKey: ["inventoryMovements"],
      });
    },
  });
}

/* =========================================================
   EXPIRE LOT
========================================================= */

export interface ExpireInventoryLoteVariables {
  id: string;
  data: ExpireInventoryOrchestratorLoteRequest;
}

export function useExpireInventoryLote() {
  const queryClient = useQueryClient();

  return useMutation<
    InventoryOrchestratorResponse | null,
    Error,
    ExpireInventoryLoteVariables
  >({
    mutationKey: ["expireInventoryLote"],

    mutationFn: ({ id, data }) =>
      inventoryOrchestratorService.expireLote(
        id,
        data
      ),

    onSuccess: (_, variables) => {
      // Actualizar lista de lotes
      queryClient.invalidateQueries({
        queryKey: ["inventoryLotes"],
      });

      // Actualizar lote específico
      queryClient.invalidateQueries({
        queryKey: ["inventoryLoteById", variables.id],
      });

      // Actualizar inventario general
      queryClient.invalidateQueries({
        queryKey: ["inventories"],
      });

      // Actualizar movimientos
      queryClient.invalidateQueries({
        queryKey: ["inventoryMovements"],
      });
    },
  });
}