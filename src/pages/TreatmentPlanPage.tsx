import React, { useMemo, useState } from "react";
import { Plus, Trash2, Menu, XCircle, Check, Play, CheckCircle2, Send, X, Eye } from "lucide-react";
import type { TableAction, TableColumn } from "../shared/Table/types";
import DataTable from "../shared/Table/DataTable";
import Pagination from "../shared/Table/Pagination";
import { useTableSearch, type SearchField } from "../shared/Table/useTableSearch";
import SearchInput from "../shared/Table/SearchInput";
import { useDeleteTreatmentPlanOrchestrator, useTreatmentPlansOrchestrator } from "../hooks/useTreatmentPlanOrchestrator";
import type { TreatmentPlanOrchestratorResponse } from "../models/TreatmentPlanOrchestratorModel";
import CreateTreatmentPlanDrawer from "../components/treatmentCatalog/CreateTreatmentPlanDrawer";
import ConfirmModal from "../shared/ConfirmModal";
import type { TreatmentPlanStatus } from "../utils/treatmentPlanStatus.enum";
import { useAcceptTreatmentPlan, useCancelTreatmentPlan, useCompleteTreatmentPlan, useProposeTreatmentPlan, useStartTreatmentPlan } from "../hooks/useTreatmentPlan";
import ShowTreatmentPlanDrawer from "../components/treatmentCatalog/ShowTreatmentPlanDrawer";

