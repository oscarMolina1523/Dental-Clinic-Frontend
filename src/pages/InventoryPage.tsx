import React, { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Download, CheckSquare } from "lucide-react";
import type { TableAction, TableColumn } from "../shared/Table/types";
import DataTable from "../shared/Table/DataTable";
import Pagination from "../shared/Table/Pagination";
import { useTableSearch } from "../shared/Table/useTableSearch";
import SearchInput from "../shared/Table/SearchInput";
import { useInventories } from "../hooks/useInventory";
import type InventoryModel from "../models/InventoryModel";
import CreateInventoryDrawer from "../components/inventory/CreateInventoryDrawer";
import EditInventoryDrawer from "../components/inventory/EditInventoryDrawer";
import TableSkeleton from "../components/skeleton/TableSkeleton";
import { useRolePermissions, UserRole } from "../hooks/useRolePermitions";
import { useNotifications } from "../hooks/usenotifications";
import { exportInventoryPdf } from "../services/inventoryPdf";

const InventoryPage: React.FC = () => {

  const {
    addNotification,
    removeNotification,
  } = useNotifications();

  const {
    data: inventories = [],
    isLoading
  } = useInventories();

  const { role } = useRolePermissions();

  const isViewer = role === UserRole.Viewer;
  const canWrite = !isViewer;

  const [isCreateDrawerOpen, setIsCreateDrawerOpen] =
    useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] =
    useState(false);
  const [selectedInventory, setSelectedInventory] = useState<InventoryModel | null>(null);

  const [selectedInventoryIds, setSelectedInventoryIds] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const searchFields: (keyof InventoryModel)[] = [
    "productName",
    "currentStock",
    "minimumStock"
  ];

  const {
    search,
    setSearch,
    filteredData,
  } = useTableSearch<InventoryModel>({
    data: inventories,
    fields: searchFields,
    delay: 800,
  });


  const totalItems = filteredData.length; //obtenemos la cantidad total de items 

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / ITEMS_PER_PAGE)
  );

  const validPage = Math.min(
    currentPage,
    totalPages
  );

  //para obtener solo los Productos que queremos por pagina, los visibles
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;

  const endIndex = startIndex + ITEMS_PER_PAGE;

  const currentProducts = useMemo(
    () =>
      filteredData.slice(
        startIndex,
        endIndex
      ),
    [startIndex, endIndex, filteredData]
  );

  const columns: TableColumn<typeof inventories[number]>[] = [
    {
      key: "id",
      header: "Seleccionar",
      className: "w-20 text-center",
      render: (inventory: InventoryModel) => (
        <input
          type="checkbox"
          checked={selectedInventoryIds.includes(inventory.id)}
          onChange={() => toggleInventorySelection(inventory.id)}
          className="w-4 h-4 cursor-pointer accent-blue-600"
          aria-label={`Seleccionar ${inventory.productName}`}
        />
      ),
    },
    {
      key: "productName",
      header: "Nombre del inventario",
      className: "pl-2 w-40 md:w-100",
      render: (inventory: InventoryModel) => (
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-800">
            {inventory.productName}
          </span>

        </div>
      ),
    },

    {
      key: "currentStock",
      header: "Stock actual",
      className: "w-30 md:w-60",
      render: (inventory: InventoryModel) => (
        <span className="text-sm text-slate-500">
          {inventory.currentStock}
        </span>
      ),
    },
    {
      key: "minimumStock",
      header: "Stock mínimo",
      className: "w-30 md:w-60",
      render: (inventory: InventoryModel) => (
        <span className="text-sm text-slate-500">
          {inventory.minimumStock}
        </span>
      ),
    }
  ];

  const actions: TableAction<typeof inventories[number]>[] = [
    {
      label: "Editar inventario",
      icon: <Pencil className="w-4 h-4" />,
      onClick: (inventory) => {
        setSelectedInventory(inventory);
        setIsEditDrawerOpen(true);
      },
      hidden: () => !canWrite,
    },

  ];

  // Seleccionar o deseleccionar un inventario.
  const toggleInventorySelection = (id: string) => {
    setSelectedInventoryIds((previous) =>
      previous.includes(id)
        ? previous.filter((itemId) => itemId !== id)
        : [...previous, id]
    );
  };

  // Seleccionar todos los inventarios del resultado de búsqueda.
  const toggleSelectAll = () => {
    const allFilteredSelected =
      filteredData.length > 0 &&
      filteredData.every((inventory) =>
        selectedInventoryIds.includes(inventory.id)
      );

    if (allFilteredSelected) {
      const filteredIds = new Set(
        filteredData.map((inventory) => inventory.id)
      );

      setSelectedInventoryIds((previous) =>
        previous.filter((id) => !filteredIds.has(id))
      );
      return;
    }

    setSelectedInventoryIds((previous) =>
      Array.from(
        new Set([
          ...previous,
          ...filteredData.map((inventory) => inventory.id),
        ])
      )
    );
  };

  // Descargar inventarios seleccionados.
  const handleExportSelected = async () => {
    const selectedInventories = inventories.filter((inventory) =>
      selectedInventoryIds.includes(inventory.id)
    );

    if (!selectedInventories.length) return;

    try {
      setIsExporting(true);
      await exportInventoryPdf(selectedInventories);
    } catch (error) {
      console.error("Error al generar el PDF del inventario:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);

    /*
     * Cuando el usuario empieza una nueva búsqueda,
     * volvemos a la primera página.
     */
    setCurrentPage(1);
  };

  useEffect(() => {
    if (isLoading) return;

    inventories.forEach((inventory) => {
      const notificationId = `low-stock-${inventory.id}`;

      if (inventory.currentStock < inventory.minimumStock) {
        addNotification({
          id: notificationId,
          title: "Inventario bajo",
          message: `${inventory.productName}: stock actual de ${inventory.currentStock} unidades, por debajo del mínimo de ${inventory.minimumStock}.`,
          type: "warning",
          entityType: "Inventory",
          entityId: inventory.id,
          actionUrl: "/inventories",
        });
      } else {
        removeNotification(notificationId);
      }
    });
  }, [
    inventories,
    isLoading,
    addNotification,
    removeNotification,
  ]);

  return (
    <div className="h-full w-full bg-[#f8fafc] p-8 flex flex-col justify-between select-none">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row items-end gap-2 md:items-center justify-between pb-6 mb-2">
          {/* <h1 className="text-xl font-bold text-[#001D4A]">Productos</h1> */}
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="Buscar inventario..."
          />
          <div className="flex flex-col md:flex-row gap-2">
            <button
              type="button"
              onClick={toggleSelectAll}
              disabled={filteredData.length === 0 || isExporting}
              className="flex items-center gap-2 text-sm font-medium px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckSquare className="w-4 h-4" />
              <span>
                {filteredData.length > 0 &&
                  filteredData.every((item) =>
                    selectedInventoryIds.includes(item.id)
                  )
                  ? "Deseleccionar todos"
                  : "Seleccionar todos"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleExportSelected}
              disabled={selectedInventoryIds.length === 0 || isExporting}
              className="flex items-center gap-2 text-sm font-medium px-3 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>
                {isExporting
                  ? "Generando..."
                  : `Descargar seleccionados (${selectedInventoryIds.length})`}
              </span>
            </button>
          </div>

          <button disabled={!canWrite} onClick={() => setIsCreateDrawerOpen(true)} className={`flex items-center gap-2 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-500/20 ${canWrite
            ? "bg-[#2563eb] hover:bg-blue-700 cursor-pointer"
            : "bg-slate-300 cursor-not-allowed opacity-70"
            }`}>
            <Plus className="w-4 h-4" />
            <span>Nuevo Inventario</span>
          </button>
        </div>

        {/* Tabla de Inventarios */}
        <div className="overflow-x-auto max-h-100">
          {isLoading ? (
            <TableSkeleton
              columns={columns}
              rows={10}
              actions
            />
          ) : (
            <DataTable
              data={currentProducts}
              columns={columns}
              actions={actions}
              getRowId={(inventory) => inventory.id}
              emptyMessage="No hay Inventarios registrados."
              getRowClassName={(inventory) =>
                inventory.currentStock < inventory.minimumStock
                  ? "bg-red-100 hover:bg-red-200"
                  : ""
              }
            />
          )}
        </div>
      </div>

      {/* Paginación de la Tabla */}
      <div className="flex items-center justify-between pt-4 px-2 text-xs text-slate-500">
        <Pagination
          currentPage={validPage}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          label="Inventarios"
        />
      </div>

      <CreateInventoryDrawer isOpen={isCreateDrawerOpen} onHide={() => setIsCreateDrawerOpen(false)} />

      <EditInventoryDrawer
        isOpen={isEditDrawerOpen}
        onHide={() => {
          setIsEditDrawerOpen(false);
          setSelectedInventory(null);
        }}
        inventory={selectedInventory}
      />

    </div>
  );
}

export default InventoryPage;