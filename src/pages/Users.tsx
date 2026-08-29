import React, { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, KeyRound } from "lucide-react";
import type UserModel from "../models/UserModel";
import type { TableAction, TableColumn } from "../shared/Table/types";
import DataTable from "../shared/Table/DataTable";
import Pagination from "../shared/Table/Pagination";
import { useTableSearch } from "../shared/Table/useTableSearch";
import SearchInput from "../shared/Table/SearchInput";
import CreateUserDrawer from "../components/user/CreateUserDrawer";
import { useDeleteUser, useUsers } from "../hooks/useUsers";
import EditUserDrawer from "../components/user/EditUserDrawer";
import SecurityUserDrawer from "../components/user/SecurityUserDrawer";
import { useRoles } from "../hooks/useRoles";
import ConfirmModal from "../shared/ConfirmModal";

const UsersPage: React.FC = () => {
  const {
    data: users = [],
  } = useUsers();

  const {
    mutate: deleteUser,
    isPending: isDeleting
  } = useDeleteUser();

  const { data: roles = [] } = useRoles();

  const [isCreateDrawerOpen, setIsCreateDrawerOpen] =
    useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] =
    useState(false);
  const [isSecurityDrawerOpen, setIsSecurityDrawerOpen] =
    useState(false);
  // Estado para controlar el modal de eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const searchFields: (keyof UserModel)[] = [
    "fullName",
    "email",
    "phoneNumber",
    "active",
    "roleId",
  ];

  const {
    search,
    setSearch,
    filteredData,
  } = useTableSearch<UserModel>({
    data: users,
    fields: searchFields,
    delay: 800,
  });


  const totalItems = filteredData.length; //obtenemos la cantidad total de items 

  // Calculamos el total de páginas disponibles y obtenemos una página válida,
  // evitando que currentPage apunte a una página que ya no existe, por ejemplo,
  // después de eliminar el último usuario de la página actual.
  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / ITEMS_PER_PAGE)
  );

  const validPage = Math.min(
    currentPage,
    totalPages
  );

  //para obtener solo los usuarios que queremos por pagina, los visibles
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;

  const endIndex = startIndex + ITEMS_PER_PAGE;

  const currentUsers = useMemo(
    () =>
      filteredData.slice(
        startIndex,
        endIndex
      ),
    [startIndex, endIndex, filteredData]
  );

  //Creamos un mapa/diccionario optimizado para búsqueda rápida (O(1))
  const roleMap = useMemo(() => {
    return new Map(roles.map((role) => [role.id, role.name]));
  }, [roles]);

  const columns: TableColumn<typeof users[number]>[] = [
    {
      key: "name",
      header: "Nombre",
      className: "pl-2 w-100",
      render: (user: UserModel) => (
        <div className="flex items-center gap-3">

          <img
            src={user.image}
            alt={user.fullName}
            className="w-9 h-9 rounded-full object-cover border border-slate-200"
          />

          <span className="text-sm font-semibold text-slate-800">
            {user.fullName}
          </span>

        </div>
      ),
    },

    {
      key: "phone",
      header: "Teléfono",
      render: (user: UserModel) => (
        <span className="text-sm text-slate-500">
          {user.phoneNumber}
        </span>
      ),
    },

    {
      key: "email",
      header: "Email",
      render: (user: UserModel) => (
        <span className="text-sm text-slate-500">
          {user.email}
        </span>
      ),
    },
    {
      key: "roleId",
      header: "Role",
      render: (user: UserModel) => (
        <span className="text-sm text-slate-500">
          {roleMap.get(user.roleId) ?? "Cargando..."}
        </span>
      ),
    },

    {
      key: "status",
      header: "Estado",
      render: (user: UserModel) => (
        user.active ? (
          <span className="text-emerald-500 font-medium text-sm">
            Activo
          </span>
        ) : (
          <span className="text-rose-500 font-medium text-sm">
            Inactivo
          </span>
        )
      ),
    },
  ];

  const actions: TableAction<typeof users[number]>[] = [
    {
      label: "Editar usuario",
      icon: <Pencil className="w-4 h-4" />,
      onClick: (user) => {
        setSelectedUser(user);

        setIsEditDrawerOpen(true);
      },
    },
    {
      label: "Credenciales y Seguridad",
      icon: <KeyRound className="w-4 h-4 text-amber-600" />,
      onClick: (user) => {
        setSelectedUser(user);
        setIsSecurityDrawerOpen(true); // aca vamos a manejar cosas mas seguras como cambio de contraseña, role y demas.
      },
    },
    {
      label: "Eliminar Usuario",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  const handleSearch = (value: string) => {
    setSearch(value);

    /*
     * Cuando el usuario empieza una nueva búsqueda,
     * volvemos a la primera página.
     */
    setCurrentPage(1);
  };

  const handleDeleteConfirm = () => {
    if (!selectedUser) return;
    const userId = selectedUser.id;

    deleteUser(userId, {
      onSuccess: () => {
        setSelectedUser(null);
        setIsDeleteModalOpen(false);
      },

      onError: (error) => {
        console.error(
          "Error al eliminar el usuario:",
          error
        );
      },
    });
  };

  return (
    <div className="h-full w-full bg-[#f8fafc] p-8 flex flex-col justify-between select-none">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        {/* Encabezado */}
        <div className="flex items-center justify-between pb-6 mb-2">
          {/* <h1 className="text-xl font-bold text-[#001D4A]">Usuarios</h1> */}
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="Buscar usuario..."
          />
          <button
            onClick={() =>
              setIsCreateDrawerOpen(true)
            }
            className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-500/20 cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Nuevo Usuario</span>
          </button>
        </div>

        {/* Tabla de Usuarios */}
        <div className="overflow-x-auto">
          <DataTable
            data={currentUsers}
            columns={columns}
            actions={actions}
            getRowId={(user) => user.id}
            emptyMessage="No hay usuarios registrados."
          />
        </div>
      </div>

      {/* Paginación de la Tabla */}
      <div className="flex items-center justify-between pt-4 px-2 text-xs text-slate-500">
        <Pagination
          currentPage={validPage}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          label="usuarios"
        />
      </div>

      <CreateUserDrawer isOpen={isCreateDrawerOpen} onHide={() => setIsCreateDrawerOpen(false)} />

      <EditUserDrawer
        // key={selectedUser?.id ?? "new"}
        isOpen={isEditDrawerOpen}
        onHide={() => {
          setIsEditDrawerOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      <SecurityUserDrawer
        // key={selectedUser?.id ?? "new"}
        isOpen={isSecurityDrawerOpen}
        onHide={() => {
          setIsSecurityDrawerOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={`¿Estás seguro de eliminar a ${selectedUser?.fullName ?? "este usuario"}?`}
        description="Esta acción no se puede deshacer. Todos los datos asociados a este usuario se perderán permanentemente."
        confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
}

export default UsersPage;