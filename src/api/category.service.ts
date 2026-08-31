
import type { CategoryDTO } from "../models/CategoryModel";
import type Category from "../models/CategoryModel";
import HTTPService from "./http-service";

export default class CategoryService extends HTTPService {
  private path: string;

  constructor() {
    super();
    this.path = "category";
  }

  /**
   * Obtiene la lista completa de Category sin paginación
   */
  async getCategories(): Promise<Category[]> {
    const response = await super.get<Category[]>(this.path);

    return response || [];
  }

  /**
   * Obtiene un category por su ID
   */
  async getById(id: string): Promise<Category | null> {
    const response = await super.get<Category | null>(`${this.path}/${id}`);

    return response || null;
  }

  /**
   * Crea un nuevo category
   */
  async addCategory(category: CategoryDTO): Promise<Category | null> {
    const response = await super.post<Category, CategoryDTO>(this.path, category);

    return response || null;
  }

  /**
   * Actualiza el nombre de un category
   */
  async updateCategory(id: string, category: CategoryDTO): Promise<Category | null> {
    const response = await super.put<Category, CategoryDTO>(
      `${this.path}/${id}`,
      category
    );

    return response || null;
  }

  /**
   * Elimina un category por su ID
   */
  async deleteCategory(id: string): Promise<void> {
    await super.delete(`${this.path}/${id}`);
  }
}