import React from "react";

import GenericDrawer from "../../shared/drawer/GenericDrawer";
import type {
    MedicalPrescriptionOrchestratorResponse,
} from "../../models/MedicalPrescriptionOrchestratorModel";

interface ShowDetailsMedicalPrescriptionDrawerProps {
    isOpen: boolean;
    onHide: () => void;
    prescription: MedicalPrescriptionOrchestratorResponse | null;
}

const ShowDetailsMedicalPrescriptionDrawer: React.FC<
    ShowDetailsMedicalPrescriptionDrawerProps
> = ({
    isOpen,
    onHide,
    prescription,
}) => {

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
                    ${
                        isOpen
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
                title="Detalle de Receta Médica"
                description="Información de la receta médica"
                width="w-112.5"
            >
                {!prescription ? (
                    <div className="text-sm text-slate-500">
                        No hay información de la receta médica.
                    </div>
                ) : (
                    <div className="space-y-5">

                        {/* =================================================
                            PACIENTE
                        ================================================= */}

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
                                Paciente
                            </label>

                            <input
                                type="text"
                                value={prescription.medicalPrescription.patientFullName || ""}
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
                                Dentista
                            </label>

                            <input
                                type="text"
                                value={prescription.medicalPrescription.dentistFullName || ""}
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
                            FECHA
                        ================================================= */}

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
                                Fecha
                            </label>

                            <input
                                type="text"
                                value={
                                    prescription.medicalPrescription.date
                                        ? new Date(
                                            prescription.medicalPrescription.date
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

                        {/* =================================================
                            INSTRUCCIONES GENERALES
                        ================================================= */}

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
                                Instrucciones Generales
                            </label>

                            <textarea
                                value={
                                    prescription.medicalPrescription.generalInstructions || ""
                                }
                                disabled
                                rows={4}
                                className="
                                    w-full
                                    px-3 py-2.5
                                    border border-slate-200
                                    rounded-lg
                                    text-sm
                                    bg-slate-50
                                    text-slate-500
                                    outline-none
                                    resize-none
                                "
                            />
                        </div>

                        {/* =================================================
                            MEDICAMENTOS
                        ================================================= */}

                        <div
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
                                    Medicamentos
                                </h3>

                                <p
                                    className="
                                        text-xs
                                        text-slate-500
                                        mt-1
                                    "
                                >
                                    Medicamentos indicados en la receta.
                                </p>
                            </div>

                            <div className="space-y-5">

                                {prescription.details &&
                                prescription.details.length > 0 ? (

                                    prescription.details.map(
                                        (detail, index) => (
                                            <div
                                                key={index}
                                                className="
                                                    border
                                                    border-slate-200
                                                    rounded-xl
                                                    p-4
                                                    space-y-4
                                                "
                                            >

                                                {/* HEADER */}

                                                <div>
                                                    <span
                                                        className="
                                                            text-sm
                                                            font-semibold
                                                            text-slate-700
                                                        "
                                                    >
                                                        Medicamento {index + 1}
                                                    </span>
                                                </div>

                                                {/* MEDICAMENTO */}

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
                                                        Medicamento
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={
                                                            detail.medicine || ""
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

                                                {/* DOSIS */}

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
                                                        Dosis
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={
                                                            detail.dose || ""
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

                                                {/* FRECUENCIA */}

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
                                                        Frecuencia
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={
                                                            detail.frequency || ""
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

                                                {/* DURACIÓN */}

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
                                                        Duración
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={
                                                            detail.duration || ""
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
                                        No hay medicamentos registrados.
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

export default ShowDetailsMedicalPrescriptionDrawer;