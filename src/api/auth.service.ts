import HTTPService from "./http-service";

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutResponse,
} from "../models/AuthModel";

export default class AuthService extends HTTPService {
  private path: string;

  constructor() {
    super();
    this.path = "auth";
  }

  async login(
    credentials: LoginRequest
  ): Promise<LoginResponse | null> {
    const response = await super.post<
      LoginResponse,
      LoginRequest
    >(
      `${this.path}/login`,
      credentials
    );

    return response || null;
  }

  async register(
    user: RegisterRequest
  ): Promise<RegisterResponse | null> {
    const response = await super.post<
      RegisterResponse,
      RegisterRequest
    >(
      `${this.path}/register`,
      user
    );

    return response || null;
  }

  async logout(): Promise<LogoutResponse | null> {
    const response = await super.post<
      LogoutResponse,
      undefined
    >(
      `${this.path}/logout`,
      undefined
    );

    return response || null;
  }
}