import React, { useMemo, useState } from "react";
import { Eye } from "lucide-react";
import type { TableAction, TableColumn } from "../shared/Table/types";
import DataTable from "../shared/Table/DataTable";
import Pagination from "../shared/Table/Pagination";
import { useTableSearch, type SearchField } from "../shared/Table/useTableSearch";
import SearchInput from "../shared/Table/SearchInput";
// import ConfirmModal from "../shared/ConfirmModal";
import { useMedicalPrescriptionsOrchestrator } from "../hooks/useMedicalPrescriptionOrchestrator";
import type { MedicalPrescriptionOrchestratorResponse } from "../models/MedicalPrescriptionOrchestratorModel";
import ShowDetailsMedicalPrescriptionDrawer from "../components/medicalPrescription/ShowDetailsMedicalPrescriptionDrawer";

const PrescriptionsPage: React.FC = () => {
    const {
        data: prescriptions = []
    } = useMedicalPrescriptionsOrchestrator();

    const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] =
        useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState<MedicalPrescriptionOrchestratorResponse | null>(null);

    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const searchFields: SearchField<MedicalPrescriptionOrchestratorResponse>[] = [
        "medicalPrescription.patientFullName",
        "medicalPrescription.dentistFullName",
        "medicalPrescription.date",
    ];

    const {
        search,
        setSearch,
        filteredData,
    } = useTableSearch<MedicalPrescriptionOrchestratorResponse>({
        data: prescriptions,
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

    const columns: TableColumn<typeof prescriptions[number]>[] = [
        {
            key: "patientFullName",
            header: "Paciente",
            className: "pl-2 w-100",
            render: (prescription: MedicalPrescriptionOrchestratorResponse) => (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-800">
                        {prescription.medicalPrescription.patientFullName}
                    </span>

                </div>
            ),
        },

        {
            key: "dentistFullName",
            header: "Dentista",
            render: (prescription: MedicalPrescriptionOrchestratorResponse) => (
                <span className="text-sm text-slate-500">
                    {prescription.medicalPrescription.dentistFullName}
                </span>
            ),
        },
        {
            key: "date",
            header: "Fecha de emisión",
            className: "w-100",
            render: (prescription: MedicalPrescriptionOrchestratorResponse) => (
                <span className="text-sm text-slate-500">
                    {prescription.medicalPrescription.date ? new Date(prescription.medicalPrescription.date).toLocaleString("es-NI", {
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
            key: "medicine",
            header: "Cantidad de productos recetados",
            render: (prescription: MedicalPrescriptionOrchestratorResponse) => (
                <span className="text-sm text-slate-500">
                    {prescription.details.length}
                </span>
            ),
        },
    ];

    const actions: TableAction<typeof prescriptions[number]>[] = [
        {
          label: "Ver receta",
          icon: <Eye className="w-4 h-4" />,
          onClick: (prescription) => {
            setSelectedPrescription(prescription);
            setIsDetailsDrawerOpen(true);
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
                        placeholder="Buscar recetas..."
                    />
                </div>

                {/* Tabla de Productos */}
                <div className="overflow-x-auto">
                    <DataTable
                        data={currentProducts}
                        columns={columns}
                        actions={actions}
                        getRowId={(prescription) => prescription.medicalPrescription.id}
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

            <ShowDetailsMedicalPrescriptionDrawer isOpen={isDetailsDrawerOpen} onHide={()=> setIsDetailsDrawerOpen(false)} prescription={selectedPrescription} />
        </div>
    );
}

export default PrescriptionsPage;