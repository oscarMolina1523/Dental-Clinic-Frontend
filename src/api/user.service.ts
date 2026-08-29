
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

  //solo modifica el name, imagen, phone number y membership
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

  async changeEmail(id: string, email: string): Promise<User | null> {
    const response = await super.put<User, { email: string }>(
      `${this.path}/${id}/email`,
      { email }
    );
    return response || null;
  }

  async changePhoneNumber(id: string, phoneNumber: string): Promise<User | null> {
    const response = await super.put<User, { phoneNumber: string }>(
      `${this.path}/${id}/phone`,
      { phoneNumber }
    );
    return response || null;
  }

  async changePassword(
    id: string, 
    currentPassword: string, 
    newPassword: string
  ): Promise<{ message: string } | null> {
    const response = await super.put<{ message: string }, { currentPassword: string; newPassword: string }>(
      `${this.path}/${id}/password`,
      { currentPassword, newPassword }
    );
    return response || null;
  }

  async changeRole(id: string, roleId: string | number): Promise<User | null> {
    const response = await super.put<User, { roleId: string | number }>(
      `${this.path}/${id}/role`,
      { roleId }
    );
    return response || null;
  }

  async activateUser(id: string): Promise<User | null> {
    const response = await super.post<User, undefined>(
      `${this.path}/${id}/activate`,
      undefined
    );
    return response || null;
  }

  async deactivateUser(id: string): Promise<User | null> {
    const response = await super.post<User, undefined>(
      `${this.path}/${id}/deactivate`,
      undefined
    );
    return response || null;
  }
}