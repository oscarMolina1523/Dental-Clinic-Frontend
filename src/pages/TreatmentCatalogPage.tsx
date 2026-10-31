import React, { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, KeyRound } from "lucide-react";
import type { TableAction, TableColumn } from "../shared/Table/types";
import DataTable from "../shared/Table/DataTable";
import Pagination from "../shared/Table/Pagination";
import { useTableSearch } from "../shared/Table/useTableSearch";
import SearchInput from "../shared/Table/SearchInput";
import type TreatmentCatalogModel from "../models/TreatmentCatalogModel";
import { useDeleteTreatment, useTreatments } from "../hooks/useTreatmentsCatalog";
import CreateTreatmentCatalogDrawer from "../components/treatmentCatalog/CreateTreatmentCatalogDrawer";
import EditTreatmentCatalogDrawer from "../components/treatmentCatalog/EditTreatmentCatalogDrawer";
import ConfirmModal from "../shared/ConfirmModal";
import SecurityTreatmentCatalogDrawer from "../components/treatmentCatalog/SecurityTreatmentCatalogDrawer";
import TableSkeleton from "../components/skeleton/TableSkeleton";
import { useRolePermissions, UserRole } from "../hooks/useRolePermitions";

const TreatmentCatalogPage: React.FC = () => {
    const {
        data: treatments = [],
        isLoading
    } = useTreatments();
    const {
        mutate: deleteTreatment,
        isPending: isDeleting
    } = useDeleteTreatment();

    const { role } = useRolePermissions();

    const isViewer = role === UserRole.Viewer;
    const canWrite = !isViewer;

    const [isCreateDrawerOpen, setIsCreateDrawerOpen] =
        useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] =
        useState(false);
    const [isSecurityDrawerOpen, setIsSecurityDrawerOpen] =
        useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedStatus, setSelectedStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

    const [selectedTreatment, setSelectedTreatment] = useState<TreatmentCatalogModel | null>(null);

    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const searchFields: (keyof TreatmentCatalogModel)[] = [
        "name",
        "basePrice",
        "estimatedDurationMinutes"
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

    const filteredTreatments = useMemo(() => {
        return filteredData.filter((treatment) =>
            selectedStatus === "ACTIVE"
                ? Number(treatment.active) === 1
                : Number(treatment.active) === 0
        );
    }, [filteredData, selectedStatus]);


    const totalItems = filteredTreatments.length; //obtenemos la cantidad total de items 

    const totalPages = Math.max(
        1,
        Math.ceil(totalItems / ITEMS_PER_PAGE)
    );

    const validPage = Math.min(
        currentPage,
        totalPages
    );

    //para obtener solo los Servicios que queremos por pagina, los visibles
    const startIndex = (validPage - 1) * ITEMS_PER_PAGE;

    const endIndex = startIndex + ITEMS_PER_PAGE;

    const currentTreatments = useMemo(
        () =>
            filteredTreatments.slice(
                startIndex,
                endIndex
            ),
        [startIndex, endIndex, filteredTreatments]
    );


    const columns: TableColumn<typeof treatments[number]>[] = [
        {
            key: "name",
            header: "Nombre",
            className: "pl-2 w-50 md:w-60",
            render: (treatment: TreatmentCatalogModel) => (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-800 truncate">
                        {treatment.name}
                    </span>

                </div>
            ),
        },
        {
            key: "description",
            header: "Descripción",
            className: "w-20 md:w-70 pr-4",
            render: (treatment: TreatmentCatalogModel) => (
                <p className="text-sm text-slate-500 truncate">
                    {treatment.description}
                </p>
            ),
        },
        {
            key: "specialities",
            header: "Especialidades",
            className: "w-20 md:w-60",
            render: (treatment: TreatmentCatalogModel) => (
                <p className="text-sm text-slate-500 truncate pr-4">
                    {treatment.specialities}
                </p>
            ),
        },
        {
            key: "basePrice",
            header: "Precio",
            className: "w-20",
            render: (treatment: TreatmentCatalogModel) => (
                <span className="text-sm text-slate-500">
                    {`C$ ${treatment.basePrice}`}
                </span>
            ),
        },
        {
            key: "estimatedDurationMinutes",
            header: "Duración",
            className: "w-20",
            render: (treatment: TreatmentCatalogModel) => (
                <span className="text-sm text-slate-500">
                    {`${treatment.estimatedDurationMinutes} .min`}
                </span>
            ),
        },
        {
            key: "active",
            header: "Estado",
            className: "w-20",
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
            label: "Datos sensibles",
            icon: <KeyRound className="w-4 h-4 text-amber-600" />,
            onClick: (treatment) => {
                setSelectedTreatment(treatment);
                setIsSecurityDrawerOpen(true); // aca vamos a manejar cosas mas seguras como cambio de contraseña, role y demas.
            },
            hidden: () => !canWrite,
        },

        {
            label: "Editar Servicio",
            icon: <Pencil className="w-4 h-4" />,
            onClick: (treatment) => {
                setSelectedTreatment(treatment);
                setIsEditDrawerOpen(true);
            },
            hidden: () => !canWrite,
        },

        {
            label: "Eliminar Servicio",
            icon: <Trash2 className="w-4 h-4" />,
            onClick: (treatment) => {
                setSelectedTreatment(treatment);
                setIsDeleteModalOpen(true);
            },
            hidden: () => !canWrite,
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
        if (!selectedTreatment) return;
        const treatmentId = selectedTreatment.id;

        deleteTreatment(treatmentId, {
            onSuccess: () => {
                setSelectedTreatment(null);
                setIsDeleteModalOpen(false);
            },

            onError: (error) => {
                console.error(
                    "Error al eliminar el Servicio:",
                    error
                );
            },
        });
    };

    return (
        <div className="h-full w-full bg-[#f8fafc] p-8 flex flex-col justify-between select-none">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                {/* Encabezado */}
                <div className="flex flex-col md:flex-row items-end gap-2 md:items-center justify-between pb-6 mb-2">
                    {/* <h1 className="text-xl font-bold text-[#001D4A]">Servicios</h1> */}
                    <div className="flex flex-row gap-2 md:w-1/2">
                        <SearchInput
                            value={search}
                            onChange={handleSearch}
                            placeholder="Buscar Servicio..."
                        />

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setSelectedStatus("ACTIVE");
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${selectedStatus === "ACTIVE"
                                    ? "bg-[#001D4A] text-white border-[#001D4A]"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                    }`}
                            >
                                Activos
                            </button>

                            <button
                                onClick={() => {
                                    setSelectedStatus("INACTIVE");
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${selectedStatus === "INACTIVE"
                                    ? "bg-[#001D4A] text-white border-[#001D4A]"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                    }`}
                            >
                                Inactivos
                            </button>
                        </div>
                    </div>
                    <button disabled={!canWrite} onClick={() => setIsCreateDrawerOpen(true)} className={`flex items-center gap-2 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-500/20 ${canWrite
                        ? "bg-[#2563eb] hover:bg-blue-700 cursor-pointer"
                        : "bg-slate-300 cursor-not-allowed opacity-70"
                        }`}>
                        <Plus className="w-4 h-4" />
                        <span>Nuevo Servicio</span>
                    </button>
                </div>

                {/* Tabla de Servicios */}
                <div className="overflow-x-auto max-h-120">
                    {isLoading ? (
                        <TableSkeleton
                            columns={columns}
                            rows={10}
                            actions
                        />
                    ) : (
                        <DataTable
                            data={currentTreatments}
                            columns={columns}
                            actions={actions}
                            getRowId={(treatment) => treatment.id}
                            emptyMessage="No hay Servicios registrados."
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
                    label="Servicios"
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

            <SecurityTreatmentCatalogDrawer
                isOpen={isSecurityDrawerOpen}
                onHide={() => {
                    setIsSecurityDrawerOpen(false);
                    setSelectedTreatment(null);
                }}
                treatment={selectedTreatment}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title={`¿Estás seguro de eliminar a ${selectedTreatment?.name ?? "este Servicio"}?`}
                description="Esta acción no se puede deshacer. Todos los datos asociados a este Servicio se perderán permanentemente."
                confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
                cancelText="Cancelar"
                onConfirm={handleDeleteConfirm}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedTreatment(null);
                }}
            />
        </div>
    );
}

export default TreatmentCatalogPage;