import React, { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Pencil, Menu, X, CheckCircle2, Play, Check, UserX, XCircle } from "lucide-react";
import type { TableAction, TableColumn } from "../shared/Table/types";
import DataTable from "../shared/Table/DataTable";
import Pagination from "../shared/Table/Pagination";
import { useTableSearch } from "../shared/Table/useTableSearch";
import SearchInput from "../shared/Table/SearchInput";
import { useAbandonedAppointment, useAppointments } from "../hooks/useAppointment";
import type AppointmentModel from "../models/AppointmentModel";
import CreateAppointmentDrawer from "../components/appointment/CreateAppointmentDrawer";
import EditAppointmentDrawer from "../components/appointment/EditAppointmentDrawer";
import Toast from "../shared/Toast";
import useAppointmentPage from "../components/appointment/useAppointmentPage";
import CreateClinicalProgressDrawer from "../components/medical/CreateClinicalProgressDrawer";
import type { AppointmentStatus } from "../utils/appointmentStatus.enum";
import TableSkeleton from "../components/skeleton/TableSkeleton";
import { useRolePermissions, UserRole } from "../hooks/useRolePermitions";
import { useAppointmentOrchestratorById } from "../hooks/useAppointmentOrchestrator";
import { useNotifications } from "../hooks/usenotifications";

