import type { SupplierDTO } from "../models/SupplierModel";
import type SupplierModel from "../models/SupplierModel";
import HTTPService from "./http-service";

export default class SupplierService extends HTTPService {
  private path: string;

  constructor() {
    super();
    this.path = "supplier";
  }

  /**
   * Obtiene la lista completa de proveedores sin paginación
   */
  async getSuppliers(): Promise<SupplierModel[]> {
    const response = await super.get<SupplierModel[]>(this.path);

    return response || [];
  }

  /**
   * Obtiene un proveedor por su ID
   */
  async getById(id: string): Promise<SupplierModel | null> {
    const response = await super.get<SupplierModel | null>(`${this.path}/${id}`);

    return response || null;
  }

  /**
   * Crea un nuevo proveedor
   */
  async addSupplier(supplier: SupplierDTO): Promise<SupplierModel | null> {
    const response = await super.post<SupplierModel, SupplierDTO>(this.path, supplier);

    return response || null;
  }

  /**
   * Actualiza el nombre y/o descripción de un proveedor
   */
  async updateSupplier(id: string, supplier: SupplierDTO): Promise<SupplierModel | null> {
    const response = await super.put<SupplierModel, SupplierDTO>(
      `${this.path}/${id}`,
      supplier
    );

    return response || null;
  }

  /**
   * Elimina un proveedor por su ID
   */
  async deleteSupplier(id: string): Promise<void> {
    await super.delete(`${this.path}/${id}`);
  }
}