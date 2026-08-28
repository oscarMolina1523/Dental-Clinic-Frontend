import React, { useMemo, useState } from "react";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import type { TableAction, TableColumn } from "../shared/Table/types";
import DataTable from "../shared/Table/DataTable";
import Pagination from "../shared/Table/Pagination";
import { useTableSearch } from "../shared/Table/useTableSearch";
import SearchInput from "../shared/Table/SearchInput";
import type ProductModel from "../models/ProductModel";
import { productsMock } from "../data/productsData";

const ProductsPage: React.FC = () => {
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const searchFields: (keyof ProductModel)[] = [
    "name",
    "barcode",
    "category_id",
    "measurement_unit_id"
  ];

  const {
    search,
    setSearch,
    filteredData,
  } = useTableSearch<ProductModel>({
    data: productsMock,
    fields: searchFields,
    delay: 800,
  });


  const totalItems = filteredData.length; //obtenemos la cantidad total de items 

  //para obtener solo los Productos que queremos por pagina, los visibles
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = startIndex + ITEMS_PER_PAGE;

  const currentProducts = useMemo(
    () =>
      filteredData.slice(
        startIndex,
        endIndex
      ),
    [startIndex, endIndex, filteredData]
  );


  const columns: TableColumn<typeof productsMock[number]>[] = [
    {
      key: "name",
      header: "Nombre",
      className: "pl-2 w-100",
      render: (product: ProductModel) => (
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-800">
            {product.name}
          </span>

        </div>
      ),
    },

    {
      key: "barcode",
      header: "Código",
      render: (product: ProductModel) => (
        <span className="text-sm text-slate-500">
          {product.barcode}
        </span>
      ),
    },
    {
      key: "category_id",
      header: "Categoría",
      render: (product: ProductModel) => (
        <span className="text-sm text-slate-500">
          {product.category_id}
        </span>
      ),
    },
    {
      key: "measurement_unit_id",
      header: "Unidad de medida",
      render: (product: ProductModel) => (
        <span className="text-sm text-slate-500">
          {product.measurement_unit_id}
        </span>
      ),
    },
  ];

  const actions: TableAction<typeof productsMock[number]>[] = [
    {
      label: "Ver producto",
      icon: <Eye className="w-4 h-4" />,
      onClick: (product) => {
        console.log("Ver:", product);
      },
    },

    {
      label: "Editar producto",
      icon: <Pencil className="w-4 h-4" />,
      onClick: (product) => {
        console.log("Editar:", product);
      },
    },

    {
      label: "Eliminar producto",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (product) => {
        console.log("Eliminar:", product);
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
            placeholder="Buscar producto..."
          />
          <button className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-500/20 cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Nuevo Producto</span>
          </button>
        </div>

        {/* Tabla de Productos */}
        <div className="overflow-x-auto">
          <DataTable
            data={currentProducts}
            columns={columns}
            actions={actions}
            getRowId={(product) => product.id}
            emptyMessage="No hay Productos registrados."
          />
        </div>
      </div>

      {/* Paginación de la Tabla */}
      <div className="flex items-center justify-between pt-4 px-2 text-xs text-slate-500">
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          label="Productos"
        />
      </div>
    </div>
  );
}

export default ProductsPage;