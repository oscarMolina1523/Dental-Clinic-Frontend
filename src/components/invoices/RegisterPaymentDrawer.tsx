import React, { useState } from "react";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import {
    useCreatePaymentPlanOrchestrator,
    usePaymentPlanById,
    useRegisterPayment,
} from "../../hooks/usePaymentPlanOrchestrator";
import type { PaymentMethods } from "../../utils/paymentMethodsStatus.enum";
import type Invoice from "../../models/InvoiceModel";
import type Installment from "../../models/InstallmentModel";
import Toast from "../../shared/Toast";
import { useAddPaymentToInvoice } from "../../hooks/useInvoicesPayment";
import { useUpdateInvoice } from "../../hooks/useInvoices";
import NoPlanFormSection from "./NoPlanFormSection";
import InvoiceSummarySection from "./InvoiceSummarySection";
import InstallmentSelectorSection from "./InstallmentSelectrSection";
import InstallmentDetailsSection from "./InstallmentDetailsSection";
import InstallmentPaymentFormSection from "./InstallmentPaymentFormSection";

interface RegisterPaymentDrawerProps {
    isOpen: boolean;
    onHide: () => void;
    invoice: Invoice | null;
}

const RegisterPaymentDrawer: React.FC<
    RegisterPaymentDrawerProps
