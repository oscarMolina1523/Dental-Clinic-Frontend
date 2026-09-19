import React from "react";
import type { PaymentMethods } from "../../utils/paymentMethodsStatus.enum";

interface InvoicePaymentSectionProps {
    paymentMethod: PaymentMethods;
    transactionReference: string;
    paidAmount: string;

    isInstallmentPayment: boolean;
    isPending: boolean;
    hasTreatmentPlan: boolean;

    onPaymentMethodChange: (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => void;

    onChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => void;

    onPaidAmountChange: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void;

    onInstallmentChange: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void;
}

const InvoicePaymentSection: React.FC<
    InvoicePaymentSectionProps
> = ({
    paymentMethod,
    transactionReference,
    paidAmount,
    isInstallmentPayment,
    isPending,
    hasTreatmentPlan,
    onPaymentMethodChange,
    onChange,
    onPaidAmountChange,
    onInstallmentChange,
}) => {
    return (
        <>
            {/* =================================================
                MÉTODO DE PAGO
            ================================================= */}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Método de pago
                </label>

                <select
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={onPaymentMethodChange}
                    disabled={isPending}
                    className="
                        w-full
                        border border-gray-300
                        rounded-lg
                        px-3 py-2
                        bg-white
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#001D4A]
                    "
                >
                    <option value="CASH">
                        Efectivo
                    </option>

                    <option value="CARD">
                        Tarjeta
                    </option>

                    <option value="TRANSFER">
                        Transferencia
                    </option>
                </select>
            </div>

            {/* =================================================
                REFERENCIA
            ================================================= */}

            {paymentMethod === "TRANSFER" && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Referencia de transacción
                    </label>

                    <input
                        type="text"
                        name="transactionReference"
                        value={transactionReference}
                        onChange={onChange}
                        disabled={isPending}
                        placeholder="Número de referencia"
                        className="
                            w-full
                            border border-gray-300
                            rounded-lg
                            px-3 py-2
                            bg-white
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#001D4A]
                        "
                    />
                </div>
            )}

            {/* =================================================
                MONTO PAGADO
            ================================================= */}

            {!isInstallmentPayment && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Monto recibido
                    </label>

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        name="paidAmount"
                        value={paidAmount}
                        onChange={onPaidAmountChange}
                        disabled={
                            !hasTreatmentPlan ||
                            isPending
                        }
                        placeholder="Ingrese una cantidad"
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
                    />
                </div>
            )}

            {/* =================================================
                CHECKBOX
            ================================================= */}

            <div className="flex items-center gap-3 py-2">
                <input
                    id="isInstallmentPayment"
                    type="checkbox"
                    checked={isInstallmentPayment}
                    onChange={onInstallmentChange}
                    disabled={isPending}
                    className="
                        h-4 w-4
                        rounded
                        border-gray-300
                        text-[#001D4A]
                        focus:ring-[#001D4A]
                    "
                />

                <label
                    htmlFor="isInstallmentPayment"
                    className="
                        text-sm
                        font-medium
                        text-gray-700
                        cursor-pointer
                    "
                >
                    Registrar pago en cuotas
                </label>
            </div>
        </>
    );
};

export default InvoicePaymentSection;