import React from "react";
import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;

    onPageChange: (page: number) => void;

    label?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    label = "registros",
}) => {

    const totalPages = Math.ceil(
        totalItems / itemsPerPage
    );

    const startItem =
        totalItems === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1;

    const endItem = Math.min(
        currentPage * itemsPerPage,
        totalItems
    );

    const goToPrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const goToNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex items-center justify-between pt-4 px-2 text-xs text-slate-500 w-full">

            {/* Información */}
            <span>
                Mostrando {startItem} a {endItem} de {totalItems} {label}
            </span>

            {/* Controles */}
            <div className="flex items-center gap-1">

                {/* Anterior */}
                <button
                    disabled={currentPage === 1}
                    onClick={goToPrevious}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Páginas */}
                {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                ).map((page) => (

                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            currentPage === page
                                ? "bg-blue-50 text-blue-600 border border-blue-200"
                                : "hover:bg-slate-200 text-slate-600"
                        }`}
                    >
                        {page}
                    </button>

                ))}

                {/* Siguiente */}
                <button
                    disabled={
                        currentPage === totalPages ||
                        totalPages === 0
                    }
                    onClick={goToNext}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>

            </div>
        </div>
    );
};

export default Pagination;