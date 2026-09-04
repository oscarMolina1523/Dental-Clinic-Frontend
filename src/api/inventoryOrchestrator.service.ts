import type {
  CreateInventoryOrchestratorRequest,
  UpdateAmountInventoryOrchestratorRequest,
  ExpireInventoryOrchestratorLoteRequest,
  InventoryOrchestratorResponse,
} from "../models/InventoryOrchestratorModel";

import HTTPService from "./http-service";

export default class InventoryOrchestratorService extends HTTPService {
  private path: string;

  constructor() {
    super();
    this.path = "inventoryOrchestrator";
  }

  /**
   * Crea un nuevo lote.
   *
   * Internamente el backend:
   * - crea el lote
   * - aumenta el inventario general
   * - registra el movimiento de entrada
   */
  async createLote(
    data: CreateInventoryOrchestratorRequest
  ): Promise<InventoryOrchestratorResponse | null> {
    const response = await super.post<
      InventoryOrchestratorResponse,
      CreateInventoryOrchestratorRequest
    >(`${this.path}/lotes`, data);

    return response || null;
  }

  /**
   * Aumenta la existencia de un lote.
   *
   * Internamente el backend:
   * - aumenta el lote
   * - aumenta el inventario general
   * - registra el movimiento de entrada
   */
  async increaseLoteStock(
    loteId: string,
    data: UpdateAmountInventoryOrchestratorRequest
  ): Promise<InventoryOrchestratorResponse | null> {
    const response = await super.post<
      InventoryOrchestratorResponse,
      UpdateAmountInventoryOrchestratorRequest
    >(`${this.path}/lotes/${loteId}/increase`, data);

    return response || null;
  }

  /**
   * Disminuye la existencia de un lote.
   *
   * Internamente el backend:
   * - disminuye el lote
   * - disminuye el inventario general
   * - registra el movimiento de salida
   */
  async decreaseLoteStock(
    loteId: string,
    data: UpdateAmountInventoryOrchestratorRequest
  ): Promise<InventoryOrchestratorResponse | null> {
    const response = await super.post<
      InventoryOrchestratorResponse,
      UpdateAmountInventoryOrchestratorRequest
    >(`${this.path}/lotes/${loteId}/decrease`, data);

    return response || null;
  }

  /**
   * Retira la existencia de un lote vencido.
   *
   * Internamente el backend:
   * - valida que el lote esté vencido
   * - retira toda la existencia del lote
   * - disminuye el inventario general
   * - registra el movimiento como EXPIRED
   */
  async expireLote(
    loteId: string,
    data: ExpireInventoryOrchestratorLoteRequest
  ): Promise<InventoryOrchestratorResponse | null> {
    const response = await super.post<
      InventoryOrchestratorResponse,
      ExpireInventoryOrchestratorLoteRequest
    >(`${this.path}/lotes/${loteId}/expire`, data);

    return response || null;
  }
}