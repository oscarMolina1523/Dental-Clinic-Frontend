
import type InventoryLoteModel from "../models/InventoryLote";
import HTTPService from "./http-service";

export default class InventoryLoteService extends HTTPService {
  private path: string;

  constructor() {
    super();
    this.path = "inventoryLote";
  }

  /**
   * Obtiene la lista completa de lotes de inventario sin paginación
   */
  async getInventoryLotes(): Promise<InventoryLoteModel[]> {
    const response = await super.get<InventoryLoteModel[]>(this.path);

    return response || [];
  }

}