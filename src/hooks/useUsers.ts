import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type User from "../models/UserModel";
import type {
    ChangeEmailVariables,
    ChangePasswordVariables,
    ChangePhoneNumberVariables,
    ChangeRoleVariables,
  CreateUserDTO,
  UpdateUserDTO,
} from "../models/UserModel";

import UserService from "../api/user.service";

const userService = new UserService();

/* =========================================================
   GET USERS
========================================================= */

export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
  });
}

/* =========================================================
   GET USER BY ID
========================================================= */

export function useUserById(id: string) {
  return useQuery<User | null, Error>({
    queryKey: ["userById", id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
}

/* =========================================================
   CREATE USER
========================================================= */

export function useAddUser() {
  const queryClient = useQueryClient();

  return useMutation<User | null, Error, CreateUserDTO>({
    mutationKey: ["addUser"],

    mutationFn: (user) => userService.addUser(user),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}

/* =========================================================
   UPDATE USER
========================================================= */

export interface UpdateUserVariables {
  id: string;
  user: UpdateUserDTO;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<User | null, Error, UpdateUserVariables>({
    mutationKey: ["updateUser"],

    mutationFn: ({ id, user }) => userService.updateUser(id, user),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userById", variables.id] });
    },
  });
}

/* =========================================================
   DELETE USER
========================================================= */

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationKey: ["deleteUser"],

    mutationFn: (id) => userService.deleteUser(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}

/* =========================================================
   CHANGE EMAIL
========================================================= */

export function useChangeEmail() {
  const queryClient = useQueryClient();

  return useMutation<User | null, Error, ChangeEmailVariables>({
    mutationKey: ["changeEmail"],

    mutationFn: ({ id, email }) => userService.changeEmail(id, email),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userById", variables.id] });
    },
  });
}

/* =========================================================
   CHANGE PHONE NUMBER
========================================================= */

export function useChangePhoneNumber() {
  const queryClient = useQueryClient();

  return useMutation<User | null, Error, ChangePhoneNumberVariables>({
    mutationKey: ["changePhoneNumber"],

    mutationFn: ({ id, phoneNumber }) =>
      userService.changePhoneNumber(id, phoneNumber),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userById", variables.id] });
    },
  });
}

/* =========================================================
   CHANGE PASSWORD
========================================================= */

export function useChangePassword() {
  return useMutation<{ message: string } | null, Error, ChangePasswordVariables>({
    mutationKey: ["changePassword"],

    mutationFn: ({ id, currentPassword, newPassword }) =>
      userService.changePassword(id, currentPassword, newPassword),
  });
}

/* =========================================================
   CHANGE ROLE
========================================================= */

export function useChangeRole() {
  const queryClient = useQueryClient();

  return useMutation<User | null, Error, ChangeRoleVariables>({
    mutationKey: ["changeRole"],

    mutationFn: ({ id, roleId }) => userService.changeRole(id, roleId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userById", variables.id] });
    },
  });
}

/* =========================================================
   ACTIVATE USER
========================================================= */

export function useActivateUser() {
  const queryClient = useQueryClient();

  return useMutation<User | null, Error, string>({
    mutationKey: ["activateUser"],

    mutationFn: (id) => userService.activateUser(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userById", id] });
    },
  });
}

/* =========================================================
   DEACTIVATE USER
========================================================= */

export function useDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation<User | null, Error, string>({
    mutationKey: ["deactivateUser"],

    mutationFn: (id) => userService.deactivateUser(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userById", id] });
    },
  });
}