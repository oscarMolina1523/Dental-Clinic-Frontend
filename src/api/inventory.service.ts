import type Inventory from "../models/InventoryModel";
import type {
  CreateInventoryDTO,
  UpdateInventoryDTO,
} from "../models/InventoryModel";
import HTTPService from "./http-service";

export default class InventoryService extends HTTPService {
  private path: string;

  constructor() {
    super();
    this.path = "inventory";
  }

  /**
   * Obtiene la lista de inventarios
   */
  async getInventories(): Promise<Inventory[]> {
    const response = await super.get<Inventory[]>(this.path);

    return response || [];
  }

  /**
   * Obtiene un inventario por su ID
   */
  async getById(id: string): Promise<Inventory | null> {
    const response = await super.get<Inventory | null>(
      `${this.path}/${id}`
    );

    return response || null;
  }

  /**
   * Obtiene el inventario asociado a un producto.
   *
   * Nota:
   * Actualmente esta operación existe en el backend/service,
   * pero no está expuesta en el router ais que si necesitaramos usarlo hay que exponerla en ruta de backend.
   */
//   async getByProduct(productId: string): Promise<Inventory | null> {
//     const response = await super.get<Inventory | null>(
//       `${this.path}/product/${productId}`
//     );

//     return response || null;
//   }

  /**
   * Crea un nuevo inventario
   */
  async addInventory(
    inventory: CreateInventoryDTO
  ): Promise<Inventory | null> {
    const response = await super.post<
      Inventory,
      CreateInventoryDTO
    >(this.path, inventory);

    return response || null;
  }

  /**
   * Actualiza el stock mínimo del inventario
   */
  async updateInventory(
    id: string,
    inventory: UpdateInventoryDTO
  ): Promise<Inventory | null> {
    const response = await super.put<
      Inventory,
      UpdateInventoryDTO
    >(`${this.path}/${id}`, inventory);

    return response || null;
  }

  /**
   * Elimina un inventario
   */
  async deleteInventory(id: string): Promise<void> {
    await super.delete(`${this.path}/${id}`);
  }

  /**
   * Incrementa el stock actual
   */
  async increaseStock(
    id: string,
    quantity: number
  ): Promise<Inventory | null> {
    const response = await super.post<
      Inventory,
      { quantity: number }
    >(`${this.path}/${id}/increase`, {
      quantity,
    });

    return response || null;
  }

  /**
   * Disminuye el stock actual
   */
  async decreaseStock(
    id: string,
    quantity: number
  ): Promise<Inventory | null> {
    const response = await super.post<
      Inventory,
      { quantity: number }
    >(`${this.path}/${id}/decrease`, {
      quantity,
    });

    return response || null;
  }
}