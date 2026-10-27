import React from "react";
import type { PaymentMethods } from "../../utils/paymentMethodsStatus.enum";

interface InstallmentPaymentFormSectionProps {
    amount: string;
    setAmount: (value: string) => void;
    pendingAmount: number;
    paymentMethod: PaymentMethods | "";
    setPaymentMethod: (value: PaymentMethods | "") => void;
    paymentDate: string;
    setPaymentDate: (value: string) => void;
    transactionReference: string;
    setTransactionReference: (value: string) => void;
    isPending: boolean;
    formatCurrency: (value: number) => string;
}

const InstallmentPaymentFormSection: React.FC<InstallmentPaymentFormSectionProps> = ({
    amount,
    setAmount,
    pendingAmount,
    paymentMethod,
    setPaymentMethod,
    paymentDate,
    setPaymentDate,
    transactionReference,
    setTransactionReference,
    isPending,
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
                Datos del pago
            </h3>
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-2 w-full">
                    <div className="flex-1">
                        <label className="
                                                block
                                                text-sm
                                                font-medium
                                                text-slate-700
                                                mb-2
                                            ">
                            Monto a pagar (C$)
                        </label>

                        <input
                            type="number"
                            min="0.01"
                            max={pendingAmount}
                            step="0.01"
                            value={amount}
                            onChange={(event) =>
                                setAmount(
                                    event.target.value
                                )
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
                        />

                        <p className="
                                                text-xs
                                                text-slate-500
                                                mt-1
                                            ">
                            Máximo permitido:{" "}
                            {formatCurrency(
                                pendingAmount
                            )}
                        </p>
                    </div>

                    <div className="flex-1">
                        <label className="
                                                block
                                                text-sm
                                                font-medium
                                                text-slate-700
                                                mb-2
                                            ">
                            Método de pago
                        </label>

                        <select
                            value={
                                paymentMethod
                            }
                            onChange={(event) =>
                                setPaymentMethod(
                                    event.target
                                        .value as PaymentMethods
                                )
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
                                Seleccione un método
                            </option>

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

                    <div className="flex-1">
                        <label className="
                                                block
                                                text-sm
                                                font-medium
                                                text-slate-700
                                                mb-2
                                            ">
                            Fecha del pago
                        </label>

                        <input
                            type="date"
                            value={paymentDate}
                            onChange={(event) =>
                                setPaymentDate(
                                    event.target.value
                                )
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
                                                    bg-white
                                                    text-slate-700
                                                    outline-none
                                                    focus:border-[#001D4A]
                                                "
                        />
                    </div>
                </div>

                {(paymentMethod === "TRANSFER" || paymentMethod === "CARD") && (
                    <div>
                        <label className="
                                                block
                                                text-sm
                                                font-medium
                                                text-slate-700
                                                mb-2
                                            ">
                            Referencia
                        </label>

                        <input
                            type="text"
                            value={
                                transactionReference
                            }
                            onChange={(event) =>
                                setTransactionReference(
                                    event.target.value
                                )
                            }
                            placeholder="Número de referencia"
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
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstallmentPaymentFormSection;