import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { CreateRoleDTO, UpdateRoleDTO } from "../models/RoleModel";
import RoleService from "../api/role.service";
import type Role from "../models/RoleModel";

const roleService = new RoleService();

/* =========================================================
   GET ROLES
========================================================= */

export function useRoles() {
  return useQuery<Role[], Error>({
    queryKey: ["roles"],
    queryFn: () => roleService.getRoles(),
  });
}

/* =========================================================
   GET ROLE BY ID
========================================================= */

export function useRoleById(id: string) {
  return useQuery<Role | null, Error>({
    queryKey: ["roleById", id],
    queryFn: () => roleService.getById(id),
    enabled: !!id,
  });
}

/* =========================================================
   CREATE ROLE
========================================================= */

export function useAddRole() {
  const queryClient = useQueryClient();

  return useMutation<Role | null, Error, CreateRoleDTO>({
    mutationKey: ["addRole"],

    mutationFn: (role) => roleService.addRole(role),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },
  });
}

/* =========================================================
   UPDATE ROLE
========================================================= */

export interface UpdateRoleVariables {
  id: string;
  role: UpdateRoleDTO;
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation<Role | null, Error, UpdateRoleVariables>({
    mutationKey: ["updateRole"],

    mutationFn: ({ id, role }) => roleService.updateRole(id, role),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roleById", variables.id] });
    },
  });
}

/* =========================================================
   DELETE ROLE
========================================================= */

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationKey: ["deleteRole"],

    mutationFn: (id) => roleService.deleteRole(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },
  });
}