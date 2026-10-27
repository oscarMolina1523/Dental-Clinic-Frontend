import React from "react";
import type Installment from "../../models/InstallmentModel";

interface InstallmentSelectorSectionProps {
    selectedInstallment: Installment | null;
    pendingInstallments: Installment[];
    isPending: boolean;
    handleInstallmentChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    formatCurrency: (value: number) => string;
}

const InstallmentSelectorSection: React.FC<InstallmentSelectorSectionProps> = ({
    selectedInstallment,
    pendingInstallments,
    isPending,
    handleInstallmentChange,
    formatCurrency,
}) => {
    return (
        <div>
            <label className="
                            block
                            text-sm
                            font-medium
                            text-slate-700
                            mb-2
                        ">
                Cuota a pagar
            </label>

            <select
                value={
                    selectedInstallment?.id ||
                    ""
                }
                onChange={
                    handleInstallmentChange
                }
                disabled={isPending}
                className="
                                w-full
                                px-3
                                py-2.5
                                border
                                border-slate-200
                                rounded-lg
                                text-sm
                                bg-white
                                text-slate-700
                                outline-none
                                focus:border-[#001D4A]
                            "
            >
                <option value="">
                    Seleccione una cuota
                </option>

                {pendingInstallments.map(
                    (installment) => {
                        const installmentPending =
                            Math.max(
                                Number(
                                    installment.amount ||
                                    0
                                ) +
                                Number(
                                    installment.lateFeeAmount ||
                                    0
                                ) -
                                Number(
                                    installment.paidAmount ||
                                    0
                                ),
                                0
                            );

                        return (
                            <option
                                key={
                                    installment.id
                                }
                                value={
                                    installment.id
                                }
                            >
                                Cuota{" "}
                                {
                                    installment.installmentNumber
                                }{" "}
                                -{" "}
                                {formatCurrency(
                                    installmentPending
                                )}
                            </option>
                        );
                    }
                )}
            </select>
        </div>
    );
};

export default InstallmentSelectorSection;