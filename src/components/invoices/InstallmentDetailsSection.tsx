import React from "react";
import type Installment from "../../models/InstallmentModel";

interface InstallmentDetailsSectionProps {
    selectedInstallment: Installment;
    pendingAmount: number;
    formatCurrency: (value: number) => string;
}

const InstallmentDetailsSection: React.FC<InstallmentDetailsSectionProps> = ({
    selectedInstallment,
    pendingAmount,
    formatCurrency,
}) => {
    return (
        <div>
            <h3 className="
                                text-sm
                                font-semibold
                                text-slate-800
                                mb-4
                            ">
                Información de la cuota
            </h3>

            <div className="
                                border
                                border-slate-200
                                rounded-xl
                                p-4
                                space-y-4
                            ">
                <div className="flex flex-col md:flex-row gap-2 w-full">
                    <div className="flex-1">
                        <label className="
                                        block
                                        text-xs
                                        font-medium
                                        text-slate-600
                                        mb-1
                                    ">
                            Cuota
                        </label>

                        <input
                            type="text"
                            value={
                                selectedInstallment.installmentNumber
                            }
                            disabled
                            className="
                                            w-full
                                            px-3
                                            py-2.5
                                            border
                                            border-slate-200
                                            rounded-lg
                                            text-sm
                                            bg-slate-50
                                            text-slate-500
                                            outline-none
                                        "
                        />
                    </div>

                    <div className="flex-1">
                        <label className="
                                        block
                                        text-xs
                                        font-medium
                                        text-slate-600
                                        mb-1
                                    ">
                            Monto de la cuota
                        </label>

                        <input
                            type="text"
                            value={formatCurrency(
                                Number(
                                    selectedInstallment.amount ||
                                    0
                                )
                            )}
                            disabled
                            className="
                                            w-full
                                            px-3
                                            py-2.5
                                            border
                                            border-slate-200
                                            rounded-lg
                                            text-sm
                                            bg-slate-50
                                            text-slate-500
                                            outline-none
                                        "
                        />
                    </div>

                    <div className="flex-1">
                        <label className="
                                        block
                                        text-xs
                                        font-medium
                                        text-slate-600
                                        mb-1
                                    ">
                            Monto por mora
                        </label>

                        <input
                            type="text"
                            value={formatCurrency(
                                Number(
                                    selectedInstallment.lateFeeAmount ||
                                    0
                                )
                            )}
                            disabled
                            className="
                                            w-full
                                            px-3
                                            py-2.5
                                            border
                                            border-slate-200
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
                    <div className="flex-1">
                        <label className="
                                        block
                                        text-xs
                                        font-medium
                                        text-slate-600
                                        mb-1
                                    ">
                            Monto pagado
                        </label>

                        <input
                            type="text"
                            value={formatCurrency(
                                Number(
                                    selectedInstallment.paidAmount ||
                                    0
                                )
                            )}
                            disabled
                            className="
                                            w-full
                                            px-3
                                            py-2.5
                                            border
                                            border-slate-200
                                            rounded-lg
                                            text-sm
                                            bg-slate-50
                                            text-slate-500
                                            outline-none
                                        "
                        />
                    </div>

                    <div className="flex-1">
                        <label className="
                                        block
                                        text-xs
                                        font-medium
                                        text-slate-600
                                        mb-1
                                    ">
                            Saldo pendiente
                        </label>

                        <input
                            type="text"
                            value={formatCurrency(
                                pendingAmount
                            )}
                            disabled
                            className="
                                            w-full
                                            px-3
                                            py-2.5
                                            border
                                            border-slate-200
                                            rounded-lg
                                            text-sm
                                            bg-blue-50
                                            text-[#001D4A]
                                            font-semibold
                                            outline-none
                                        "
                        />
                    </div>

                    <div className="flex-1">
                        <label className="
                                        block
                                        text-xs
                                        font-medium
                                        text-slate-600
                                        mb-1
                                    ">
                            Fecha de límite
                        </label>

                        <input
                            type="text"
                            value={
                                selectedInstallment.dueDate
                                    ? new Date(
                                        selectedInstallment.dueDate
                                    ).toLocaleDateString(
                                        "es-NI"
                                    )
                                    : "N/A"
                            }
                            disabled
                            className="
                                            w-full
                                            px-3
                                            py-2.5
                                            border
                                            border-slate-200
                                            rounded-lg
                                            text-sm
                                            bg-slate-50
                                            text-slate-500
                                            outline-none
                                        "
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstallmentDetailsSection;