import React, { useMemo, useState } from "react";
import { Plus, Pencil, Menu, X, CheckCircle2, Play, Check, UserX, XCircle } from "lucide-react";
import type { TableAction, TableColumn } from "../shared/Table/types";
import DataTable from "../shared/Table/DataTable";
import Pagination from "../shared/Table/Pagination";
import { useTableSearch } from "../shared/Table/useTableSearch";
import SearchInput from "../shared/Table/SearchInput";
import { useAppointments, useCancelAppointment, useCompleteAppointment, useConfirmAppointment, useMarkAppointmentAsNoShow, useStartAppointment } from "../hooks/useAppointment";
import type AppointmentModel from "../models/AppointmentModel";
import CreateAppointmentDrawer from "../components/appointment/CreateAppointmentDrawer";
import EditAppointmentDrawer from "../components/appointment/EditAppointmentDrawet";
import Toast from "../shared/Toast";

const AppointmentPage: React.FC = () => {
    const {
        data: appointments = []
    } = useAppointments();

    const [isCreateDrawerOpen, setIsCreateDrawerOpen] =
        useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] =
        useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] =
        useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    // React Query Mutations
    const confirmMutation = useConfirmAppointment();
    const startMutation = useStartAppointment();
    const completeMutation = useCompleteAppointment();
    const cancelMutation = useCancelAppointment();
    const noShowMutation = useMarkAppointmentAsNoShow();

    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentModel | null>(null);
    const [cancelNotes, setCancelNotes] = useState("");

    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const searchFields: (keyof AppointmentModel)[] = [
        "patientFullName",
        "dentistFullName",
        "startAppointmentTime",
        "endAppointmentTime",
        "status",
        "reminderSent",
    ];

    const {
        search,
        setSearch,
        filteredData,
    } = useTableSearch<AppointmentModel>({
        data: appointments,
        fields: searchFields,
        delay: 800,
    });

    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const showToast = (
        type: "success" | "error",
        message: string
    ) => {
        setToast({
            type,
            message,
        });
    };


    const totalItems = filteredData.length; //obtenemos la cantidad total de items 

    const totalPages = Math.max(
        1,
        Math.ceil(totalItems / ITEMS_PER_PAGE)
    );

    const validPage = Math.min(
        currentPage,
        totalPages
    );

    //para obtener solo los lotes que queremos por pagina, los visibles
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

    // Manejadores de acciones
    const handleConfirm = (id: string) => {
        confirmMutation.mutate(id, {
            onSuccess: () => {
                setIsStatusModalOpen(false);
            },
            onError: (error) => {
                showToast(
                    "error",
                    error.message ||
                    "No se pudo confirmar la cita."
                );
            },
        });
    };

    const handleStart = (id: string) => {
        startMutation.mutate(id, {
            onSuccess: () => {
                setIsStatusModalOpen(false);
            },
            onError: (error) => {
                showToast(
                    "error",
                    error.message ||
                    "No se pudo iniciar la cita."
                );
            },
        });
    };

    const handleComplete = (id: string) => {
        completeMutation.mutate(id, {
            onSuccess: () => {
                setIsStatusModalOpen(false);
            },
            onError: (error) => {
                showToast(
                    "error",
                    error.message ||
                    "No se pudo completar la cita."
                );
            },
        });
    };

    const handleNoShow = (id: string) => {
        noShowMutation.mutate(id, {
            onSuccess: () => {
                setIsStatusModalOpen(false);
            },
            onError: (error) => {
                showToast(
                    "error",
                    error.message ||
                    "No se pudo poner en no atendida la cita"
                );
            },
        });
    };

    const handleCancelSubmit = () => {
        if (!selectedAppointment || !cancelNotes.trim()) return;

        cancelMutation.mutate(
            {
                id: selectedAppointment.id,
                notes: cancelNotes,
            },
            {
                onSuccess: () => {
                    setCancelNotes("");
                    setIsCancelModalOpen(false);
                    setIsStatusModalOpen(false);
                },
                onError: (error) => {
                    showToast(
                        "error",
                        error.message ||
                        "No se pudo cancelar la cita."
                    );
                },
            }
        );
    };

    const canChangeStatus = (status: AppointmentModel["status"]) => {
        return [
            "SCHEDULED",
            "CONFIRMED",
            "IN_PROGRESS",
        ].includes(status);
    };

    const canConfirm = (status: AppointmentModel["status"]) =>
        status === "SCHEDULED";

    const canStart = (status: AppointmentModel["status"]) =>
        status === "CONFIRMED";

    const canComplete = (status: AppointmentModel["status"]) =>
        status === "IN_PROGRESS";

    const canNoShow = (status: AppointmentModel["status"]) =>
        status === "CONFIRMED";

    const canCancel = (status: AppointmentModel["status"]) =>
        status !== "COMPLETED" &&
        status !== "CANCELLED" &&
        status !== "NO_SHOW";

    const columns: TableColumn<typeof appointments[number]>[] = [
        {
            key: "patientFullName",
            header: "Paciente",
            className: "pl-2 w-80",
            render: (appointment: AppointmentModel) => (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-800">
                        {appointment.patientFullName}
                    </span>

                </div>
            ),
        },
        {
            key: "dentistFullName",
            header: "Dentista",
            className: "pl-2 w-80",
            render: (appointment: AppointmentModel) => (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-800">
                        {appointment.dentistFullName}
                    </span>

                </div>
            ),
        },
        {
            key: "startAppointmentTime",
            header: "Fecha de inicio",
            render: (appointment: AppointmentModel) => (
                <span className="text-sm text-slate-500">
                    {appointment.startAppointmentTime ? new Date(appointment.startAppointmentTime).toLocaleString("es-NI", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    }) : "N/A"}
                </span>
            ),
        },
        {
            key: "endAppointmentTime",
            header: "Fecha de finalización",
            render: (appointment: AppointmentModel) => (
                <span className="text-sm text-slate-500">
                    {appointment.endAppointmentTime ? new Date(
                        appointment.endAppointmentTime
                    ).toLocaleString("es-NI", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    }) : "N/A"}
                </span>
            ),
        },
        {
            key: "status",
            header: "Estado",
            render: (appointment: AppointmentModel) => (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-800">
                        {appointment.status}
                    </span>

                </div>
            ),
        },
        {
            key: "reminderSent",
            header: "Recordatorio Enviado",
            render: (appointment: AppointmentModel) => (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-800">
                        {appointment.reminderSent ? "Sí" : "No"}
                    </span>

                </div>
            ),
        },
    ];

    const actions: TableAction<typeof appointments[number]>[] = [
        {
            label: "Editar Cita",
            icon: <Pencil className="w-4 h-4" />,
            onClick: (appointment) => {
                setSelectedAppointment(appointment);
                setIsEditDrawerOpen(true);
            },
        },
        {
            label: "Cambios de estados",
            icon: <Menu className="w-4 h-4 text-amber-600" />,
            onClick: (appointment) => {
                setSelectedAppointment(appointment);
                setIsStatusModalOpen(true); // aca vamos a manejar cosas mas seguras como cambio de contraseña, role y demas.
            },
            hidden: (appointment) => !canChangeStatus(appointment.status),
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

    const isPendingAny =
        confirmMutation.isPending ||
        startMutation.isPending ||
        completeMutation.isPending ||
        cancelMutation.isPending ||
        noShowMutation.isPending;

    return (
        <div className="h-full w-full bg-[#f8fafc] p-8 flex flex-col justify-between select-none">
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                {/* Encabezado */}
                <div className="flex items-center justify-between pb-6 mb-2">
                    {/* <h1 className="text-xl font-bold text-[#001D4A]">Productos</h1> */}
                    <SearchInput
                        value={search}
                        onChange={handleSearch}
                        placeholder="Buscar cita..."
                    />
                    <button onClick={() => setIsCreateDrawerOpen(true)} className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-500/20 cursor-pointer">
                        <Plus className="w-4 h-4" />
                        <span>Nueva Cita</span>
                    </button>
                </div>

                {/* Tabla de Citas */}
                <div className="overflow-x-auto">
                    <DataTable
                        data={currentProducts}
                        columns={columns}
                        actions={actions}
                        getRowId={(appointment) => appointment.id}
                        emptyMessage="No hay Citas registradas."
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
                    label="Citas"
                />
            </div>

            <CreateAppointmentDrawer isOpen={isCreateDrawerOpen} onHide={() => setIsCreateDrawerOpen(false)} />

            <EditAppointmentDrawer
                isOpen={isEditDrawerOpen}
                onHide={() => {
                    setIsEditDrawerOpen(false);
                    setSelectedAppointment(null);
                }}
                appointment={selectedAppointment}
            />

            {/* MODAL CAMBIAR ESTADO */}
            {isStatusModalOpen && selectedAppointment && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-800">
                                    Acciones Rápidas
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Estado actual:{" "}
                                    <span className="font-medium text-slate-700">
                                        {selectedAppointment.status}
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

                        <div className="p-3 space-y-1">

                            {/* SCHEDULED -> CONFIRMED */}
                            {canConfirm(selectedAppointment.status) && (
                                <button
                                    disabled={isPendingAny}
                                    onClick={() => handleConfirm(selectedAppointment.id)}
                                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span>Confirmar Cita</span>
                                </button>
                            )}

                            {/* CONFIRMED -> IN_PROGRESS */}
                            {canStart(selectedAppointment.status) && (
                                <button
                                    disabled={isPendingAny}
                                    onClick={() => handleStart(selectedAppointment.id)}
                                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    <Play className="w-4 h-4 text-blue-600" />
                                    <span>Iniciar Cita (En curso)</span>
                                </button>
                            )}

                            {/* IN_PROGRESS -> COMPLETED */}
                            {canComplete(selectedAppointment.status) && (
                                <button
                                    disabled={isPendingAny}
                                    onClick={() => handleComplete(selectedAppointment.id)}
                                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    <Check className="w-4 h-4 text-indigo-600" />
                                    <span>Completar Cita</span>
                                </button>
                            )}

                            {/* CONFIRMED -> NO_SHOW */}
                            {canNoShow(selectedAppointment.status) && (
                                <button
                                    disabled={isPendingAny}
                                    onClick={() => handleNoShow(selectedAppointment.id)}
                                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    <UserX className="w-4 h-4 text-amber-600" />
                                    <span>Marcar No Asistió (No Show)</span>
                                </button>
                            )}

                            {/* CANCELAR */}
                            {canCancel(selectedAppointment.status) && (
                                <>
                                    <div className="my-1 border-t border-slate-100" />

                                    <button
                                        disabled={isPendingAny}
                                        onClick={() => setIsCancelModalOpen(true)}
                                        className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50 font-medium"
                                    >
                                        <XCircle className="w-4 h-4 text-rose-600" />
                                        <span>Cancelar Cita</span>
                                    </button>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            )}

            {/* MODAL NOTA DE CANCELACIÓN */}
            {isCancelModalOpen && selectedAppointment && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-60 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-slate-800 text-lg">
                                Cancelar Cita
                            </h3>
                            <button
                                onClick={() => setIsCancelModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-sm text-slate-600">
                            Ingresa el motivo por el cual se cancela la cita para guardar el registro:
                        </p>

                        <textarea
                            value={cancelNotes}
                            onChange={(e) => setCancelNotes(e.target.value)}
                            placeholder="Escribe la razón (ej. Solicitud del paciente, emergencia dental, etc.)..."
                            rows={4}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                        />

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setIsCancelModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                Volver
                            </button>
                            <button
                                onClick={handleCancelSubmit}
                                disabled={!cancelNotes.trim() || cancelMutation.isPending}
                                className="px-4 py-2 text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors disabled:opacity-50"
                            >
                                {cancelMutation.isPending
                                    ? "Canceling..."
                                    : "Confirmar Cancelación"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AppointmentPage;