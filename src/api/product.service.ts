import type { ProductDTO } from "../models/ProductModel";
import type ProductModel from "../models/ProductModel";
import HTTPService from "./http-service";

export default class ProductService extends HTTPService {
  private path: string;

  constructor() {
    super();
    this.path = "product";
  }

  /**
   * Obtiene los productos paginados
   */
  async getProducts(
    page: number = 1,
    pageSize: number = 100
  ): Promise<ProductModel[]> {
    const response = await super.get<ProductModel[]>(
      `${this.path}?page=${page}&pageSize=${pageSize}`
    );

    return response || [];
  }

  /**
   * Obtiene un producto por su ID
   */
  async getById(id: string): Promise<ProductModel | null> {
    const response = await super.get<ProductModel | null>(
      `${this.path}/${id}`
    );

    return response || null;
  }

  /**
   * Crea un nuevo producto
   */
  async addProduct(
    product: ProductDTO
  ): Promise<ProductModel | null> {
    const response = await super.post<
      ProductModel,
      ProductDTO
    >(this.path, product);

    return response || null;
  }

  /**
   * Actualiza un producto
   */
  async updateProduct(
    id: string,
    product: ProductDTO
  ): Promise<ProductModel | null> {
    const response = await super.put<
      ProductModel,
      ProductDTO
    >(`${this.path}/${id}`, product);

    return response || null;
  }

  /**
   * Elimina un producto por su ID
   */
  async deleteProduct(id: string): Promise<void> {
    await super.delete(`${this.path}/${id}`);
  }
}