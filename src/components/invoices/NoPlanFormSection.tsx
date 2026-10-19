import React from "react";
import type { PaymentMethods } from "../../utils/paymentMethodsStatus.enum";
import type Invoice from "../../models/InvoiceModel";
import InvoiceInstallmentSection from "./InvoiceInstallmentSection";

interface DirectPaymentFormState {
    amount: string;
    paymentMethod: PaymentMethods | "";
    transactionReference: string;
    servedBy: string;
    paymentDate: string;
}

interface InstallmentFormState {
    numberOfInstallments: number;
    interestRate: string;
    firstDueDate: string;
}

interface NoPlanFormSectionProps {
    invoice: Invoice;
    isInstallmentPayment: boolean;
    setIsInstallmentPayment: (value: boolean) => void;
    installmentForm: InstallmentFormState;
    setInstallmentForm: React.Dispatch<React.SetStateAction<InstallmentFormState>>;
    directPaymentForm: DirectPaymentFormState;
    setDirectPaymentForm: React.Dispatch<React.SetStateAction<DirectPaymentFormState>>;
    isCreatingPlan: boolean;
    isAddingPayment: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

const NoPlanFormSection: React.FC<NoPlanFormSectionProps> = ({
    invoice,
    isInstallmentPayment,
    setIsInstallmentPayment,
    installmentForm,
    setInstallmentForm,
    directPaymentForm,
    setDirectPaymentForm,
    isCreatingPlan,
    isAddingPayment,
    onSubmit,
}) => {
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            {/* Checkbox selector de modalidad */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <input
                    type="checkbox"
                    id="isInstallmentPaymentDrawer"
                    checked={isInstallmentPayment}
                    onChange={(e) => setIsInstallmentPayment(e.target.checked)}
                    className="w-4 h-4 text-[#001D4A] rounded border-slate-300 focus:ring-[#001D4A]"
                />
                <label htmlFor="isInstallmentPaymentDrawer" className="text-sm font-medium text-slate-700 cursor-pointer">
                    Registrar pago en cuotas
                </label>
            </div>

            {/* SI EL CHECKBOX ESTÁ ACTIVO -> SECCIÓN DE CUOTAS */}
            {isInstallmentPayment ? (
                <InvoiceInstallmentSection
                    numberOfInstallments={installmentForm.numberOfInstallments}
                    interestRate={installmentForm.interestRate}
                    firstDueDate={installmentForm.firstDueDate}
                    isPending={isCreatingPlan}
                    onChange={(e) =>
                        setInstallmentForm((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value,
                        }))
                    }
                />
            ) : (
                /* SI EL CHECKBOX NO ESTÁ ACTIVO -> REGISTRO DE PAGO DIRECTO */
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Monto a pagar
                        </label>
                        <input
                            type="number"
                            min="0.01"
                            max={Number(invoice.pendingAmount || 0)}
                            step="0.01"
                            value={directPaymentForm.amount}
                            onChange={(e) =>
                                setDirectPaymentForm((prev) => ({ ...prev, amount: e.target.value }))
                            }
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 outline-none focus:border-[#001D4A]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Método de pago
                        </label>
                        <select
                            value={directPaymentForm.paymentMethod}
                            onChange={(e) =>
                                setDirectPaymentForm((prev) => ({
                                    ...prev,
                                    paymentMethod: e.target.value as PaymentMethods,
                                }))
                            }
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 outline-none focus:border-[#001D4A]"
                        >
                            <option value="">Seleccione un método</option>
                            <option value="CASH">Efectivo</option>
                            <option value="CARD">Tarjeta</option>
                            <option value="TRANSFER">Transferencia</option>
                        </select>
                    </div>

                    {directPaymentForm.paymentMethod === "TRANSFER" && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Referencia
                            </label>
                            <input
                                type="text"
                                value={directPaymentForm.transactionReference}
                                onChange={(e) =>
                                    setDirectPaymentForm((prev) => ({
                                        ...prev,
                                        transactionReference: e.target.value,
                                    }))
                                }
                                placeholder="Número de referencia"
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 outline-none focus:border-[#001D4A]"
                            />
                        </div>
                    )}
                </div>
            )}

            <button
                type="submit"
                disabled={isCreatingPlan || isAddingPayment}
                className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[#001D4A] hover:bg-[#002b6b] disabled:opacity-50 transition"
            >
                {isCreatingPlan || isAddingPayment
                    ? "Procesando..."
                    : isInstallmentPayment
                        ? "Generar Plan de Cuotas"
                        : "Registrar Pago"}
            </button>
        </form>
    );
};

export default NoPlanFormSection;