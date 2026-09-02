import React, { useMemo, useState } from "react";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import type { TableAction, TableColumn } from "../shared/Table/types";
import DataTable from "../shared/Table/DataTable";
import Pagination from "../shared/Table/Pagination";
import { useTableSearch } from "../shared/Table/useTableSearch";
import SearchInput from "../shared/Table/SearchInput";
import type TreatmentCatalogModel from "../models/TreatmentCatalogModel";
import { useTreatments } from "../hooks/useTreatmentsCatalog";
import CreateTreatmentCatalogDrawer from "../components/treatmentCatalog/CreateTreatmentCatalogDrawer";
import EditTreatmentCatalogDrawer from "../components/treatmentCatalog/EditTreatmentCatalogDrawer";

const TreatmentCatalogPage: React.FC = () => {
    const {
        data: treatments = []
    } = useTreatments();

    const [isCreateDrawerOpen, setIsCreateDrawerOpen] =
        useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] =
        useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedTreatment, setSelectedTreatment] = useState<TreatmentCatalogModel | null>(null);

    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const searchFields: (keyof TreatmentCatalogModel)[] = [
        "name",
        "code",
        "basePrice",
        "estimatedDurationMinutes",
        "active",
    ];

    const {
        search,
        setSearch,
        filteredData,
    } = useTableSearch<TreatmentCatalogModel>({
        data: treatments,
        fields: searchFields,
        delay: 800,
    });


    const totalItems = filteredData.length; //obtenemos la cantidad total de items 

    //para obtener solo los tratamientos que queremos por pagina, los visibles
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex = startIndex + ITEMS_PER_PAGE;

    const currentTreatments = useMemo(
        () =>
            filteredData.slice(
                startIndex,
                endIndex
            ),
        [startIndex, endIndex, filteredData]
    );


    const columns: TableColumn<typeof treatments[number]>[] = [
        {
            key: "name",
            header: "Nombre",
            className: "pl-2 w-100",
            render: (treatment: TreatmentCatalogModel) => (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-800">
                        {treatment.name}
                    </span>

                </div>
            ),
        },

        {
            key: "code",
            header: "CÓDIGO",
            render: (treatment: TreatmentCatalogModel) => (
                <span className="text-sm text-slate-500">
                    {treatment.code}
                </span>
            ),
        },
        {
            key: "basePrice",
            header: "Precio",
            render: (treatment: TreatmentCatalogModel) => (
                <span className="text-sm text-slate-500">
                    {`C$ ${treatment.basePrice}`}
                </span>
            ),
        },
        {
            key: "estimatedDurationMinutes",
            header: "Duración",
            render: (treatment: TreatmentCatalogModel) => (
                <span className="text-sm text-slate-500">
                    {`${treatment.estimatedDurationMinutes} .min`}
                </span>
            ),
        },
        {
            key: "active",
            header: "Estado",
            render: (treatment: TreatmentCatalogModel) => (
                treatment.active ? (
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

    const actions: TableAction<typeof treatments[number]>[] = [
        {
            label: "Ver tratamiento",
            icon: <Eye className="w-4 h-4" />,
            onClick: (treatment) => {
                console.log("Ver:", treatment);
            },
        },

        {
            label: "Editar tratamiento",
            icon: <Pencil className="w-4 h-4" />,
            onClick: (treatment) => {
                setSelectedTreatment(treatment);
                setIsEditDrawerOpen(true);
            },
        },

        {
            label: "Eliminar tratamiento",
            icon: <Trash2 className="w-4 h-4" />,
            onClick: (treatment) => {
                console.log("Eliminar:", treatment);
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
                    {/* <h1 className="text-xl font-bold text-[#001D4A]">Tratamientos</h1> */}
                    <SearchInput
                        value={search}
                        onChange={handleSearch}
                        placeholder="Buscar tratamiento..."
                    />
                    <button onClick={() => setIsCreateDrawerOpen(true)} className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-500/20 cursor-pointer">
                        <Plus className="w-4 h-4" />
                        <span>Nuevo Tratamiento</span>
                    </button>
                </div>

                {/* Tabla de Tratamientos */}
                <div className="overflow-x-auto">
                    <DataTable
                        data={currentTreatments}
                        columns={columns}
                        actions={actions}
                        getRowId={(treatment) => treatment.id}
                        emptyMessage="No hay tratamientos registrados."
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
                    label="tratamientos"
                />
            </div>

            <CreateTreatmentCatalogDrawer isOpen={isCreateDrawerOpen} onHide={() => setIsCreateDrawerOpen(false)} />

            <EditTreatmentCatalogDrawer
                isOpen={isEditDrawerOpen}
                onHide={() => {
                    setIsEditDrawerOpen(false);
                    setSelectedTreatment(null);
                }}
                treatment={selectedTreatment}
            />
        </div>
    );
}

export default TreatmentCatalogPage;