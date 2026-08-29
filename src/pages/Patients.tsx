import React, { useMemo, useState } from "react";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import type { TableAction, TableColumn } from "../shared/Table/types";
import DataTable from "../shared/Table/DataTable";
import Pagination from "../shared/Table/Pagination";
import { useTableSearch } from "../shared/Table/useTableSearch";
import SearchInput from "../shared/Table/SearchInput";
import type PatientModel from "../models/PatientModel";
import { patientsMock } from "../data/patientData";

const PatientsPage: React.FC = () => {
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const searchFields: (keyof PatientModel)[] = [
    "name",
    "lastName",
    "patientCode",
    "idCard",
    "gender",
    "phoneNumber",
    "active",
    "email",
    "maritalStatus",
  ];

  const {
    search,
    setSearch,
    filteredData,
  } = useTableSearch<PatientModel>({
    data: patientsMock,
    fields: searchFields,
    delay: 800,
  });


  const totalItems = filteredData.length; //obtenemos la cantidad total de items 

  // Calculamos el total de páginas disponibles y obtenemos una página válida,
  // evitando que currentPage apunte a una página que ya no existe, por ejemplo,
  // después de eliminar el último usuario de la página actual.
  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / ITEMS_PER_PAGE)
  );

  const validPage = Math.min(
    currentPage,
    totalPages
  );

  //para obtener solo los pacientes que queremos por pagina, los visibles
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;

  const endIndex = startIndex + ITEMS_PER_PAGE;

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

  const columns: TableColumn<typeof patientsMock[number]>[] = [
    {
      key: "name",
      header: "Nombre",
      className: "pl-2 w-100",
      render: (patient: PatientModel) => (
        <div className="flex items-center gap-3">

          <img
            src={patient.image}
            alt={patient.name}
            className="w-9 h-9 rounded-full object-cover border border-slate-200"
          />

          <span className="text-sm font-semibold text-slate-800">
            {getFullName(patient)}
          </span>

        </div>
      ),
    },

    {
      key: "phone",
      header: "Teléfono",
      render: (patient: PatientModel) => (
        <span className="text-sm text-slate-500">
          {patient.phoneNumber}
        </span>
      ),
    },
    {
      key: "gender",
      header: "Género",
      render: (patient: PatientModel) => (
        <span className="text-sm text-slate-500">
          {patient.gender}
        </span>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (patient: PatientModel) => (
        <span className="text-sm text-slate-500">
          {patient.email}
        </span>
      ),
    },
    {
      key: "maritalStatus",
      header: "Estado Civil",
      render: (patient: PatientModel) => (
        <span className="text-sm text-slate-500">
          {patient.maritalStatus}
        </span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (patient: PatientModel) => (
        patient.active ? (
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

  const actions: TableAction<typeof patientsMock[number]>[] = [
    {
      label: "Ver paciente",
      icon: <Eye className="w-4 h-4" />,
      onClick: (patient) => {
        console.log("Ver:", patient);
      },
    },

    {
      label: "Editar paciente",
      icon: <Pencil className="w-4 h-4" />,
      onClick: (patient) => {
        console.log("Editar:", patient);
      },
    },

    {
      label: "Eliminar paciente",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (patient) => {
        console.log("Eliminar:", patient);
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
          {/* <h1 className="text-xl font-bold text-[#001D4A]">Pacientes</h1> */}
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="Buscar paciente..."
          />
          <button className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-500/20 cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Nuevo Paciente</span>
          </button>
        </div>

        {/* Tabla de Pacientes */}
        <div className="overflow-x-auto">
          <DataTable
            data={currentPatients}
            columns={columns}
            actions={actions}
            getRowId={(patient) => patient.id}
            emptyMessage="No hay pacientes registrados."
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
          label="pacientes"
        />
      </div>
    </div>
  );
}

export default PatientsPage;