> = ({
    isOpen,
    onHide,
    invoice,
}) => {

        const shouldFetchPaymentPlan = Boolean(
            isOpen &&
            invoice?.id &&
            invoice?.status !== "PAID" &&
            invoice?.hasInstallment// 👈 Solo hace la petición si la factura realmente se maneja por cuotas
        );

        const invoiceId = invoice?.id || "";

        const {
            mutate: addPaymentToInvoice,
            isPending: isAddingPayment,
        } = useAddPaymentToInvoice();

        const {
            mutate: updateInvoice
        } = useUpdateInvoice();

        const {
            mutate: createPaymentPlan,
            isPending: isCreatingPlan,
        } = useCreatePaymentPlanOrchestrator();

        const {
            mutate: registerPayment,
            isPending,
            isError,
            error,
        } = useRegisterPayment(invoiceId);

        // Checkbox para definir la modalidad de pago cuando no existe plan previo
        const [isInstallmentPayment, setIsInstallmentPayment] = useState(false);

        // Formulario para Pago Directo
        const [directPaymentForm, setDirectPaymentForm] = useState({
            amount: "",
            paymentMethod: "" as PaymentMethods | "",
            transactionReference: "",
            servedBy: "b0459bf8f4656468",
            paymentDate: new Date().toISOString().split("T")[0],
        });

        // Estado para el formulario de generación de cuotas
        const [installmentForm, setInstallmentForm] = useState({
            numberOfInstallments: 2,
            interestRate: "0",
            firstDueDate: new Date().toISOString().split("T")[0],
        });

        const [toast, setToast] = useState<{
            type: "success" | "error";
            message: string;
        } | null>(null);

        const showToast = (
            type: "success" | "error",
            message: string
        ) => {
            setToast({
                type,
                message,
            });
        };

        /*
         * =========================================================
         * OBTENER PLAN DE PAGO DE LA FACTURA
         * =========================================================
         */

        const {
            data: paymentPlanDetails,
            isLoading: isLoadingPaymentPlan,
            isError: isPaymentPlanError,
            error: paymentPlanError,
        } = usePaymentPlanById(
            shouldFetchPaymentPlan ? invoice?.id : undefined
        );

        /*
         * =========================================================
         * FACTURA ANTERIOR
         * =========================================================
         */

        const [prevInvoice, setPrevInvoice] =
            useState<Invoice | null>(invoice);

        /*
         * =========================================================
         * CUOTA SELECCIONADA
         * =========================================================
         */

        const [selectedInstallment, setSelectedInstallment] =
            useState<Installment | null>(null);

        /*
         * =========================================================
         * DATOS DEL PAGO
         * =========================================================
         */

        const [amount, setAmount] = useState("");

        const [paymentMethod, setPaymentMethod] =
            useState<PaymentMethods | "">("");

        const [transactionReference, setTransactionReference] =
            useState("");

        const [paymentDate, setPaymentDate] =
            useState(
                new Date()
                    .toISOString()
                    .split("T")[0]
            );

        /*
         * =========================================================
         * CUOTAS PENDIENTES
         * =========================================================
         */

        const pendingInstallments =
            paymentPlanDetails?.installments?.filter(
                (installment) =>
                    Number(installment.paidAmount || 0) <
                    Number(installment.amount || 0) +
                    Number(installment.lateFeeAmount || 0)
            ) || [];

        /*
         * =========================================================
         * SALDO PENDIENTE DE LA CUOTA
         * =========================================================
         */


        const pendingAmount = selectedInstallment
            ? Math.max(
                Number(selectedInstallment.amount || 0) +
                Number(selectedInstallment.lateFeeAmount || 0) -
                Number(selectedInstallment.paidAmount || 0),
                0
            )
            : 0;


        /*
         * =========================================================
         * VALIDAR SI SE PUEDE PAGAR LA CUOTA SELECCIONADA
         * =========================================================
         */

        const getUnpaidPreviousInstallment = (
            installment: Installment
        ): Installment | undefined => {
            return paymentPlanDetails?.installments
                ?.filter(
                    (item) =>
                        item.installmentNumber <
                        installment.installmentNumber
                )
                .find(
                    (item) =>
                        Number(item.paidAmount || 0) <
                        Number(item.amount || 0)
                );
        };
        /*
         * =========================================================
         * CUANDO CAMBIA LA FACTURA
         * =========================================================
         */

        if (invoice !== prevInvoice) {
            setPrevInvoice(invoice);

            setSelectedInstallment(null);

            setAmount("");

            setPaymentMethod("");

            setTransactionReference("");

            setPaymentDate(
                new Date()
                    .toISOString()
                    .split("T")[0]
            );
        }

        const cleanForm = () => {
            setPrevInvoice(invoice);

            setSelectedInstallment(null);

            setAmount("");

            setPaymentMethod("");

            setTransactionReference("");

            setPaymentDate(
                new Date()
                    .toISOString()
                    .split("T")[0]
            );

            setDirectPaymentForm({
                amount: "",
                paymentMethod: "",
                transactionReference: "",
                servedBy: "system",
                paymentDate: new Date().toISOString().split("T")[0],
            });

            setIsInstallmentPayment(false);

            setToast(null);
            onHide();
        };

        /*
         * =========================================================
         * CUANDO CAMBIA LA CUOTA SELECCIONADA
         * =========================================================
         */

        const handleInstallmentChange = (
            event: React.ChangeEvent<HTMLSelectElement>
        ) => {
            const installmentId =
                event.target.value;

            const installment =
                pendingInstallments.find(
                    (item) =>
                        item.id === installmentId
                ) || null;

            if (!installment) {
                setSelectedInstallment(null);
                setAmount("");
                return;
            }

            const unpaidPrevious =
                getUnpaidPreviousInstallment(installment);

            if (unpaidPrevious) {
                showToast(
                    "error",
                    `No puedes pagar la cuota ${installment.installmentNumber} sin completar primero la cuota ${unpaidPrevious.installmentNumber}.`
                );

                setSelectedInstallment(null);
                setAmount("");
                return;
            }

            setSelectedInstallment(
                installment
            );

            setAmount(
                installment
                    ? Math.max(
                        Number(
                            installment.amount || 0
                        ) +
                        Number(
                            installment.lateFeeAmount || 0
                        ) -
                        Number(
                            installment.paidAmount ||
                            0
                        ),
                        0
                    ).toString()
                    : ""
            );
        };

        const handleSubmitNoPlan = (e: React.FormEvent) => {
            e.preventDefault();

            if (!invoice?.id) {
                showToast("error", "No hay una factura seleccionada.");
                return;
            }

            // OPCIÓN A: CREAR PLAN EN CUOTAS
            if (isInstallmentPayment) {
                const numberOfInstallments = Number(installmentForm.numberOfInstallments || 0);

                if (numberOfInstallments < 2) {
                    showToast("error", "Debe indicar al menos 2 cuotas.");
                    return;
                }

                if (!installmentForm.firstDueDate) {
                    showToast("error", "Debe seleccionar la primera fecha de pago.");
                    return;
                }

                const interestRateNumber = Number(installmentForm.interestRate);

                if (isNaN(interestRateNumber) || interestRateNumber < 0 || interestRateNumber > 100) {
                    showToast(
                        "error",
                        "El porcentaje de interés debe ser un número válido entre 0% y 100%."
                    );
                    return;
                }

                // Calculamos el nuevo total incrementando el porcentaje de interés
                const originalTotal = Number(invoice.totalAmount || 0);
                const interestRate = Number(installmentForm.interestRate || 0);

                // Fórmula: Nuevo Total = Total Original + (Total Original * (Interés / 100))
                const newTotalAmount = originalTotal + (originalTotal * (interestRate / 100));

                // Recalculamos el saldo pendiente restando lo pagado
                const currentPaid = Number(invoice.paidAmount || 0);
                const newPendingAmount = Math.max(0, newTotalAmount - currentPaid);

                createPaymentPlan(
                    {
                        invoiceId: invoice.id,
                        numberOfInstallments,
                        frequencyDays: 30,
                        interestRate: interestRateNumber,
                        lateFreePercentage: 0,
                        gracePeriodDays: 0,
                        firstDueDate: installmentForm.firstDueDate,
                    },
                    {
                        onSuccess: () => {
                            updateInvoice(
                                {
                                    id: invoice.id,
                                    invoice: {
                                        patientId: invoice.patientId,
                                        patientFullName: invoice.patientFullName,
                                        treatmentPlanId: invoice.treatmentPlanId,
                                        treatmentId: invoice.treatmentId,
                                        totalAmount: newTotalAmount,
                                        paidAmount: invoice.paidAmount,
                                        pendingAmount: newPendingAmount,
                                        status: invoice.status,
                                        hasInstallment: true, // 👈 Se marca como true
                                    },
                                },
                                {
                                    onSuccess: () => {
                                        setToast({
                                            type: "success",
                                            message: "Plan de cuotas creado y factura actualizada correctamente.",
                                        });
                                        setTimeout(() => cleanForm(), 1000);
                                    },
                                    onError: (error) => {
                                        showToast(
                                            "error",
                                            error.message || "Se creó el plan, pero no se pudo actualizar la factura."
                                        );
                                    },
                                }
                            );
                        },
                        onError: (error) => {
                            showToast("error", error.message || "No se pudo crear el plan de cuotas.");
                        },
                    }
                );
                return;
            }

            // OPCIÓN B: PAGO DIRECTO
            const numericAmount = Number(directPaymentForm.amount);
            const pendingInvoiceAmount = Number(invoice.pendingAmount || 0);

            if (!numericAmount || numericAmount <= 0) {
                showToast("error", "El monto a pagar debe ser mayor a 0.");
                return;
            }

            if (numericAmount < pendingInvoiceAmount && !isInstallmentPayment) {
                showToast(
                    "error",
                    "El monto a pagar es menor que el saldo pendiente. Debe pagar el total o seleccionar 'Registrar pago en cuotas'."
                );
                return;
            }

            if (numericAmount > pendingInvoiceAmount) {
                showToast("error", "El monto pagado no puede ser mayor al saldo pendiente de la factura.");
                return;
            }

            if (!directPaymentForm.paymentMethod) {
                showToast("error", "Debe seleccionar un método de pago.");
                return;
            }

            addPaymentToInvoice(
                {
                    invoiceId: invoice.id,
                    data: {
                        invoiceId: invoice.id,
                        amount: numericAmount,
                        payment_method: directPaymentForm.paymentMethod,
                        transaction_reference: directPaymentForm.transactionReference.trim() || undefined,
                        served_by: directPaymentForm.servedBy,
                        payment_date: directPaymentForm.paymentDate,
                    },
                },
                {
                    onSuccess: () => {
                        setToast({
                            type: "success",
                            message: "Pago registrado correctamente.",
                        });
                        setTimeout(() => cleanForm(), 1000);
                    },
                    onError: (error) => {
                        showToast("error", error.message || "No se pudo registrar el pago.");
                    },
                }
            );

            cleanForm();
        };

        /*
         * =========================================================
         * REGISTRAR PAGO
         * =========================================================
         */

        const handleSubmit = (
            event: React.FormEvent
        ) => {
            event.preventDefault();

            if (!invoice || !selectedInstallment) {
                showToast(
                    "error",
                    "Debe seleccionar una cuota a pagar."
                );
                return;
            }

            const numericAmount =
                Number(amount);

            if (
                !numericAmount ||
                numericAmount <= 0
            ) {
                showToast(
                    "error",
                    "El pago no debe estar vacio ni ser menor a 0."
                );
                return;
            }


            const hasLateFee =
                Number(selectedInstallment.lateFeeAmount || 0) > 0;

            // Si tiene mora, debe pagar el saldo completo.
            // Si no tiene mora, puede realizar pagos parciales.
            if (hasLateFee && numericAmount !== pendingAmount) {
                showToast(
                    "error",
                    `Esta cuota tiene mora. Debe pagar el saldo completo de ${formatCurrency(pendingAmount)}.`
                );
                return;
            }

            if (numericAmount > pendingAmount) {
                showToast(
                    "error",
                    "El pago no puede ser mayor al saldo pendiente."
                );
                return;
            }


            if (!paymentMethod) {
                showToast(
                    "error",
                    "Debe seleccionar un metodo de pago."
                );
                return;
            }

            registerPayment(
                {
                    installmentId: selectedInstallment.id,
                    amount: numericAmount,
                    paymentMethod: paymentMethod,
                    transactionReference: transactionReference.trim() || "",
                    servedBy: "b0459bf8f4656468",
                    paymentDate,
                },
                {
                    onSuccess: () => {
                        setToast({
                            type: "success",
                            message: "Pago registrado correctamente.",
                        });

                        setTimeout(() => {
                            cleanForm();
                        }, 1000);
                    },

                    onError: (error) => {
                        setToast({
                            type: "error",
                            message:
                                error.message ||
                                "No se pudo registrar el pago.",
                        });
                    },
                }
            );
        };

        /*
         * =========================================================
         * MONEDA
         * =========================================================
         */

        const formatCurrency = (
            value: number
        ) => {
            return Number(value || 0)
                .toLocaleString("es-NI", {
                    style: "currency",
                    currency: "NIO",
                });
        };

        return (
            <GenericDrawer
                isOpen={isOpen}
                onHide={cleanForm}
                title="Registrar pago"
                description="Seleccione la cuota y registre el pago"
                width="w-80 md:w-200"
            >
                {toast && (
                    <Toast
                        type={toast.type}
                        message={toast.message}
                        onClose={() => setToast(null)}
                    />
                )}
                {!invoice ? (
                    <div className="text-sm text-slate-500">
                        No hay una factura seleccionada.
                    </div>
                ) : isLoadingPaymentPlan ? (
                    <div className="text-sm text-slate-500">
                        Cargando cuotas...
                    </div>
                ) : isPaymentPlanError ? (
                    <div className="
                    border
                    border-red-200
                    bg-red-50
                    rounded-xl
                    p-4
                ">
                        <p className="
                        text-sm
                        font-medium
                        text-red-700
                    ">
                            No se pudieron cargar las cuotas.
                        </p>

                        <p className="
                        text-xs
                        text-red-600
                        mt-1
                    ">
                            {paymentPlanError?.message ||
                                "Ocurrió un error al obtener el plan de pago."}
                        </p>
                    </div>
                ) : !paymentPlanDetails ? (

                    <NoPlanFormSection
                        invoice={invoice}
                        isInstallmentPayment={isInstallmentPayment}
                        setIsInstallmentPayment={setIsInstallmentPayment}
                        installmentForm={installmentForm}
                        setInstallmentForm={setInstallmentForm}
                        directPaymentForm={directPaymentForm}
                        setDirectPaymentForm={setDirectPaymentForm}
                        isCreatingPlan={isCreatingPlan}
                        isAddingPayment={isAddingPayment}
                        onSubmit={handleSubmitNoPlan}
                    />

                ) : pendingInstallments.length === 0 ? (
                    <div className="
                    border
                    border-green-200
                    bg-green-50
                    rounded-xl
                    p-4
                ">
                        <p className="
                        text-sm
                        font-medium
                        text-green-700
                    ">
                            No hay cuotas pendientes.
                        </p>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {/* =================================================
                            FACTURA
                        ================================================= */}

                        <InvoiceSummarySection
                            invoice={invoice}
                            formatCurrency={formatCurrency}
                        />

                        {/* =================================================
                            SELECCIONAR CUOTA
                        ================================================= */}

                        <InstallmentSelectorSection
                            selectedInstallment={selectedInstallment}
                            pendingInstallments={pendingInstallments}
                            isPending={isPending}
                            handleInstallmentChange={handleInstallmentChange}
                            formatCurrency={formatCurrency}
                        />

                        {/* =================================================
                            INFORMACIÓN DE LA CUOTA
                        ================================================= */}

                        {selectedInstallment && (

                            <InstallmentDetailsSection
                                selectedInstallment={selectedInstallment}
                                pendingAmount={pendingAmount}
                                formatCurrency={formatCurrency}
                            />

                        )}

                        {/* =================================================
                            DATOS DEL PAGO
                        ================================================= */}

                        {selectedInstallment && (

                            <InstallmentPaymentFormSection
                                amount={amount}
                                setAmount={setAmount}
                                pendingAmount={pendingAmount}
                                paymentMethod={paymentMethod}
                                setPaymentMethod={setPaymentMethod}
                                paymentDate={paymentDate}
                                setPaymentDate={setPaymentDate}
                                transactionReference={transactionReference}
                                setTransactionReference={setTransactionReference}
                                isPending={isPending}
                                formatCurrency={formatCurrency}
                            />
                            
                        )}

                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {isError && (
                            <div className="
                            border
                            border-red-200
                            bg-red-50
                            rounded-xl
                            p-4
                        ">
                                <p className="
                                text-sm
                                font-medium
                                text-red-700
                            ">
                                    No se pudo registrar el pago.
                                </p>

                                <p className="
                                text-xs
                                text-red-600
                                mt-1
                            ">
                                    {error?.message ||
                                        "Ocurrió un error al registrar el pago."}
                                </p>
                            </div>
                        )}

                        {/* =================================================
                            BOTÓN
                        ================================================= */}

                        <button
                            type="submit"
                            disabled={
                                isPending ||
                                !selectedInstallment ||
                                !amount ||
                                Number(amount) <= 0 ||
                                Number(amount) > pendingAmount ||
                                !paymentMethod
                            }
                            className="
                            w-full
                            px-4
                            py-2.5
                            rounded-lg
                            text-sm
                            font-medium
                            text-white
                            bg-[#001D4A]
                            hover:bg-[#002b6b]
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            transition
                        "
                        >
                            {isPending
                                ? "Registrando pago..."
                                : "Registrar pago"}
                        </button>
                    </form>
                )}
            </GenericDrawer>
        );
    };

export default RegisterPaymentDrawer;
