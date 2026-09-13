import React, { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, KeyRound } from "lucide-react";
import type { TableAction, TableColumn } from "../shared/Table/types";
import DataTable from "../shared/Table/DataTable";
import Pagination from "../shared/Table/Pagination";
import { useTableSearch, type SearchField } from "../shared/Table/useTableSearch";
import SearchInput from "../shared/Table/SearchInput";
import { useDeleteTreatmentPlanOrchestrator, useTreatmentPlansOrchestrator } from "../hooks/useTreatmentPlanOrchestrator";
import type { TreatmentPlanOrchestratorResponse } from "../models/TreatmentPlanOrchestratorModel";
import CreateTreatmentPlanDrawer from "../components/treatmentCatalog/CreateTreatmentPlanDrawer";
import ConfirmModal from "../shared/ConfirmModal";

const TreatmentPlanPage: React.FC = () => {
    const {
        data: treatments = []
    } = useTreatmentPlansOrchestrator();

    const {mutate: deleteTreatment, isPending: isDeleting} = useDeleteTreatmentPlanOrchestrator();

    const [isCreateDrawerOpen, setIsCreateDrawerOpen] =
        useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedTreatment, setSelectedTreatment] = useState<TreatmentPlanOrchestratorResponse | null>(null);

    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const searchFields: SearchField<TreatmentPlanOrchestratorResponse>[] = [
        "treatmentPlan.patientFullName",
        "treatmentPlan.dentistFullName",
        "treatmentPlan.status",
        "treatmentPlan.totalAmount",
    ];

    const {
        search,
        setSearch,
        filteredData,
    } = useTableSearch<TreatmentPlanOrchestratorResponse>({
        data: treatments,
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

    //para obtener solo los plan de tratamientos que queremos por pagina, los visibles
    const startIndex = (validPage - 1) * ITEMS_PER_PAGE;

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
            key: "patientFullName",
            header: "Paciente",
            className: "pl-2 w-100",
            render: (treatment: TreatmentPlanOrchestratorResponse) => (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-800">
                        {treatment.treatmentPlan.patientFullName}
                    </span>

                </div>
            ),
        },

        {
            key: "dentistFullName",
            header: "Dentista",
            render: (treatment: TreatmentPlanOrchestratorResponse) => (
                <span className="text-sm text-slate-500">
                    {treatment.treatmentPlan.dentistFullName}
                </span>
            ),
        },
        {
            key: "status",
            header: "Estado",
            render: (treatment: TreatmentPlanOrchestratorResponse) => (
                <span className="text-sm text-slate-500">
                    {treatment.treatmentPlan.status}
                </span>
            ),
        },
        {
            key: "totalAmount",
            header: "Monto total",
            render: (treatment: TreatmentPlanOrchestratorResponse) => (
                <span className="text-sm text-slate-500">
                    {treatment.treatmentPlan.totalAmount}
                </span>
            ),
        },
        {
              key: "createdAt",
              header: "Fecha de creación",
              render: (treatment: TreatmentPlanOrchestratorResponse) => (
                <span className="text-sm text-slate-500">
                  {treatment.treatmentPlan.createdAt ? new Date(treatment.treatmentPlan.createdAt).toLocaleString("es-NI", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }) : "N/A"}
                </span>
              ),
            },
    ];

    const actions: TableAction<typeof treatments[number]>[] = [
        // {
        //     label: "Ver plan de tratamiento",
        //     icon: <Eye className="w-4 h-4" />,
        //     onClick: (treatment) => {
        //         console.log("Ver:", treatment);
        //     },
        // },

        {
            label: "Credenciales y Seguridad",
            icon: <KeyRound className="w-4 h-4 text-amber-600" />,
            onClick: (treatment) => {
                setSelectedTreatment(treatment);
                setIsSecurityDrawerOpen(true); // aca vamos a manejar cosas mas seguras como cambio de contraseña, role y demas.
            },
        },

        {
            label: "Editar plan de tratamiento",
            icon: <Pencil className="w-4 h-4" />,
            onClick: (treatment) => {
                setSelectedTreatment(treatment);
                setIsEditDrawerOpen(true);
            },
        },

        {
            label: "Eliminar plan de tratamiento",
            icon: <Trash2 className="w-4 h-4" />,
            onClick: (treatment) => {
                setSelectedTreatment(treatment);
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
        if (!selectedTreatment) return;
        const treatmentId = selectedTreatment.treatmentPlan.id;

        deleteTreatment(treatmentId, {
            onSuccess: () => {
                setSelectedTreatment(null);
                setIsDeleteModalOpen(false);
            },

            onError: (error) => {
                console.error(
                    "Error al eliminar el plan de tratamiento:",
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
                    {/* <h1 className="text-xl font-bold text-[#001D4A]">plan de tratamientos</h1> */}
                    <SearchInput
                        value={search}
                        onChange={handleSearch}
                        placeholder="Buscar plan de tratamiento..."
                    />
                    <button onClick={() => setIsCreateDrawerOpen(true)} className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-500/20 cursor-pointer">
                        <Plus className="w-4 h-4" />
                        <span>Nuevo plan de tratamiento</span>
                    </button>
                </div>

                {/* Tabla de plan de tratamientos */}
                <div className="overflow-x-auto">
                    <DataTable
                        data={currentTreatments}
                        columns={columns}
                        actions={actions}
                        getRowId={(treatment) => treatment.treatmentPlan.id}
                        emptyMessage="No hay plan de tratamientos registrados."
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
                    label="plan de tratamientos"
                />
            </div>

            <CreateTreatmentPlanDrawer isOpen={isCreateDrawerOpen} onHide={() => setIsCreateDrawerOpen(false)} />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title={`¿Estás seguro de eliminar a este plan de tratamientos`}
                description="Esta acción no se puede deshacer. Todos los datos asociados a este plan de tratamiento se perderán permanentemente."
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

export default TreatmentPlanPage;