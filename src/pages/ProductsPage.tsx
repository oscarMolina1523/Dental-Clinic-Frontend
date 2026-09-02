import React, { useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { TableAction, TableColumn } from "../shared/Table/types";
import DataTable from "../shared/Table/DataTable";
import Pagination from "../shared/Table/Pagination";
import { useTableSearch } from "../shared/Table/useTableSearch";
import SearchInput from "../shared/Table/SearchInput";
import type ProductModel from "../models/ProductModel";
import { useDeleteProduct, useProducts } from "../hooks/useProducts";
import CreateProductDrawer from "../components/product/CreateProductDrawer";
import { useMeasurementUnites } from "../hooks/useMeasurementUnit";
import { useCategories } from "../hooks/useCategories";
import EditProductDrawer from "../components/product/EditProductDrawer";
import ConfirmModal from "../shared/ConfirmModal";

const ProductsPage: React.FC = () => {
  const {
    data: products = []
  } = useProducts(1, 10);
  const { data: measurementUnites = [] } = useMeasurementUnites();
  const { data: categories = [] } = useCategories();
  const {
    mutate: deleteProduct,
    isPending: isDeleting
  } = useDeleteProduct();

  const [isCreateDrawerOpen, setIsCreateDrawerOpen] =
    useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] =
    useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);


  const ITEMS_PER_PAGE = 10;
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
    data: products,
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

  //Creamos un mapa/diccionario optimizado para búsqueda rápida (O(1))
  const measurementMap = useMemo(() => {
    return new Map(measurementUnites.map((measurement) => [measurement.id, measurement]));
  }, [measurementUnites]);

  const categoryMap = useMemo(() => {
    return new Map(categories.map((category) => [category.id, category.name]));
  }, [categories]);

  const columns: TableColumn<typeof products[number]>[] = [
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
      header: "Código de barra",
      render: (product: ProductModel) => (
        <span className="text-sm text-slate-500">
          {product.barcode}
        </span>
      ),
    },
    {
      key: "category_id",
      header: "Categoría",
      className: "w-100",
      render: (product: ProductModel) => (
        <span className="text-sm text-slate-500">
          {categoryMap.get(product.category_id) ?? "Cargando..."}
        </span>
      ),
    },
    {
      key: "measurement_unit_id",
      header: "Unidad de medida",
      render: (product: ProductModel) => {
        const measurement = measurementMap.get(product.measurement_unit_id);

        return (
          <span className="text-sm text-slate-500">
            {measurement
              ? `${measurement.name} (${measurement.abreviation})`
              : "Cargando..."}
          </span>
        );
      },
    },
  ];

  const actions: TableAction<typeof products[number]>[] = [
    // {
    //   label: "Ver producto",
    //   icon: <Eye className="w-4 h-4" />,
    //   onClick: (product) => {
    //     console.log("Ver:", product);
    //   },
    // },

    {
      label: "Editar producto",
      icon: <Pencil className="w-4 h-4" />,
      onClick: (product) => {
        setSelectedProduct(product);
        setIsEditDrawerOpen(true);
      },
    },

    {
      label: "Eliminar producto",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (product) => {
        setSelectedProduct(product);
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
    if (!selectedProduct) return;
    const productId = selectedProduct.id;

    deleteProduct(productId, {
      onSuccess: () => {
        setSelectedProduct(null);
        setIsDeleteModalOpen(false);
      },

      onError: (error) => {
        console.error(
          "Error al eliminar el producto:",
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
          {/* <h1 className="text-xl font-bold text-[#001D4A]">Productos</h1> */}
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="Buscar producto..."
          />
          <button onClick={() => setIsCreateDrawerOpen(true)} className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-500/20 cursor-pointer">
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
          currentPage={validPage}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          label="Productos"
        />
      </div>

      <CreateProductDrawer isOpen={isCreateDrawerOpen} onHide={() => setIsCreateDrawerOpen(false)} />

      <EditProductDrawer
        isOpen={isEditDrawerOpen}
        onHide={() => {
          setIsEditDrawerOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={`¿Estás seguro de eliminar a ${selectedProduct?.name ?? "este producto"}?`}
        description="Esta acción no se puede deshacer. Todos los datos asociados a este producto se perderán permanentemente."
        confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}

export default ProductsPage;