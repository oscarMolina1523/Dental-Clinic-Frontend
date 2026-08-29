import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type User from "../models/UserModel";
import type {
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
   GET USERS BY DEPARTMENT
========================================================= */

export function useUsersByDepartment() {
  return useQuery<User[], Error>({
    queryKey: ["usersByDepartment"],
    queryFn: () => userService.getUserByDepartment(),
  });
}

/* =========================================================
   CREATE USER
========================================================= */

export function useAddUser() {
  const queryClient = useQueryClient();

  return useMutation<User | null, Error, CreateUserDTO>({
    mutationKey: ["addUser"],

    mutationFn: (user) =>
      userService.addUser(user),

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

    mutationFn: ({ id, user }) =>
      userService.updateUser(id, user),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      queryClient.invalidateQueries({
        queryKey: ["userById", variables.id],
      });
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

    mutationFn: (id) =>
      userService.deleteUser(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}