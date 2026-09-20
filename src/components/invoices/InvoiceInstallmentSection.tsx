import React from "react";

interface InvoiceInstallmentSectionProps {
    numberOfInstallments: number;
    interestRate: string;
    firstDueDate: string;

    isPending: boolean;

    onChange: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void;
}

const InvoiceInstallmentSection: React.FC<
    InvoiceInstallmentSectionProps
> = ({
    numberOfInstallments,
    interestRate,
    firstDueDate,
    isPending,
    onChange,
}) => {
    return (
        <>
            {/* =================================================
                CANTIDAD DE CUOTAS
            ================================================= */}

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Cantidad de cuotas
                </label>

                <input
                    type="number"
                    min="2"
                    step="1"
                    name="numberOfInstallments"
                    value={numberOfInstallments}
                    onChange={onChange}
                    disabled={isPending}
                    placeholder="Ej. 6"
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
                    "
                />
            </div>

            {/* =================================================
                INTERÉS
            ================================================= */}

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Interés (%)
                </label>

                <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="interestRate"
                    value={interestRate}
                    onChange={onChange}
                    disabled={isPending}
                    placeholder="Ej. 10"
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
                    "
                />

                <p className="mt-1 text-xs text-slate-500">
                    Porcentaje de interés aplicado al plan.
                </p>
            </div>

            {/* =================================================
                MÍNIMO POR CUOTA
            ================================================= */}

            {/* <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mínimo a pagar por cuota
                </label>

                <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="minimumPayment"
                    value={minimumPayment}
                    onChange={onChange}
                    disabled={isPending}
                    placeholder="Ej. 500"
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
                    "
                />

                <p className="mt-1 text-xs text-slate-500">
                    Monto mínimo permitido para pagar una cuota.
                </p>
            </div> */}

            {/* =================================================
                PERÍODO DE GRACIA
            ================================================= */}

            {/* <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Período de gracia (días)
                </label>

                <input
                    type="number"
                    min="0"
                    step="1"
                    name="gracePeriodDays"
                    value={gracePeriodDays}
                    onChange={onChange}
                    disabled={isPending}
                    placeholder="Ej. 2"
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
                    "
                />

                <p className="mt-1 text-xs text-slate-500">
                    Días adicionales después del vencimiento.
                </p>
            </div> */}

            {/* =================================================
                PRIMERA FECHA
            ================================================= */}

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Primera fecha de pago
                </label>

                <input
                    type="date"
                    name="firstDueDate"
                    value={firstDueDate}
                    onChange={onChange}
                    disabled={isPending}
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
                    "
                />

                <p className="mt-1 text-xs text-slate-500">
                    Cada cuota tendrá una frecuencia de 30 días.
                </p>
            </div>
        </>
    );
};

export default InvoiceInstallmentSection;