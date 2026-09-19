import React from "react";

interface InvoiceTreatmentSectionProps {
    treatmentPlanId: string;
    patientFullName: string;
    totalAmount: string;

    isLoadingTreatments: boolean;

    treatments: Array<{
        id: string;
        code?: string;
        totalAmount?: number;
    }>;

    onTreatmentPlanChange: (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => void;
}

const InvoiceTreatmentSection: React.FC<
    InvoiceTreatmentSectionProps
> = ({
    treatmentPlanId,
    patientFullName,
    totalAmount,
    isLoadingTreatments,
    treatments,
    onTreatmentPlanChange,
}) => {
    return (
        <>
            {/* =================================================
                PLAN DE TRATAMIENTO
            ================================================= */}

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Plan de tratamiento
                </label>

                <select
                    name="treatmentPlanId"
                    value={treatmentPlanId}
                    onChange={onTreatmentPlanChange}
                    disabled={isLoadingTreatments}
                    className="
                        w-full
                        px-3 py-2.5
                        border border-slate-200
                        rounded-lg
                        text-sm
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-500/10
                        disabled:bg-slate-50
                        disabled:cursor-not-allowed
                    "
                >
                    <option value="">
                        {isLoadingTreatments
                            ? "Cargando planes..."
                            : "Seleccione un plan"}
                    </option>

                    {treatments.map((treatment) => (
                        <option
                            key={treatment.id}
                            value={treatment.id}
                        >
                            {treatment.code || treatment.id}
                        </option>
                    ))}
                </select>
            </div>

            {/* =================================================
                PACIENTE
            ================================================= */}

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Paciente
                </label>

                <input
                    type="text"
                    value={patientFullName}
                    disabled
                    placeholder="Seleccione un plan de tratamiento"
                    className="
                        w-full
                        px-3 py-2.5
                        border border-slate-200
                        rounded-lg
                        text-sm
                        outline-none
                        bg-slate-50
                        text-slate-600
                    "
                />
            </div>

            {/* =================================================
                TOTAL
            ================================================= */}

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Total a pagar
                </label>

                <input
                    type="number"
                    value={totalAmount}
                    disabled
                    placeholder="Seleccione un plan de tratamiento"
                    className="
                        w-full
                        px-3 py-2.5
                        border border-slate-200
                        rounded-lg
                        text-sm
                        outline-none
                        bg-slate-50
                        text-slate-600
                    "
                />
            </div>
        </>
    );
};

export default InvoiceTreatmentSection;