const AppointmentPage: React.FC = () => {
    const { role, user } = useRolePermissions();
    const {
        data: appointments = [],
        isLoading,
    } = useAppointments();

    const markAsAbandonedMutation = useAbandonedAppointment();

    const processingAppointmentIdsRef = useRef(new Set<string>());

    const { addNotification, removeNotification } = useNotifications();

    const {
        isCreateDrawerOpen,
        setIsCreateDrawerOpen,

        isEditDrawerOpen,
        setIsEditDrawerOpen,

        isStatusModalOpen,
        setIsStatusModalOpen,

        isCancelModalOpen,
        setIsCancelModalOpen,

        selectedAppointment,
        setSelectedAppointment,

        cancelNotes,
        setCancelNotes,

        toast,
        setToast,
        cancelMutation,

        handleConfirm,
        handleStart,
        handleComplete,
        handleNoShow,
        handleCancelSubmit,

        canChangeStatus,
        canConfirm,
        canStart,
        canComplete,
        canNoShow,
        canCancel,

        isPendingAny,

        isClinicalProgressDrawerOpen,
        setIsClinicalProgressDrawerOpen,
        handleCreateClinicalProgress
    } = useAppointmentPage();

    const {
        data: appointmentDetails,
        isLoading: isLoadingAppointmentDetails,
    } = useAppointmentOrchestratorById(
        selectedAppointment?.id || ""
    );

    const isViewer = role === UserRole.Viewer;
    const canWrite = !isViewer;

    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    type AppointmentPeriod = "ALL" | "DAY" | "WEEK" | "MONTH";

    const [selectedPeriod, setSelectedPeriod] =
        useState<AppointmentPeriod>("ALL");

    const [selectedStatus, setSelectedStatus] =
        useState<AppointmentStatus | "ALL">("ALL");

    const searchFields: (keyof AppointmentModel)[] = [
        "patientFullName",
        "dentistFullName",
        "startAppointmentTime",
        "endAppointmentTime",
        "status",
        "reminderSent",
    ];

    const handleStartAppointment = () => {
        if (!selectedAppointment) {
            return;
        }

        const selectedStartDate = new Date(
            selectedAppointment.startAppointmentTime
        );

        if (Number.isNaN(selectedStartDate.getTime())) {
            setToast({
                type: "error",
                message: "La fecha de inicio de la cita no es válida.",
            });

            return;
        }

        // Buscar otras citas del mismo especialista
        const dentistAppointments = appointments.filter(
            (appointment) =>
                appointment.dentistId === selectedAppointment.dentistId &&
                appointment.id !== selectedAppointment.id
        );

        // Validación 1:
        // El especialista no puede tener otra cita en progreso.
        const dentistHasAppointmentInProgress = dentistAppointments.some(
            (appointment) => appointment.status === "IN_PROGRESS"
        );

        if (dentistHasAppointmentInProgress) {
            setToast({
                type: "error",
                message:
                    "Este especialista ya tiene una cita en progreso. Debe completarla o abortarla antes de iniciar otra.",
            });

            return;
        }

        // Validación 2:
        // No puede iniciar una cita si tiene una cita anterior
        // que todavía no se ha completado ni abortado.
        const previousUnresolvedAppointment = dentistAppointments.find(
            (appointment) => {
                const previousStartDate = new Date(
                    appointment.startAppointmentTime
                );

                const hasValidDate = !Number.isNaN(
                    previousStartDate.getTime()
                );

                const isEarlierAppointment =
                    hasValidDate &&
                    previousStartDate < selectedStartDate;

                const isUnresolved =
                    appointment.status === "SCHEDULED" ||
                    appointment.status === "CONFIRMED" ||
                    appointment.status === "IN_PROGRESS";

                return isEarlierAppointment && isUnresolved;
            }
        );

        if (previousUnresolvedAppointment) {
            const previousDate = new Date(
                previousUnresolvedAppointment.startAppointmentTime
            );

            setToast({
                type: "error",
                message: `No puede iniciar esta cita porque el especialista todavía tiene una cita anterior con ${previousUnresolvedAppointment.patientFullName}, programada para el ${previousDate.toLocaleString("es-NI")}. Debe completarla, abortarla o reprogramarla antes de continuar.`,
            });

            return;
        }

        // Si ambas validaciones pasan, iniciar la cita.
        handleStart(selectedAppointment.id);
    };

    // const filteredAppointments = useMemo(() => {
    //     if (role === UserRole.Admin || role === UserRole.Receptionist) {
    //         return appointments;
    //     }

    //     return appointments.filter(
    //         (appointment) => appointment.dentistId === user?.id
    //     );
    // }, [appointments, role, user?.roleId]);

    // const {
    //     search,
    //     setSearch,
    //     filteredData,
    // } = useTableSearch<AppointmentModel>({
    //     data: filteredAppointments,
    //     fields: searchFields,
    //     delay: 800,
    // });


    const filteredAppointments = useMemo(() => {
        if (role === UserRole.Admin || role === UserRole.Receptionist) {
            return appointments;
        }

        return appointments.filter(
            (appointment) => appointment.dentistId === user?.id
        );
    }, [appointments, role, user?.id]);

    const appointmentsByFilters = useMemo(() => {
        const now = new Date();

        // Inicio del día actual
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        // Inicio del día siguiente
        const startOfTomorrow = new Date(startOfDay);
        startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

        // Inicio de la semana: lunes
        const startOfWeek = new Date(startOfDay);
        const dayOfWeek = startOfWeek.getDay();

        startOfWeek.setDate(
            startOfWeek.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
        );

        // Inicio de la próxima semana
        const startOfNextWeek = new Date(startOfWeek);
        startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);

        // Inicio del mes actual
        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        // Inicio del próximo mes
        const startOfNextMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
        );

        return filteredAppointments.filter((appointment) => {
            const appointmentDate = new Date(
                appointment.startAppointmentTime
            );

            // Filtro por período
            let matchesPeriod = true;

            if (selectedPeriod !== "ALL") {
                if (Number.isNaN(appointmentDate.getTime())) {
                    matchesPeriod = false;
                } else {
                    switch (selectedPeriod) {
                        case "DAY":
                            matchesPeriod =
                                appointmentDate >= startOfDay &&
                                appointmentDate < startOfTomorrow;
                            break;

                        case "WEEK":
                            matchesPeriod =
                                appointmentDate >= startOfWeek &&
                                appointmentDate < startOfNextWeek;
                            break;

                        case "MONTH":
                            matchesPeriod =
                                appointmentDate >= startOfMonth &&
                                appointmentDate < startOfNextMonth;
                            break;
                    }
                }
            }

            // Filtro por estado
            const matchesStatus =
                selectedStatus === "ALL" ||
                appointment.status === selectedStatus;

            return matchesPeriod && matchesStatus;
        });
    }, [filteredAppointments, selectedPeriod, selectedStatus]);

    const {
        search,
        setSearch,
        filteredData,
    } = useTableSearch<AppointmentModel>({
        data: appointmentsByFilters,
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

    const isDisabled = !canWrite || role === UserRole.Dentist; //no tiene permisos de escritura o es dentista
    const cantRegistermedicalProgress = !canWrite || role === UserRole.Admin; //no tiene permisos de escritura o es dentista

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

    const appointmentStatusConfig: Record<
        AppointmentStatus,
        { label: string; className: string }
    > = {
        SCHEDULED: {
            label: "Programada",
            className: "text-indigo-600",
        },
        CONFIRMED: {
            label: "Confirmada",
            className: "text-blue-600",
        },
        IN_PROGRESS: {
            label: "En progreso",
            className: "text-amber-600",
        },
        COMPLETED: {
            label: "Completada",
            className: "text-emerald-600",
        },
        ABANDONED: {
            label: "Abandonada",
            className: "text-gray-600",
        },
        CANCELLED: {
            label: "Abortada",
            className: "text-red-600",
        },
        NO_SHOW: {
            label: "No asistió",
            className: "text-slate-500",
        },
    };

    const columns: TableColumn<typeof appointments[number]>[] = [
        {
            key: "patientFullName",
            header: "Paciente",
            className: "pl-2 w-40 md:w-60",
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
            header: "Especialista",
            className: "pl-2 w-40 md:w-60",
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
            className: "w-24 md:w-50",
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
            className: "w-24 md:w-50",
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
            className: "w-24 md:w-30",
            render: (appointment: AppointmentModel) => {
                const status = appointmentStatusConfig[appointment.status];

                return (
                    <div className="flex items-center gap-3">
                        <span className={`text-sm font-semibold ${status.className}`}>
                            {status.label}
                        </span>
                    </div>
                );
            },
        },
        // {
        //     key: "reminderSent",
        //     className: "w-20",
        //     header: "Recordatorio Enviado",
        //     render: (appointment: AppointmentModel) => (
        //         <div className="flex items-center gap-3">
        //             <span className="text-sm font-semibold text-slate-800">
        //                 {appointment.reminderSent ? "Sí" : "No"}
        //             </span>

        //         </div>
        //     ),
        // },
    ];

    const actions: TableAction<typeof appointments[number]>[] = [
        // {
        //     label: "Marcar recordatorio como enviado",
        //     icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
        //     onClick: (appointment) => {
        //         markReminderAsSentMutation.mutate(appointment.id);
        //     },
        //     hidden: (appointment) =>
        //         !canWrite || appointment.reminderSent ||
        //         appointment.status === "COMPLETED" ||
        //         appointment.status === "CANCELLED",
        // },
        {
            label: "Editar Cita",
            icon: <Pencil className="w-4 h-4" />,
            onClick: (appointment) => {
                setSelectedAppointment(appointment);
                setIsEditDrawerOpen(true);
            },
            hidden: (appointment) => !canWrite || appointment.status === "CANCELLED" || appointment.status === "COMPLETED" || appointment.isInvoiced || role === UserRole.Dentist,
        },
        {
            label: "Cambios de estados",
            icon: <Menu className="w-4 h-4 text-amber-600" />,
            onClick: (appointment) => {
                setSelectedAppointment(appointment);
                setIsStatusModalOpen(true); // aca vamos a manejar cosas mas seguras como cambio de contraseña, role y demas.
            },
            hidden: (appointment) => {
                /*
                 * El menú aparece para citas que todavía
                 * permiten cambios de estado.
                 *
                 * También aparece para COMPLETED porque
                 * desde ahí podemos crear la receta.
                 */
                return cantRegistermedicalProgress || !canChangeStatus(appointment.status) || appointment?.isClinicalProgressRegistered;
            },
        },
    ];

    const handleCompleteAppointment = () => {
        if (!selectedAppointment) {
            return;
        }

        // ============================================================
        // CITA CON PLAN DE TRATAMIENTO
        // ============================================================

        if (selectedAppointment.treatmentPlanId) {
            const treatmentDetails =
                appointmentDetails?.treatmentPlanDetails ?? [];

            const allTreatmentsFinished =
                treatmentDetails.length > 0 &&
                treatmentDetails.every(
                    (detail) =>
                        detail.status === "COMPLETED" ||
                        detail.status === "CANCELLED"
                );

            if (!allTreatmentsFinished) {
                setToast({
                    type: "error",
                    message:
                        "Todos los tratamientos deben estar completados o abortados antes de completar la cita.",
                });

                return;
            }
        }

        if (!selectedAppointment.isInvoiced) {
            setToast({
                type: "error",
                message:
                    "Debe generar la factura antes de marcar como completada.",
            });

            return;
        }

        // ============================================================
        // SI TODO ESTÁ CORRECTO
        // ============================================================

        handleComplete(selectedAppointment.id);
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

        appointments.forEach((appointment) => {
            const notificationId = `abandoned-appointment-${appointment.id}`;

            if (appointment.status === "ABANDONED") {
                const startDate = new Date(
                    appointment.startAppointmentTime
                );

                addNotification({
                    id: notificationId,
                    title: "Cita abandonada pendiente de revisión",
                    message: `La cita del paciente ${appointment.patientFullName}, programada para ${startDate.toLocaleString("es-NI")}, fue marcada como abandonada. Revise la cita y determine si requiere seguimiento.`,
                    type: "warning",
                    entityType: "appointment",
                    entityId: appointment.id,
                    actionUrl: "/agenda",
                });
            } else {
                // Si la cita ya no está abandonada, retirar la notificación.
                removeNotification(notificationId);
            }
        });
    }, [
        appointments,
        isLoading,
        addNotification,
        removeNotification,
    ]);


    useEffect(() => {
        if (isLoading || appointments.length === 0) return;

        const checkAbandonedAppointments = () => {
            const now = Date.now();
            const oneHourInMs = 60 * 60 * 1000;

            appointments.forEach((appointment) => {
                // Solo citas programadas o confirmadas.
                if (
                    appointment.status !== "SCHEDULED" &&
                    appointment.status !== "CONFIRMED"
                ) {
                    return;
                }

                const startTime = new Date(
                    appointment.startAppointmentTime
                ).getTime();

                // Ignorar fechas inválidas.
                if (Number.isNaN(startTime)) return;

                // Debe haber pasado al menos una hora desde el inicio.
                if (now - startTime < oneHourInMs) return;

                // Evitar ejecutar la misma mutación más de una vez simultáneamente.
                if (
                    processingAppointmentIdsRef.current.has(appointment.id)
                ) {
                    return;
                }

                processingAppointmentIdsRef.current.add(appointment.id);

                markAsAbandonedMutation.mutate(appointment.id, {
                    onSettled: () => {
                        processingAppointmentIdsRef.current.delete(
                            appointment.id
                        );
                    },
                });
            });
        };

        // Revisar inmediatamente al cargar las citas.
        checkAbandonedAppointments();

        // Volver a revisar cada minuto.
        const intervalId = window.setInterval(
            checkAbandonedAppointments,
            60_000
        );

        return () => {
            window.clearInterval(intervalId);
        };
    }, [
        appointments,
        isLoading,
        markAsAbandonedMutation.mutate,
    ]);

    return (
        <div className="h-full w-full bg-[#f8fafc] px-8 py-4 flex flex-col justify-between select-none">
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                {/* Encabezado */}
                <div className="flex flex-col md:flex-row gap-2 items-end md:items-center justify-between mb-2">
                    {/* <h1 className="text-xl font-bold text-[#001D4A]">Productos</h1> */}
                    <SearchInput
                        value={search}
                        onChange={handleSearch}
                        placeholder="Buscar cita..."
                    />
                    <button disabled={isDisabled} onClick={() => setIsCreateDrawerOpen(true)}
                        className={`flex items-center gap-2 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-500/20 ${isDisabled
                            ? "bg-slate-300 cursor-not-allowed opacity-70"
                            : "bg-[#2563eb] hover:bg-blue-700 cursor-pointer"
                            }`}>
                        <Plus className="w-4 h-4" />
                        <span>Nueva Cita</span>
                    </button>
                </div>

                {/* Filtros por período */}
                <div className="flex flex-row gap-4">
                    <div>
                        <p className="text-sm font-semibold text-slate-700 mb-3">
                            Filtrar por período
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {[
                                { value: "ALL", label: "Todas" },
                                { value: "DAY", label: "Hoy" },
                                { value: "WEEK", label: "Esta semana" },
                                { value: "MONTH", label: "Este mes" },
                            ].map((period) => (
                                <button
                                    key={period.value}
                                    type="button"
                                    onClick={() => {
                                        setSelectedPeriod(
                                            period.value as AppointmentPeriod
                                        );
                                        setCurrentPage(1);
                                    }}
                                    className={`p-2 rounded-lg text-sm font-medium
                                            border transition-colors cursor-pointer
                                            ${selectedPeriod === period.value
                                            ? "bg-[#001D4A] text-white border-[#001D4A]"
                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    {period.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filtros por estado */}
                    <div>
                        <p className="text-sm font-semibold text-slate-700 mb-3">
                            Filtrar por estado
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {[
                                { value: "ALL", label: "Todos los estados" },
                                { value: "SCHEDULED", label: "Programadas" },
                                { value: "CONFIRMED", label: "Confirmadas" },
                                { value: "IN_PROGRESS", label: "En progreso" },
                                { value: "COMPLETED", label: "Completadas" },
                                { value: "ABANDONED", label: "Abandonadas" },
                                { value: "CANCELLED", label: "Abortadas" },
                                { value: "NO_SHOW", label: "No asistió" },
                            ].map((status) => (
                                <button
                                    key={status.value}
                                    type="button"
                                    onClick={() => {
                                        setSelectedStatus(
                                            status.value as AppointmentStatus | "ALL"
                                        );
                                        setCurrentPage(1);
                                    }}
                                    className={`p-2 rounded-lg text-xs sm:text-sm
                                            font-medium border transition-colors cursor-pointer
                                            ${selectedStatus === status.value
                                            ? "bg-blue-50 text-blue-700 border-blue-300"
                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabla de Citas */}
                <div className="overflow-x-auto max-h-100 ">
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
                            getRowId={(appointment) => appointment.id}
                            emptyMessage="No hay Citas registradas."
                        />
                    )}
                </div>
            </div>

            {/* Paginación de la Tabla */}
            <div className="flex items-center justify-between text-xs text-slate-500">
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
                                        {appointmentStatusConfig[selectedAppointment.status].label}
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

                            {selectedAppointment.status === "COMPLETED" && (
                                <button
                                    onClick={() =>
                                        handleCreateClinicalProgress(
                                            selectedAppointment
                                        )
                                    }
                                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    <Plus className="w-4 h-4 text-emerald-600" />

                                    <span>Registrar progreso en expediente</span>
                                </button>
                            )}

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
                                    onClick={handleStartAppointment}
                                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-slate-700 hover:bg-blue-100 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    <Play className="w-4 h-4 text-blue-600" />
                                    <span>Iniciar Cita (En curso)</span>
                                </button>
                            )}

                            {/* IN_PROGRESS -> COMPLETED */}
                            {canComplete(selectedAppointment.status) && (
                                <button
                                    disabled={
                                        isPendingAny ||
                                        isLoadingAppointmentDetails
                                    }
                                    onClick={handleCompleteAppointment}
                                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-slate-700 hover:bg-indigo-100 rounded-xl transition-colors disabled:opacity-50"
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
                                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-slate-700 hover:bg-amber-100 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    <UserX className="w-4 h-4 text-amber-600" />
                                    <span>Marcar No Asistió </span>
                                </button>
                            )}

                            {/* Abortar */}
                            {canCancel(selectedAppointment.status) && (
                                <>
                                    <div className="my-1 border-t border-slate-100" />

                                    <button
                                        disabled={isPendingAny}
                                        onClick={() => setIsCancelModalOpen(true)}
                                        className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50 font-medium"
                                    >
                                        <XCircle className="w-4 h-4 text-rose-600" />
                                        <span>Abortar Cita</span>
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
                                Abortar Cita
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

            <CreateClinicalProgressDrawer
                isOpen={isClinicalProgressDrawerOpen}
                onHide={() => {
                    setIsClinicalProgressDrawerOpen(false);
                    setSelectedAppointment(null);
                }}
                appointment={selectedAppointment}
            />
        </div>
    );
}

export default AppointmentPage;