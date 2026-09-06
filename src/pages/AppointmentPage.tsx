import React, { useMemo, useState } from "react";
import { Plus, Eye, Pencil, Watch } from "lucide-react";
import type { TableAction, TableColumn } from "../shared/Table/types";
import DataTable from "../shared/Table/DataTable";
import Pagination from "../shared/Table/Pagination";
import { useTableSearch } from "../shared/Table/useTableSearch";
import SearchInput from "../shared/Table/SearchInput";
import { useAppointments } from "../hooks/useAppointment";
import type AppointmentModel from "../models/AppointmentModel";
import CreateAppointmentDrawer from "../components/appointment/CreateAppointmentDrawer";
import EditAppointmentDrawer from "../components/appointment/EditAppointmentDrawet";

const AppointmentPage: React.FC = () => {
    const {
        data: appointments = []
    } = useAppointments();

    const [isCreateDrawerOpen, setIsCreateDrawerOpen] =
        useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] =
        useState(false);
    const [isSecurityDrawerOpen, setIsSecurityDrawerOpen] =
        useState(false);

    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentModel | null>(null);

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
            label: "Ver Cita",
            icon: <Eye className="w-4 h-4" />,
            onClick: (appointment) => {
                console.log("Ver:", appointment);
            },
        },
        {
            label: "Credenciales y Seguridad",
            icon: <Watch className="w-4 h-4 text-amber-600" />,
            onClick: (appointment) => {
                setSelectedAppointment(appointment);
                setIsSecurityDrawerOpen(true); // aca vamos a manejar cosas mas seguras como cambio de contraseña, role y demas.
            },
        },
        {
            label: "Editar Cita",
            icon: <Pencil className="w-4 h-4" />,
            onClick: (appointment) => {
                setSelectedAppointment(appointment);
                setIsEditDrawerOpen(true);
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

            {/*  
      <ExpiredLoteDrawer
        // key={selectedAppointment?.id ?? "new"}
        isOpen={isSecurityDrawerOpen}
        onHide={() => {
          setIsSecurityDrawerOpen(false);
          setSelectedAppointment(null);
        }}
        lote={selectedAppointment}
      /> */}
        </div>
    );
}

export default AppointmentPage;