import React from "react";
import SearchableSelect from "../../../shared/searchableSelect/SearchableSelect";
import type TreatmentCatalogModel from "../../../models/TreatmentCatalogModel";
import type { TreatmentPlanDetailState } from "../EditAppointmentDrawer";

interface AppointmentServicesSectionProps {
    treatments: TreatmentCatalogModel[];
    isLoadingTreatments: boolean;
    selectedTreatments: TreatmentCatalogModel[];
    treatmentDetails: TreatmentPlanDetailState[];
    isLoadingAppointmentDetails: boolean;
    isStartingTreatment: boolean;
    isCompletingTreatment: boolean;
    isCancelingTreatment: boolean;
    isPending: boolean;
    isMarkingAsInvoiced: boolean;
    canMarkAsInvoiced: boolean;
    onTreatmentChange: (treatment: TreatmentCatalogModel) => void;
    onStartTreatment: (detailId?: string) => void;
    onCompleteTreatment: (detailId?: string) => void;
    onCancelTreatment: (detailId?: string) => void;
    onRemoveTreatment: (treatmentId: string) => void;

    handleSubmitInvoice: () => void;
    isLoadingInvoiceWithPayment: boolean;
}

export const AppointmentServicesSection: React.FC<AppointmentServicesSectionProps> = ({
    treatments,
    isLoadingTreatments,
    selectedTreatments,
    treatmentDetails,
    isLoadingAppointmentDetails,
    isStartingTreatment,
    isCompletingTreatment,
    isCancelingTreatment,
    isPending,
    isMarkingAsInvoiced,
    canMarkAsInvoiced,
    onTreatmentChange,
    onStartTreatment,
    onCompleteTreatment,
    onCancelTreatment,
    onRemoveTreatment,

    handleSubmitInvoice,
    isLoadingInvoiceWithPayment
}) => {
    return (
        <>
            <div>
                <SearchableSelect<TreatmentCatalogModel>
                    label="servicios"
                    value={""}
                    items={treatments}
                    getOptionValue={(treatment) => treatment.id}
                    getOptionLabel={(treatment) =>
                        `${treatment.name} - ${treatment.description}`
                    }
                    placeholder={
                        isLoadingTreatments
                            ? "Cargando servicios..."
                            : "Seleccione un servicio"
                    }
                    searchPlaceholder="Buscar servicio por nombre..."
                    noResultsMessage="No se encontraron servicios."
                    disabled={isLoadingTreatments}
                    onChange={onTreatmentChange}
                />
            </div>

            {selectedTreatments.length > 0 && (
                <div className="mt-3 space-y-2">

                    {selectedTreatments.map((treatment) => {
                        const detail = treatmentDetails.find(
                            (item) =>
                                String(item.treatmentId) ===
                                String(treatment.id)
                        );

                        const status = detail?.status;

                        const isStarting =
                            isStartingTreatment;

                        const isCompleting =
                            isCompletingTreatment;

                        const isCanceling =
                            isCancelingTreatment;

                        return (
                            <div
                                key={String(treatment.id)}
                                className="
                                            flex
                                            flex-col
                                            md:flex-row
                                            md:items-center
                                            md:justify-between
                                            gap-3
                                            px-3
                                            py-3
                                            bg-slate-50
                                            border
                                            border-slate-200
                                            rounded-lg
                                        "
                            >
                                {/* INFORMACIÓN DEL TRATAMIENTO */}
                                <div className="min-w-0 flex-1">

                                    <p className="text-sm font-medium text-slate-700">
                                        {treatment.name}
                                    </p>

                                    {treatment.description && (
                                        <p className="text-xs text-slate-400 truncate">
                                            {treatment.description}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap items-center gap-3 mt-1">

                                        <p className="text-xs text-slate-500">
                                            C$ {Number(
                                                detail?.unitPrice ??
                                                treatment.basePrice
                                            ).toFixed(2)}
                                        </p>

                                        {detail?.status && (
                                            <span
                                                className={`
                                                            px-2
                                                            py-0.5
                                                            rounded-full
                                                            text-xs
                                                            font-medium
                                                            ${detail.status === "PENDING"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : detail.status === "IN_PROGRESS"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : detail.status === "COMPLETED"
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : "bg-red-100 text-red-700"
                                                    }
                                                        `}
                                            >
                                                {detail.status === "PENDING"
                                                    ? "Pendiente"
                                                    : detail.status === "IN_PROGRESS"
                                                        ? "En progreso"
                                                        : detail.status === "COMPLETED"
                                                            ? "Completado"
                                                            : "Abortado"}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* ACCIONES */}
                                <div className="flex flex-wrap items-center gap-2">

                                    {/* PENDING -> IN_PROGRESS */}
                                    {status === "PENDING" && detail?.id && (
                                        <button
                                            type="button"
                                            disabled={
                                                isStarting ||
                                                isCompleting ||
                                                isCanceling
                                            }
                                            onClick={() =>
                                                onStartTreatment(
                                                    detail.id
                                                )
                                            }
                                            className="
                                                        px-3
                                                        py-1.5
                                                        text-xs
                                                        font-medium
                                                        text-blue-600
                                                        border
                                                        border-blue-200
                                                        rounded-lg
                                                        hover:bg-blue-50
                                                        cursor-pointer
                                                        disabled:opacity-50
                                                        disabled:cursor-not-allowed
                                                    "
                                        >
                                            {isStarting
                                                ? "Iniciando..."
                                                : "Comenzar servicio"}
                                        </button>
                                    )}

                                    {/* IN_PROGRESS -> COMPLETED */}
                                    {status === "IN_PROGRESS" && detail?.id && (
                                        <>
                                            <button
                                                type="button"
                                                disabled={
                                                    isStarting ||
                                                    isCompleting ||
                                                    isCanceling
                                                }
                                                onClick={() =>
                                                    onCompleteTreatment(
                                                        detail.id
                                                    )
                                                }
                                                className="
                                                            px-3
                                                            py-1.5
                                                            text-xs
                                                            font-medium
                                                            text-emerald-600
                                                            border
                                                            border-emerald-200
                                                            rounded-lg
                                                            hover:bg-emerald-50
                                                            cursor-pointer
                                                            disabled:opacity-50
                                                            disabled:cursor-not-allowed
                                                        "
                                            >
                                                {isCompleting
                                                    ? "Completando..."
                                                    : "Finalizar"}
                                            </button>

                                            <button
                                                type="button"
                                                disabled={
                                                    isStarting ||
                                                    isCompleting ||
                                                    isCanceling
                                                }
                                                onClick={() =>
                                                    onCancelTreatment(
                                                        detail.id
                                                    )
                                                }
                                                className="
                                                            px-3
                                                            py-1.5
                                                            text-xs
                                                            font-medium
                                                            text-red-600
                                                            border
                                                            border-red-200
                                                            rounded-lg
                                                            hover:bg-red-50
                                                            cursor-pointer
                                                            disabled:opacity-50
                                                            disabled:cursor-not-allowed
                                                        "
                                            >
                                                {isCanceling
                                                    ? "Cancelando..."
                                                    : "Abortar"}
                                            </button>
                                        </>
                                    )}

                                    {/* ELIMINAR DEL PLAN */}
                                    {
                                        status !== "COMPLETED" &&
                                        status !== "IN_PROGRESS" &&
                                        status !== "CANCELLED" && (
                                            <button
                                                type="button"
                                                disabled={
                                                    isStarting ||
                                                    isCompleting ||
                                                    isCanceling
                                                }
                                                onClick={() =>
                                                    onRemoveTreatment(
                                                        String(treatment.id)
                                                    )
                                                }
                                                className="
                                                    px-2.5
                                                    py-1.5
                                                    text-xs
                                                    text-red-500
                                                    border
                                                    border-red-200
                                                    rounded-lg
                                                    hover:bg-red-50
                                                    cursor-pointer
                                                    disabled:opacity-50
                                                    disabled:cursor-not-allowed
                                                "
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Mostramos el total */}
            {selectedTreatments.length > 0 && (
                <div className="mt-3 flex flex-col justify-end">
                    <div
                        className="
                                w-full
                                md:w-auto
                                min-w-64
                                px-4
                                py-3
                                rounded-lg
                                text-right
                            "
                    >
                        <p className="text-xs text-slate-400">
                            Total
                        </p>

                        <p className="text-lg font-semibold text-slate-700">
                            <p className="text-lg font-semibold text-slate-700">
                                C${" "}
                                {selectedTreatments
                                    .reduce((total, treatment) => {
                                        const detail = treatmentDetails.find(
                                            (item) =>
                                                String(item.treatmentId) ===
                                                String(treatment.id)
                                        );

                                        // Si el servicio está cancelado/abortado,
                                        // no se incluye en el total.
                                        if (detail?.status === "CANCELLED") {
                                            return total;
                                        }

                                        return total + Number(
                                            detail?.subtotal ?? treatment.basePrice
                                        );
                                    }, 0)
                                    .toFixed(2)}
                            </p>
                        </p>
                    </div>
                    {canMarkAsInvoiced && (
                        <button
                            type="button"
                            onClick={handleSubmitInvoice}
                            disabled={
                                isPending ||
                                isMarkingAsInvoiced ||
                                isLoadingInvoiceWithPayment
                            }
                            className="
                                        px-4 py-2.5
                                        text-sm font-medium
                                        text-white
                                        bg-emerald-600
                                        hover:bg-emerald-700
                                        rounded-lg
                                        cursor-pointer
                                        disabled:opacity-50
                                        disabled:cursor-not-allowed
                                    "
                        >
                            {isMarkingAsInvoiced
                                ? "Generando..."
                                : "Generar factura"}
                        </button>
                    )}
                </div>
            )}

            {isLoadingAppointmentDetails && (
                <div className="mt-3 flex justify-end  bg-gray-200 h-18
                                w-full
                                md:w-auto
                                min-w-64
                                px-4
                                py-3
                                rounded-lg
                                text-right">
                </div>
            )}
        </>
    );
};