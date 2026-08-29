import type Role from "../models/RoleModel";
import type { CreateRoleDTO, UpdateRoleDTO } from "../models/RoleModel";
import HTTPService from "./http-service";

export default class RoleService extends HTTPService {
  private path: string;

  constructor() {
    super();
    this.path = "role";
  }

  /**
   * Obtiene la lista completa de roles sin paginación
   */
  async getRoles(): Promise<Role[]> {
    const response = await super.get<Role[]>(this.path);

    return response || [];
  }

  /**
   * Obtiene un rol por su ID
   */
  async getById(id: string): Promise<Role | null> {
    const response = await super.get<Role | null>(`${this.path}/${id}`);

    return response || null;
  }

  /**
   * Crea un nuevo rol
   */
  async addRole(role: CreateRoleDTO): Promise<Role | null> {
    const response = await super.post<Role, CreateRoleDTO>(this.path, role);

    return response || null;
  }

  /**
   * Actualiza el nombre y/o descripción de un rol
   */
  async updateRole(id: string, role: UpdateRoleDTO): Promise<Role | null> {
    const response = await super.put<Role, UpdateRoleDTO>(
      `${this.path}/${id}`,
      role
    );

    return response || null;
  }

  /**
   * Elimina un rol por su ID
   */
  async deleteRole(id: string): Promise<void> {
    await super.delete(`${this.path}/${id}`);
  }
}