const TreatmentPlanPage: React.FC = () => {
    const {
        data: treatments = []
    } = useTreatmentPlansOrchestrator();

    const proposeMutation = useProposeTreatmentPlan();
    const acceptMutation = useAcceptTreatmentPlan();
    const startMutation = useStartTreatmentPlan();
    const completeMutation = useCompleteTreatmentPlan();
    const cancelMutation = useCancelTreatmentPlan();

    const { mutate: deleteTreatment, isPending: isDeleting } = useDeleteTreatmentPlanOrchestrator();

    const [isCreateDrawerOpen, setIsCreateDrawerOpen] =
        useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isShowModalOpen, setIsShowModalOpen] = useState(false);

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

    const canPropose = (status: TreatmentPlanStatus): boolean => {
        return status === "DRAFT";
    };

    const canAccept = (status: TreatmentPlanStatus): boolean => {
        return status === "PROPOSED";
    };

    const canStart = (status: TreatmentPlanStatus): boolean => {
        return status === "ACCEPTED";
    };

    const canComplete = (status: TreatmentPlanStatus): boolean => {
        return status === "IN_PROGRESS";
    };

    const canCancel = (status: TreatmentPlanStatus): boolean => {
        return (
            status === "DRAFT" ||
            status === "PROPOSED" ||
            status === "ACCEPTED" ||
            status === "IN_PROGRESS"
        );
    };

    const handlePropose = (id: string) => {
        proposeMutation.mutate(id, {
            onSuccess: () => {
                setSelectedTreatment(null);
                setIsStatusModalOpen(false);
            },
        });
    };

    const handleAccept = (id: string) => {
        acceptMutation.mutate(id, {
            onSuccess: () => {
                setIsStatusModalOpen(false);
            },
        });
    };

    const handleStart = (id: string) => {
        startMutation.mutate(id, {
            onSuccess: () => {
                setIsStatusModalOpen(false);
            },
        });
    };

    const handleComplete = (id: string) => {
        completeMutation.mutate(id, {
            onSuccess: () => {
                setIsStatusModalOpen(false);
            },
        });
    };

    const handleCancel = (id: string) => {
        cancelMutation.mutate(id, {
            onSuccess: () => {
                setIsStatusModalOpen(false);
            },
        });
    };


    const columns: TableColumn<typeof treatments[number]>[] = [
        {
            key: "code",
            header: "Código",
            render: (treatment: TreatmentPlanOrchestratorResponse) => (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-800">
                        {treatment.treatmentPlan.code}
                    </span>

                </div>
            ),
        },
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
        {
            label: "Ver plan de tratamiento",
            icon: <Eye className="w-4 h-4" />,
            onClick: (treatment) => {
                setSelectedTreatment(treatment);
                setIsShowModalOpen(true);
            },
        },

        {
            label: "Cambios de estados",
            icon: <Menu className="w-4 h-4 text-amber-600" />,
            onClick: (treatment) => {
                setSelectedTreatment(treatment);
                setIsStatusModalOpen(true); // aca vamos a manejar cosas mas seguras como cambio de contraseña, role y demas.
            },
            hidden: (treatment) => {
                const status = treatment.treatmentPlan.status;

                return (
                    status === "COMPLETED" ||
                    status === "CANCELLED"
                );
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

    const isPendingAny =
        proposeMutation.isPending ||
        acceptMutation.isPending ||
        startMutation.isPending ||
        completeMutation.isPending ||
        cancelMutation.isPending;

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

            {isStatusModalOpen && selectedTreatment && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">

                        {/* HEADER */}
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-800">
                                    Acciones Rápidas
                                </h3>

                                <p className="text-xs text-slate-500 mt-0.5">
                                    Estado actual:{" "}
                                    <span className="font-medium text-slate-700">
                                        {selectedTreatment.treatmentPlan.status}
                                    </span>
                                </p>
                            </div>

                            <button
                                onClick={() => setIsStatusModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* ACTIONS */}
                        <div className="p-3 space-y-1">

                            {/* =================================================
                    DRAFT -> PROPOSED
                ================================================= */}
                            {canPropose(selectedTreatment.treatmentPlan.status) && (
                                <button
                                    disabled={isPendingAny}
                                    onClick={() =>
                                        handlePropose(selectedTreatment.treatmentPlan.id)
                                    }
                                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4 text-blue-600" />

                                    <span>
                                        {proposeMutation.isPending
                                            ? "Proponiendo..."
                                            : "Proponer Plan"}
                                    </span>
                                </button>
                            )}

                            {/* =================================================
                    PROPOSED -> ACCEPTED
                ================================================= */}
                            {canAccept(selectedTreatment.treatmentPlan.status) && (
                                <button
                                    disabled={isPendingAny}
                                    onClick={() =>
                                        handleAccept(selectedTreatment.treatmentPlan.id)
                                    }
                                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />

                                    <span>
                                        {acceptMutation.isPending
                                            ? "Aceptando..."
                                            : "Aceptar Plan"}
                                    </span>
                                </button>
                            )}

                            {/* =================================================
                    ACCEPTED -> IN_PROGRESS
                ================================================= */}
                            {canStart(selectedTreatment.treatmentPlan.status) && (
                                <button
                                    disabled={isPendingAny}
                                    onClick={() =>
                                        handleStart(selectedTreatment.treatmentPlan.id)
                                    }
                                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    <Play className="w-4 h-4 text-blue-600" />

                                    <span>
                                        {startMutation.isPending
                                            ? "Iniciando..."
                                            : "Iniciar Plan"}
                                    </span>
                                </button>
                            )}

                            {/* =================================================
                    IN_PROGRESS -> COMPLETED
                ================================================= */}
                            {canComplete(selectedTreatment.treatmentPlan.status) && (
                                <button
                                    disabled={isPendingAny}
                                    onClick={() =>
                                        handleComplete(selectedTreatment.treatmentPlan.id)
                                    }
                                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    <Check className="w-4 h-4 text-indigo-600" />

                                    <span>
                                        {completeMutation.isPending
                                            ? "Completando..."
                                            : "Completar Plan"}
                                    </span>
                                </button>
                            )}

                            {/* =================================================
                    CANCELAR
                ================================================= */}
                            {canCancel(selectedTreatment.treatmentPlan.status) && (
                                <>
                                    <div className="my-1 border-t border-slate-100" />

                                    <button
                                        disabled={isPendingAny}
                                        onClick={() =>
                                            handleCancel(selectedTreatment.treatmentPlan.id)
                                        }
                                        className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50 font-medium"
                                    >
                                        <XCircle className="w-4 h-4 text-rose-600" />

                                        <span>
                                            {cancelMutation.isPending
                                                ? "Cancelando..."
                                                : "Cancelar Plan"}
                                        </span>
                                    </button>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            )}

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

            <ShowTreatmentPlanDrawer isOpen={isShowModalOpen} onHide={()=> setIsShowModalOpen(false)} treatment={selectedTreatment} />
        </div>
    );
}

export default TreatmentPlanPage;