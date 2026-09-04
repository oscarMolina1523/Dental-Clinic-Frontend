import React, { useMemo, useState } from "react";
import { Plus, Eye} from "lucide-react";
import type { TableAction, TableColumn } from "../shared/Table/types";
import DataTable from "../shared/Table/DataTable";
import Pagination from "../shared/Table/Pagination";
import { useTableSearch } from "../shared/Table/useTableSearch";
import SearchInput from "../shared/Table/SearchInput";
import {  useInventories } from "../hooks/useInventory";
import type InventoryModel from "../models/InventoryModel";
import CreateInventoryDrawer from "../components/inventory/CreateInventoryDrawer";

const InventoryPage: React.FC = () => {
  const {
    data: inventories = []
  } = useInventories();

  const [isCreateDrawerOpen, setIsCreateDrawerOpen] =
    useState(false);

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const searchFields: (keyof InventoryModel)[] = [
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
      key: "productName",
      header: "Nombre del inventario",
      className: "pl-2 w-100",
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
      className: "w-100",
      render: (inventory: InventoryModel) => (
        <span className="text-sm text-slate-500">
          {inventory.currentStock}
        </span>
      ),
    },
    {
      key: "minimumStock",
      header: "Stock mínimo",
      className: "w-100",
      render: (inventory: InventoryModel) => (
        <span className="text-sm text-slate-500">
          {inventory.minimumStock}
        </span>
      ),
    }
  ];

  const actions: TableAction<typeof inventories[number]>[] = [
    {
      label: "Ver inventario",
      icon: <Eye className="w-4 h-4" />,
      onClick: (inventory) => {
        console.log("Ver:", inventory);
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

  return (
    <div className="h-full w-full bg-[#f8fafc] p-8 flex flex-col justify-between select-none">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        {/* Encabezado */}
        <div className="flex items-center justify-between pb-6 mb-2">
          {/* <h1 className="text-xl font-bold text-[#001D4A]">Productos</h1> */}
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="Buscar inventario..."
          />
          <button onClick={() => setIsCreateDrawerOpen(true)} className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-500/20 cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Nuevo Inventario</span>
          </button>
        </div>

        {/* Tabla de Inventarios */}
        <div className="overflow-x-auto">
          <DataTable
            data={currentProducts}
            columns={columns}
            actions={actions}
            getRowId={(inventory) => inventory.id}
            emptyMessage="No hay Inventarios registrados."
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
          label="Inventarios"
        />
      </div>

      <CreateInventoryDrawer isOpen={isCreateDrawerOpen} onHide={() => setIsCreateDrawerOpen(false)} />

    </div>
  );
}

export default InventoryPage;