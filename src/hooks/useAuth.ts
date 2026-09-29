import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import AuthService from "../api/auth.service";

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutResponse,
} from "../models/AuthModel";

const authService = new AuthService();

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<
    LoginResponse | null,
    Error,
    LoginRequest
  >({
    mutationKey: ["login"],

    mutationFn: (credentials) =>
      authService.login(credentials),

    onSuccess: (data) => {
      if (!data?.user || !data.token) {
        return;
      }

      localStorage.setItem(
        "authToken",
        data.token
      );

      localStorage.setItem(
        "authUser",
        JSON.stringify(data.user)
      );

      queryClient.setQueryData(
        ["authUser"],
        data.user
      );
    },
  });
}

export function useRegister() {
  return useMutation<
    RegisterResponse | null,
    Error,
    RegisterRequest
  >({
    mutationKey: ["register"],

    mutationFn: (user) =>
      authService.register(user),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<
    LogoutResponse | null,
    Error,
    void
  >({
    mutationKey: ["logout"],

    mutationFn: () =>
      authService.logout(),

    onSuccess: () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");

      queryClient.clear();
    },
  });
}