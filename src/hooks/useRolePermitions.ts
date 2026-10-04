import useAuthContext from "./useAuthContext";

export const UserRole = {
    Admin: "ADMIN",
    Viewer: "VIEWER",
    Dentist: "DENTIST",
    Receptionist: "RECEPTIONIST",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const rolePermissions: Record<string, string[]> = {
    // ADMIN
    "70ef9d9c7fb961b2": [
        "/patients",
        "/agenda",
        "/prescriptions",
        "/medical-progress",
        "/treatments",
        "/treatment-plan",
        "/invoices",
        "/products",
        "/inventories",
        "/inventory-lotes",
        "/reports",
        "/users",
    ],

    // VIEWER
    "946adffd1a8d8931": [
        "/patients",
        "/agenda",
        "/prescriptions",
        "/medical-progress",
        "/treatments",
        "/treatment-plan",
        "/invoices",
        "/products",
        "/inventories",
        "/inventory-lotes",
        "/reports",
        "/users",
    ],

    // DENTIST
    "2f67c45e35ff526b": [
        "/patients",
        "/agenda",
        "/prescriptions",
        "/medical-progress",
        "/treatments",
        "/treatment-plan",
        "/inventories",
    ],

    // RECEPTIONIST
    "5e3add1ef884e4e7": [
        "/patients",
        "/agenda",
        "/invoices",
    ],
};

export const roleNames: Record<string, UserRole> = {
    "70ef9d9c7fb961b2": UserRole.Admin,
    "946adffd1a8d8931": UserRole.Viewer,
    "2f67c45e35ff526b": UserRole.Dentist,
    "5e3add1ef884e4e7": UserRole.Receptionist,
};

//para obtener el nombre en español y mostrar
export const getRoleName = (roleId?: string) => {
  switch (roleId) {
    case "70ef9d9c7fb961b2":
      return "Administrador";

    case "946adffd1a8d8931":
      return "Demo";

    case "2f67c45e35ff526b":
      return "Especialista";

    case "5e3add1ef884e4e7":
      return "Recepcionista";

    default:
      return "Usuario";
  }
};

export function useRolePermissions() {
    const { user } = useAuthContext();

    const roleId = user?.roleId || "";

    const role: UserRole | null =
        roleNames[roleId] || null;

    const permissions = role
        ? rolePermissions[roleId] || []
        : [];

    return {
        user,
        role,
        roleId,
        permissions,
    };
}