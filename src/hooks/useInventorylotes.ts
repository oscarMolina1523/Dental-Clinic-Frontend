import {
  useQuery
} from "@tanstack/react-query";
import InventoryLoteModel from "../models/InventoryLote";
import InventoryLoteService from "../api/inventoryLote.service";

const inventoryLoteService = new InventoryLoteService();

/* =========================================================
   GET INVENTORY LOTES
========================================================= */

export function useInventoryLotes() {
  return useQuery<InventoryLoteModel[], Error>({
    queryKey: ["inventoryLotes"],
    queryFn: () => inventoryLoteService.getInventoryLotes(),
  });
}
