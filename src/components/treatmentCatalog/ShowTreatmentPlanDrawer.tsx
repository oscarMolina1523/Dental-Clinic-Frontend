
import React from "react";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import type { TreatmentPlanOrchestratorResponse } from "../../models/TreatmentPlanOrchestratorModel";
import { treatmentPlanDetailStatusSpanishOptions } from "../../utils/treatmentPlanStatus.enum";

interface ShowTreatmentPlanDrawerProps {
    isOpen: boolean;
    onHide: () => void;
    treatment: TreatmentPlanOrchestratorResponse | null;
}

const ShowTreatmentPlanDrawer: React.FC<ShowTreatmentPlanDrawerProps> = ({
    isOpen,
    onHide,
    treatment,
}) => {
    const treatmentPlan = treatment?.treatmentPlan;

    // const subtotal =
    //     treatment?.details?.reduce(
    //         (total, detail) => total + Number(detail.subtotal || 0),
    //         0
    //     ) ?? 0;


    return (
        <>
            {/* =================================================
                OVERLAY
            ================================================= */}
            <div
                onClick={onHide}
                className={`
                    fixed inset-0 z-40
                    bg-black/30
                    transition-opacity duration-300
                    ${isOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }
                `}
            />

            {/* =================================================
                DRAWER
            ================================================= */}
            <GenericDrawer
                isOpen={isOpen}
                onHide={onHide}
                title="Detalle del Paquete de servicios"
                description="Información completa del paquete de servicios"
                width="w-80 md:w-200"
            >
                {!treatmentPlan ? (
                    <div className="text-sm text-slate-500">
                        No hay información del paquete de servicios.
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-slate-200" />

                            <div className="flex flex-col items-center">
                                <h2 className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                                    Información del paquete de servicios
                                </h2>
                                <p
                                    className="
                                                        text-xs
                                                        text-slate-500
                                                        mt-1
                                                    "
                                >
                                    Información del paquete de servicios.
                                </p>
                            </div>

                            <div className="flex-1 h-px bg-slate-200" />
                        </div>
                        <div className="flex flex-col md:flex-row gap-2 w-full">
                            {/* =================================================
                                CÓDIGO
                            ================================================= */}
                            <div className="flex-1">
                                <label
                                    className="
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    mb-2
                                "
                                >
                                    Código
                                </label>

                                <input
                                    type="text"
                                    value={treatmentPlan.code || ""}
                                    disabled
                                    className="
                                    w-full
                                    px-3 py-2.5
                                    border border-slate-200
                                    rounded-lg
                                    text-sm
                                    bg-slate-50
                                    text-slate-500
                                    outline-none
                                "
                                />
                            </div>

                            {/* =================================================
                                FECHA DE CREACIÓN
                            ================================================= */}
                            <div className="flex-1">
                                <label
                                    className="
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    mb-2
                                "
                                >
                                    Fecha de creación
                                </label>

                                <input
                                    type="text"
                                    value={
                                        treatmentPlan.createdAt
                                            ? new Date(
                                                treatmentPlan.createdAt
                                            ).toLocaleString("es-NI", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : "N/A"
                                    }
                                    disabled
                                    className="
                                    w-full
                                    px-3 py-2.5
                                    border border-slate-200
                                    rounded-lg
                                    text-sm
                                    bg-slate-50
                                    text-slate-500
                                    outline-none
                                "
                                />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-2 w-full">
                            {/* =================================================
                                PACIENTE
                            ================================================= */}
                            <div className="flex-1">
                                <label
                                    className="
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    mb-2
                                "
                                >
                                    Paciente
                                </label>

                                <input
                                    type="text"
                                    value={treatment.treatmentPlan.patientFullName || "N/A"}
                                    disabled
                                    className="
                                    w-full
                                    px-3 py-2.5
                                    border border-slate-200
                                    rounded-lg
                                    text-sm
                                    bg-slate-50
                                    text-slate-500
                                    outline-none
                                "
                                />
                            </div>

                            {/* =================================================
                                DENTISTA
                            ================================================= */}
                            <div className="flex-1">
                                <label
                                    className="
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    mb-2
                                "
                                >
                                    Especialista
                                </label>

                                <input
                                    type="text"
                                    value={treatment.treatmentPlan.dentistFullName || "N/A"}
                                    disabled
                                    className="
                                    w-full
                                    px-3 py-2.5
                                    border border-slate-200
                                    rounded-lg
                                    text-sm
                                    bg-slate-50
                                    text-slate-500
                                    outline-none
                                "
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                className="
                                            block
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            mb-2
                                        "
                            >
                                Total
                            </label>

                            <input
                                type="text"
                                value={
                                    treatmentPlan.totalAmount != null
                                        ? `C$ ${Number(
                                            treatmentPlan.totalAmount
                                        ).toFixed(2)}`
                                        : "C$ 0.00"
                                }
                                disabled
                                className="
                                            w-full
                                            px-3 py-2.5
                                            border border-slate-200
                                            rounded-lg
                                            text-sm
                                            font-semibold
                                            bg-slate-50
                                            text-slate-700
                                            outline-none
                                        "
                            />
                        </div>



                        {/* =================================================
                            RESUMEN ECONÓMICO
                        ================================================= */}
                        {/* <div
                            className="
                                border-t
                                border-slate-100
                                pt-5
                            "
                        >
                            <div className="mb-4">
                                <h3
                                    className="
                                        text-sm
                                        font-semibold
                                        text-slate-800
                                    "
                                >
                                    Resumen del plan
                                </h3>

                                <p
                                    className="
                                        text-xs
                                        text-slate-500
                                        mt-1
                                    "
                                >
                                    Información económica del paquete de servicios.
                                </p>
                            </div>

                            <div className="space-y-4"> */}

                        {/* SUBTOTAL */}
                        {/* <div>
                                    <label
                                        className="
                                            block
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            mb-2
                                        "
                                    >
                                        Subtotal
                                    </label>

                                    <input
                                        type="text"
                                        value={`C$ ${subtotal.toFixed(2)}`}
                                        disabled
                                        className="
                                            w-full
                                            px-3 py-2.5
                                            border border-slate-200
                                            rounded-lg
                                            text-sm
                                            bg-slate-50
                                            text-slate-500
                                            outline-none
                                        "
                                    />
                                </div> */}

                        {/* DESCUENTO */}
                        {/* <div>
                                    <label
                                        className="
                                            block
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            mb-2
                                        "
                                    >
                                        Descuento
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            treatmentPlan.discount != null
                                                ? `C$ ${Number(
                                                    treatmentPlan.discount
                                                ).toFixed(2)}`
                                                : "C$ 0.00"
                                        }
                                        disabled
                                        className="
                                            w-full
                                            px-3 py-2.5
                                            border border-slate-200
                                            rounded-lg
                                            text-sm
                                            bg-slate-50
                                            text-slate-500
                                            outline-none
                                        "
                                    />
                                </div> */}

                        {/* TOTAL */}


                        {/* </div>
                        </div> */}

                        {/* =================================================
                            TRATAMIENTOS
                        ================================================= */}
                        <div
                            className="
                                border-t
                                border-slate-100
                                pt-5
                            "
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex-1 h-px bg-slate-200" />

                                <div className="flex flex-col items-center">
                                    <h2 className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                                        Servicios
                                    </h2>
                                    <p
                                        className="
                                                        text-xs
                                                        text-slate-500
                                                        mt-1
                                                    "
                                    >
                                        Servicios incluidos en el paquete
                                    </p>
                                </div>

                                <div className="flex-1 h-px bg-slate-200" />
                            </div>

                            <div className="space-y-5">

                                {treatment.details &&
                                    treatment.details.length > 0 ? (
                                    treatment.details.map(
                                        (detail, index) => (
                                            <div
                                                key={
                                                    detail.id ||
                                                    `${detail.treatmentId}-${index}`
                                                }
                                                className="
                                                    border
                                                    border-slate-200
                                                    rounded-xl
                                                    p-4
                                                    space-y-4
                                                "
                                            >

                                                {/* HEADER */}
                                                <div className="flex items-center justify-between">
                                                    <span
                                                        className="
                                                            text-sm
                                                            font-semibold
                                                            text-slate-700
                                                        "
                                                    >
                                                        Tratamiento {index + 1}
                                                    </span>
                                                </div>

                                                <div className="flex flex-col md:flex-row gap-2 w-full">
                                                    {/* TRATAMIENTO */}
                                                    <div className="flex-1">
                                                        <label
                                                            className="
                                                            block
                                                            text-sm
                                                            font-medium
                                                            text-slate-700
                                                            mb-2
                                                        "
                                                        >
                                                            Tratamiento
                                                        </label>

                                                        <input
                                                            type="text"
                                                            value={
                                                                detail.treatmentName ||
                                                                "N/A"
                                                            }
                                                            disabled
                                                            className="
                                                            w-full
                                                            px-3 py-2.5
                                                            border border-slate-200
                                                            rounded-lg
                                                            text-sm
                                                            bg-slate-50
                                                            text-slate-500
                                                            outline-none
                                                        "
                                                        />
                                                    </div>

                                                    {/* PRECIO UNITARIO */}
                                                    <div className="flex-1">
                                                        <label
                                                            className="
                                                            block
                                                            text-sm
                                                            font-medium
                                                            text-slate-700
                                                            mb-2
                                                        "
                                                        >
                                                            Precio unitario
                                                        </label>

                                                        <input
                                                            type="text"
                                                            value={
                                                                detail.unitPrice != null
                                                                    ? `C$ ${Number(
                                                                        detail.unitPrice
                                                                    ).toFixed(2)}`
                                                                    : "C$ 0.00"
                                                            }
                                                            disabled
                                                            className="
                                                            w-full
                                                            px-3 py-2.5
                                                            border border-slate-200
                                                            rounded-lg
                                                            text-sm
                                                            bg-slate-50
                                                            text-slate-500
                                                            outline-none
                                                        "
                                                        />
                                                    </div>

                                                    {/* ESTADO */}
                                                    <div className="flex-1">
                                                        <label
                                                            className="
                                                            block
                                                            text-sm
                                                            font-medium
                                                            text-slate-700
                                                            mb-2
                                                        "
                                                        >
                                                            Estado
                                                        </label>

                                                        <input
                                                            type="text"
                                                            value={
                                                                treatmentPlanDetailStatusSpanishOptions.find(
                                                                    (option) => option.value === detail.status
                                                                )?.label || "N/A"
                                                            }
                                                            disabled
                                                            className="
                                                            w-full
                                                            px-3 py-2.5
                                                            border border-slate-200
                                                            rounded-lg
                                                            text-sm
                                                            bg-slate-50
                                                            text-slate-500
                                                            outline-none
                                                        "
                                                        />
                                                    </div>
                                                </div>

                                                {/* DIENTE */}
                                                {/* <div>
                                                    <label
                                                        className="
                                                            block
                                                            text-sm
                                                            font-medium
                                                            text-slate-700
                                                            mb-2
                                                        "
                                                    >
                                                        Diente
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={
                                                            detail.toothNumber != null
                                                                ? String(
                                                                    detail.toothNumber
                                                                )
                                                                : "N/A"
                                                        }
                                                        disabled
                                                        className="
                                                            w-full
                                                            px-3 py-2.5
                                                            border border-slate-200
                                                            rounded-lg
                                                            text-sm
                                                            bg-slate-50
                                                            text-slate-500
                                                            outline-none
                                                        "
                                                    />
                                                </div> */}

                                                {/* CANTIDAD */}
                                                {/* <div>
                                                    <label
                                                        className="
                                                            block
                                                            text-sm
                                                            font-medium
                                                            text-slate-700
                                                            mb-2
                                                        "
                                                    >
                                                        Cantidad
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={
                                                            detail.quantity != null
                                                                ? String(
                                                                    detail.quantity
                                                                )
                                                                : "0"
                                                        }
                                                        disabled
                                                        className="
                                                            w-full
                                                            px-3 py-2.5
                                                            border border-slate-200
                                                            rounded-lg
                                                            text-sm
                                                            bg-slate-50
                                                            text-slate-500
                                                            outline-none
                                                        "
                                                    />
                                                </div> */}



                                                {/* SUBTOTAL */}
                                                {/* <div>
                                                    <label
                                                        className="
                                                            block
                                                            text-sm
                                                            font-medium
                                                            text-slate-700
                                                            mb-2
                                                        "
                                                    >
                                                        Subtotal
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={
                                                            detail.subtotal != null
                                                                ? `C$ ${Number(
                                                                    detail.subtotal
                                                                ).toFixed(2)}`
                                                                : "C$ 0.00"
                                                        }
                                                        disabled
                                                        className="
                                                            w-full
                                                            px-3 py-2.5
                                                            border border-slate-200
                                                            rounded-lg
                                                            text-sm
                                                            bg-slate-50
                                                            text-slate-500
                                                            outline-none
                                                        "
                                                    />
                                                </div> */}
                                            </div>
                                        )
                                    )
                                ) : (
                                    <div
                                        className="
                                            text-sm
                                            text-slate-500
                                            border
                                            border-slate-200
                                            rounded-xl
                                            p-4
                                        "
                                    >
                                        No hay tratamientos registrados en
                                        este plan.
                                    </div>
                                )}

                            </div>
                        </div>

                    </div>
                )}
            </GenericDrawer>
        </>
    );
};

export default ShowTreatmentPlanDrawer;
