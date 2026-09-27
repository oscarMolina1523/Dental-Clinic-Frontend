import React, { useMemo, useState } from "react";
import { Folder } from "lucide-react";
import Pagination from "../shared/Table/Pagination";
import { useTableSearch } from "../shared/Table/useTableSearch";
import SearchInput from "../shared/Table/SearchInput";
import type PatientModel from "../models/PatientModel";
import { usePatients } from "../hooks/usePatients";
import ShowClinicalProgressDrawer from "../components/medical/ShowClinicalProgressDrawer";

const MedicalProgressPage: React.FC = () => {
    const {
        data: patients = [],
    } = usePatients();

    const [selectedPatient, setSelectedPatient] =
        useState<PatientModel | null>(null);

    const [isClinicalProgressDrawerOpen, setIsClinicalProgressDrawerOpen] =
        useState(false);

    const ITEMS_PER_PAGE = 12;

    const [currentPage, setCurrentPage] = useState(1);

    const searchFields: (keyof PatientModel)[] = [
        "name",
        "lastName",
        "patientCode",
        "idCard",
        "phoneNumber",
        "email",
    ];

    const {
        search,
        setSearch,
        filteredData,
    } = useTableSearch<PatientModel>({
        data: patients,
        fields: searchFields,
        delay: 800,
    });

    const totalItems = filteredData.length;

    const totalPages = Math.max(
        1,
        Math.ceil(totalItems / ITEMS_PER_PAGE)
    );

    const validPage = Math.min(
        currentPage,
        totalPages
    );

    const startIndex =
        (validPage - 1) * ITEMS_PER_PAGE;

    const endIndex =
        startIndex + ITEMS_PER_PAGE;

    const currentPatients = useMemo(
        () =>
            filteredData.slice(
                startIndex,
                endIndex
            ),
        [startIndex, endIndex, filteredData]
    );

    const getFullName = (patient: PatientModel): string => {
        return `${patient.name} ${patient.lastName}`;
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleOpenPatient = (patient: PatientModel) => {
        setSelectedPatient(patient);
        setIsClinicalProgressDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsClinicalProgressDrawerOpen(false);
        setSelectedPatient(null);
    };

    return (
        <div className="h-full w-full bg-[#f8fafc] p-8 flex flex-col select-none">

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex-1 flex flex-col">

                {/* Encabezado */}
                <div className="flex items-center justify-between pb-6 mb-2">
                    <SearchInput
                        value={search}
                        onChange={handleSearch}
                        placeholder="Buscar paciente..."
                    />
                </div>

                {/* Grid de expedientes */}
                <div className="flex-1">

                    {currentPatients.length === 0 ? (

                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <Folder className="w-12 h-12 text-slate-300 mx-auto mb-3" />

                                <p className="text-sm text-slate-500">
                                    No hay pacientes registrados.
                                </p>
                            </div>
                        </div>

                    ) : (

                        <div
                            className="
                grid
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-5
                xl:grid-cols-6
                gap-x-8
                gap-y-8
                pt-4
              "
                        >

                            {currentPatients.map((patient) => (

                                <button
                                    key={patient.id}
                                    type="button"
                                    onClick={() =>
                                        handleOpenPatient(patient)
                                    }
                                    className="
                    group
                    flex
                    flex-col
                    items-center
                    justify-center
                    rounded-xl
                    p-4
                    transition-all
                    hover:bg-slate-50
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-200
                    cursor-pointer
                  "
                                >

                                    {/* Carpeta */}
                                    <div className="relative">

                                        {/* Pestaña de la carpeta */}
                                        <div
                                            className="
                        absolute
                        left-1
                        top-0
                        w-10
                        h-3
                        rounded-t-md
                        bg-amber-400
                        group-hover:bg-amber-500
                        transition-colors
                      "
                                        />

                                        {/* Cuerpo de la carpeta */}
                                        <div
                                            className="
                        relative
                        mt-2
                        w-28
                        h-20
                        rounded-lg
                        bg-amber-300
                        group-hover:bg-amber-400
                        shadow-sm
                        group-hover:shadow-md
                        transition-all
                      "
                                        >

                                            <div
                                                className="
                          absolute
                          inset-x-0
                          bottom-0
                          h-3
                          rounded-b-lg
                          bg-amber-400/60
                        "
                                            />

                                            <Folder
                                                className="
                          absolute
                          inset-0
                          m-auto
                          w-10
                          h-10
                          text-amber-600
                        "
                                                strokeWidth={1.7}
                                            />

                                        </div>

                                    </div>

                                    {/* Nombre del paciente */}
                                    <div className="mt-3 w-full text-center">

                                        <p
                                            className="
                        text-sm
                        font-semibold
                        text-slate-700
                        truncate
                      "
                                            title={getFullName(patient)}
                                        >
                                            {getFullName(patient)}
                                        </p>

                                        <p className="text-xs text-slate-400 mt-1 truncate">
                                            {patient.idCard}
                                        </p>

                                    </div>

                                </button>

                            ))}

                        </div>

                    )}

                </div>
                <ShowClinicalProgressDrawer
                    isOpen={isClinicalProgressDrawerOpen}
                    onHide={handleCloseDrawer}
                    patient={selectedPatient}
                />

            </div>

            {/* Paginación */}
            <div className="flex items-center justify-between pt-4 px-2 text-xs text-slate-500">

                <Pagination
                    currentPage={validPage}
                    totalItems={totalItems}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                    label="expedientes"
                />

            </div>

        </div>
    );
};

export default MedicalProgressPage;