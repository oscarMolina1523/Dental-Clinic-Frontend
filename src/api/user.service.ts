
import type { CreateUserDTO, UpdateUserDTO } from "../models/UserModel";
import type User from "../models/UserModel";
import HTTPService from "./http-service";

export default class UserService extends HTTPService {
  private path: string;

  constructor() {
    super();
    this.path = "user";
  }

  async getUsers(): Promise<User[]> {
    const response = await super.get<User[]>(this.path);

    return response || [];
  }

  async getById(id: string): Promise<User | null> {
    const response = await super.get<User | null>(
      `${this.path}/${id}`
    );

    return response || null;
  }

  async getUserByDepartment(): Promise<User[]> {
    const response = await super.get<User[]>(
      `${this.path}/area`
    );

    return response || [];
  }

  async addUser(
    user: CreateUserDTO
  ): Promise<User | null> {
    const response = await super.post<
      User,
      CreateUserDTO
    >(
      this.path,
      user
    );

    return response || null;
  }

  async updateUser(
    id: string,
    user: UpdateUserDTO
  ): Promise<User | null> {
    const response = await super.put<
      User,
      UpdateUserDTO
    >(
      `${this.path}/${id}`,
      user
    );

    return response || null;
  }

  async deleteUser(id: string): Promise<void> {
    await super.delete(`${this.path}/${id}`);
  }
}