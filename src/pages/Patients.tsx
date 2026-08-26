import React, { useState } from "react";
import { Plus, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { mockUsersData } from "../data/userData";

const PatientsPage: React.FC = () => {
    const ITEMS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);

    const totalItems = mockUsersData.length; //obtenemos la cantidad total de items 

    //esto hace un calculo, divide la cantidad total de items entre la cantidad de items a mostrar
    //por pagina : 248 / 5 = 49.6 y redondea eso hacia arriba dando 50
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    //para obtener solo los pacientes que queremos por pagina, los visibles
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex = startIndex + ITEMS_PER_PAGE;

    const currentPatients = mockUsersData.slice(
        startIndex,
        endIndex
    );

    //obtener que rango de items uqe se estan mostrando actualmente para la paginacion
    const firstItem = totalItems === 0
        ? 0
        : startIndex + 1;

    const lastItem = Math.min(
        endIndex,
        totalItems
    );

    return (
        <div className="h-full w-full bg-[#f8fafc] p-8 flex flex-col justify-between select-none">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                {/* Encabezado */}
                <div className="flex items-center justify-between pb-6 mb-2">
                    <h1 className="text-xl font-bold text-[#001D4A]">Pacientes</h1>
                    <button className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-500/20 cursor-pointer">
                        <Plus className="w-4 h-4" />
                        <span>Nuevo Paciente</span>
                    </button>
                </div>

                {/* Tabla de Pacientes */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-400 text-xs font-medium border-b border-slate-100">
                                <th className="pb-3 pl-2 font-normal">Nombre</th>
                                <th className="pb-3 font-normal">Teléfono</th>
                                <th className="pb-3 font-normal">Última cita</th>
                                <th className="pb-3 font-normal">Estado</th>
                                <th className="pb-3 pr-2 text-right font-normal"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {currentPatients.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                                    {/* Avatar y Nombre */}
                                    <td className="py-3.5 pl-2">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.image}
                                                alt={user.fullName}
                                                className="w-9 h-9 rounded-full object-cover border border-slate-200"
                                            />
                                            <span className="text-sm font-semibold text-slate-800">
                                                {user.fullName}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Teléfono */}
                                    <td className="py-3.5 text-sm text-slate-500">
                                        {user.phoneNumber}
                                    </td>

                                    {/* Última Cita (Formateando createdAt) */}
                                    <td className="py-3.5 text-sm text-slate-500">
                                        {user.createdAt.toLocaleDateString("es-ES", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })}
                                    </td>

                                    {/* Estado (Usando el método getActive del modelo) */}
                                    <td className="py-3.5 text-sm">
                                        {user.active ? (
                                            <span className="text-emerald-500 font-medium">Activo</span>
                                        ) : (
                                            <span className="text-rose-500 font-medium">Inactivo</span>
                                        )}
                                    </td>

                                    {/* Menú de Opciones */}
                                    <td className="py-3.5 pr-2 text-right">
                                        <button className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Paginación de la Tabla */}
            <div className="flex items-center justify-between pt-4 px-2 text-xs text-slate-500">
                <span> Mostrando {firstItem} a {lastItem} de {totalItems} pacientes</span>

                <div className="flex items-center gap-1">
                    <button
                        disabled={currentPage === 1}
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                        (page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors cursor-pointer ${currentPage === page
                                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                                        : "hover:bg-slate-200 text-slate-600"
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    )}

                    <span className="px-1 text-slate-400">...</span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                            )
                        }
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PatientsPage;