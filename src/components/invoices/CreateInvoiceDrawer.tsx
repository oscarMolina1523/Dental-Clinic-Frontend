import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import { useTreatmentPlans } from "../../hooks/useTreatmentPlan";
import type { InvoiceStatus } from "../../utils/invoiceStatus.enum";
import { useCreateInvoiceWithPayment } from "../../hooks/useInvoicesPayment";
import type { PaymentMethods } from "../../utils/paymentMethodsStatus.enum";
import type { CreateInvoiceWithPaymentDto } from "../../models/InvoicePaymentModel";
import { useCreatePaymentPlanOrchestrator } from "../../hooks/usePaymentPlanOrchestrator";
import InvoiceInstallmentSection from "./InvoiceInstallmentSection";
import InvoicePaymentSection from "./InvoicePaymentSection";
import InvoiceTreatmentSection from "./InvoiceTreatmentSection";

interface CreateInvoiceProps {
    isOpen: boolean;
    onHide: () => void;
}

const CreateInvoiceDrawer: React.FC<CreateInvoiceProps> = ({
    isOpen,
    onHide
}) => {
    const {
        data: treatments = [],
        isPending: isLoadingTreatments
    } = useTreatmentPlans();

    const {
        mutate: createInvoiceWithPayment,
        isPending: isLoadingInvoiceWithPayment,
    } = useCreateInvoiceWithPayment();

    const {
        mutate: createPaymentPlan,
        isPending: isLoadingPaymentPlan,
    } = useCreatePaymentPlanOrchestrator();

    const [form, setForm] = useState<{
        patientId: string;
        patientFullName: string;
        treatmentPlanId: string;
        totalAmount: string;
        paidAmount: string;
        pendingAmount: string;

        isInstallmentPayment: boolean;
        paymentMethod: PaymentMethods;
        transactionReference: string;
        servedBy: string;
        paymentDate: string;
        installmentId: string;

        numberOfInstallments: number;
        interestRate: string;
        firstDueDate: string;
    }>({
        patientId: "",
        patientFullName: "",
        treatmentPlanId: "",
        totalAmount: "",
        paidAmount: "",
        pendingAmount: "",

        isInstallmentPayment: false,
        paymentMethod: "CASH",
        transactionReference: "",
        servedBy: "b0459bf8f4656468",
        paymentDate: new Date().toISOString().split("T")[0],
        installmentId: "",

        numberOfInstallments: 0,
        interestRate: "",
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

    const cleanForm = () => {
        setForm({
            patientId: "",
            patientFullName: "",
            treatmentPlanId: "",
            totalAmount: "",
            paidAmount: "",
            pendingAmount: "",

            isInstallmentPayment: false,
            paymentMethod: "CASH",
            transactionReference: "",
            servedBy: "b0459bf8f4656468",
            paymentDate: new Date().toISOString().split("T")[0],
            installmentId: "",

            numberOfInstallments: 0,
            interestRate: "",
            firstDueDate: new Date().toISOString().split("T")[0],
        });

        setToast(null);
        onHide();
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePaymentMethodChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const paymentMethod = e.target.value as PaymentMethods;

        setForm((prev) => ({
            ...prev,
            paymentMethod,

            // Si cambia de transferencia a otro método,
            // limpiamos la referencia.
            transactionReference:
                paymentMethod === "TRANSFER"
                    ? prev.transactionReference
                    : "",
        }));
    };


    /*
     * =========================================================
     * CAMBIO DEL PLAN DE TRATAMIENTO
     * =========================================================
     */

    const handleTreatmentPlanChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const treatmentPlanId = e.target.value;

        // Si vuelve a seleccionar vacío
        if (!treatmentPlanId) {
            setForm({
                patientId: "",
                patientFullName: "",
                treatmentPlanId: "",
                totalAmount: "",
                paidAmount: "",
                pendingAmount: "",

                isInstallmentPayment: false,
                paymentMethod: "CASH",
                transactionReference: "",
                servedBy: "b0459bf8f4656468",
                paymentDate: new Date().toISOString().split("T")[0],
                installmentId: "",

                numberOfInstallments: 0,
                interestRate: "",
                firstDueDate: new Date().toISOString().split("T")[0],
            });

            return;
        }

        const selectedTreatmentPlan = treatments.find(
            (treatment) =>
                String(treatment.id) === treatmentPlanId
        );

        if (!selectedTreatmentPlan) {
            return;
        }

        const totalAmount = Number(
            selectedTreatmentPlan.totalAmount || 0
        );

        setForm((prev) => ({
            ...prev,
            treatmentPlanId,
            patientId: selectedTreatmentPlan.patientId || "",
            patientFullName:
                selectedTreatmentPlan.patientFullName || "",
            totalAmount: String(totalAmount),

            // Al seleccionar un nuevo plan comienza sin pago
            paidAmount: "",

            // Inicialmente todo está pendiente
            pendingAmount: String(totalAmount),
        }));
    };

    /*
     * =========================================================
     * CAMBIO DEL MONTO PAGADO
     * =========================================================
     */

    const handlePaidAmountChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;

        const paidAmount = Number(value || 0);
        const totalAmount = Number(form.totalAmount || 0);

        const pendingAmount = Math.max(
            0,
            totalAmount - paidAmount
        );

        setForm((prev) => ({
            ...prev,
            paidAmount: value,
            pendingAmount: String(pendingAmount),
        }));
    };

    const handleInstallmentChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const checked = e.target.checked;

        setForm((prev) => ({
            ...prev,
            isInstallmentPayment: checked,

            // Si se activa el plan de cuotas,
            // no se registra ningún pago inicial.
            paidAmount: checked ? "0" : "",

            // Todo el total queda pendiente.
            pendingAmount: checked
                ? prev.totalAmount
                : prev.pendingAmount,

            // Limpiar datos de pago inicial.
            ...(checked
                ? {
                    paymentMethod: "CASH",
                    transactionReference: "",
                    installmentId: "",
                }
                : {}),
        }));
    };


    /*
     * =========================================================
     * SUBMIT
     * =========================================================
     */

    const handleSubmit = () => {
        const patientId = form.patientId.trim();
        const patientFullName = form.patientFullName.trim();
        const treatmentPlanId = form.treatmentPlanId.trim();

        const totalAmount = Number(
            form.totalAmount || 0
        );

        const paidAmount = Number(
            form.paidAmount || 0
        );

        const pendingAmount = Math.max(
            0,
            totalAmount - paidAmount
        );

        let status: InvoiceStatus;

        if (paidAmount === 0) {
            status = "PENDING";
        } else if (paidAmount === totalAmount) {
            status = "PAID";
        } else {
            status = "PARTIALLY_PAID";
        }

        /*
         * -----------------------------------------------------
         * VALIDACIONES
         * -----------------------------------------------------
         */

        if (!treatmentPlanId) {
            showToast(
                "error",
                "Debe seleccionar un plan de tratamiento."
            );
            return;
        }

        if (!patientId) {
            showToast(
                "error",
                "El paciente no está asociado al plan de tratamiento."
            );
            return;
        }

        if (totalAmount <= 0) {
            showToast(
                "error",
                "El monto total debe ser mayor a cero."
            );
            return;
        }

        if (paidAmount < 0) {
            showToast(
                "error",
                "El monto pagado no puede ser negativo."
            );
            return;
        }

        if (paidAmount > totalAmount) {
            showToast(
                "error",
                "El monto pagado no puede ser mayor al total."
            );
            return;
        }

        /*
     * =========================================================
     * PAGO PARCIAL SIN CUOTAS
     * =========================================================
     *
     * Si paga menos del total y no seleccionó cuotas,
     * no permitimos crear.
     */

        if (
            paidAmount < totalAmount &&
            !form.isInstallmentPayment
        ) {
            showToast(
                "error",
                "El monto a pagar es menor que el total. Puede pagar el total de una vez o seleccionar 'Registrar pago en cuotas' para realizar el pago en planes."
            );

            return;
        }


        /*
         * =========================================================
         * DATOS DEL PAGO
         * =========================================================
         */

        if (!form.servedBy.trim()) {
            showToast(
                "error",
                "Debe indicar quién atendió el pago."
            );
            return;
        }

        if (!form.paymentDate) {
            showToast(
                "error",
                "Debe indicar la fecha del pago."
            );
            return;
        }

        /*
         * =========================================================
         * TRANSFERENCIA
         * =========================================================
         */

        if (
            form.paymentMethod === "TRANSFER" &&
            !form.transactionReference.trim()
        ) {
            showToast(
                "error",
                "Debe ingresar la referencia de la transferencia."
            );

            return;
        }

        if (form.isInstallmentPayment) {
            const numberOfInstallments =
                Number(form.numberOfInstallments || 0);

            const interestRate =
                Number(form.interestRate || 0);

            if (numberOfInstallments < 2) {
                showToast(
                    "error",
                    "Debe indicar al menos 2 cuotas."
                );
                return;
            }

            if (interestRate < 0) {
                showToast(
                    "error",
                    "El porcentaje de interés no puede ser negativo."
                );
                return;
            }

            if (interestRate > 100) {
                showToast(
                    "error",
                    "El porcentaje de interés no puede ser mayor al 100%."
                );
                return;
            }

            if (!form.firstDueDate) {
                showToast(
                    "error",
                    "Debe seleccionar la primera fecha de pago."
                );
                return;
            }
        }

        const invoice = {
            patientId,
            patientFullName,
            treatmentPlanId,
            totalAmount,
            paidAmount,
            pendingAmount,
            status,
        };

        // ==========================================
        // CON PAGO / CUOTAS
        // ==========================================
        const data: CreateInvoiceWithPaymentDto = {
            invoice,
            payment: {
                amount: paidAmount,
                payment_method: form.paymentMethod,
                transaction_reference:
                    form.transactionReference.trim() || undefined,
                served_by: form.servedBy.trim(),
                payment_date: form.paymentDate,
                installment_id:
                    form.installmentId.trim() || undefined,
            },
        };

        createInvoiceWithPayment(data, {
            onSuccess: (response) => {
                // setToast({
                //     type: "success",
                //     message:
                //         "Factura y pago creados correctamente.",
                // });

                // setTimeout(() => {
                //     onHide();
                // }, 1000);

                // cleanForm();

                // =====================================================
                // PAGO NORMAL
                // =====================================================

                if (!form.isInstallmentPayment) {
                    setToast({
                        type: "success",
                        message:
                            "Factura y pago creados correctamente.",
                    });

                    setTimeout(() => {
                        cleanForm();
                    }, 1000);

                    return;
                }

                // =====================================================
                // VALIDAR DATOS DEL PLAN
                // =====================================================

                const numberOfInstallments =
                    Number(form.numberOfInstallments || 0);

                if (numberOfInstallments < 2) {
                    showToast(
                        "error",
                        "Debe indicar al menos 2 cuotas."
                    );
                    return;
                }

                if (!form.firstDueDate) {
                    showToast(
                        "error",
                        "Debe seleccionar la primera fecha de pago."
                    );
                    return;
                }

                // =====================================================
                // OBTENER ID DE FACTURA
                // =====================================================

                const invoiceId = response?.invoice.id;

                if (!invoiceId) {
                    showToast(
                        "error",
                        "La factura fue creada, pero no se pudo obtener su ID para crear el plan de cuotas."
                    );
                    return;
                }

                // =====================================================
                // CREAR PLAN DE PAGOS
                // =====================================================

                createPaymentPlan(
                    {
                        invoiceId: String(invoiceId),
                        numberOfInstallments,
                        frequencyDays: 30,
                        interestRate: Number(form.interestRate || 0),
                        lateFreePercentage: 0,
                        gracePeriodDays: 0,
                        firstDueDate: form.firstDueDate,
                    },
                    {
                        onSuccess: () => {
                            setToast({
                                type: "success",
                                message:
                                    "Factura, pago y plan de cuotas creados correctamente.",
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
                                    "La factura fue creada, pero no se pudo crear el plan de cuotas.",
                            });
                        },
                    }
                );
            },
            onError: (error) => {
                setToast({
                    type: "error",
                    message:
                        error.message ||
                        "No se pudo crear la factura y el pago.",
                });
            },
        });

        return;

    };

    const isPending =
        isLoadingTreatments ||
        isLoadingPaymentPlan ||
        isLoadingInvoiceWithPayment;

    return (
        <>
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Overlay */}
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

            <GenericDrawer
                isOpen={isOpen}
                onHide={onHide}
                title="Nueva Factura"
                description="Registra una nueva factura"
                width="w-112.5"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={onHide}
                            disabled={isPending}
                            className="
                                px-4 py-2.5
                                text-sm font-medium
                                text-slate-600
                                hover:bg-slate-100
                                rounded-lg
                                transition-colors
                                cursor-pointer
                                disabled:opacity-50
                            "
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isPending}
                            className="
                                px-4 py-2.5
                                text-sm font-medium
                                text-white
                                bg-[#001D4A]
                                rounded-lg
                                transition-colors
                                cursor-pointer
                                disabled:opacity-50
                            "
                        >
                            {isPending
                                ? "Creando..."
                                : "Crear Factura"}
                        </button>
                    </>
                }
            >
                <div className="space-y-5">

                    <InvoiceTreatmentSection
                        treatmentPlanId={form.treatmentPlanId}
                        patientFullName={form.patientFullName}
                        totalAmount={form.totalAmount}
                        treatments={treatments}
                        isLoadingTreatments={isLoadingTreatments}
                        onTreatmentPlanChange={
                            handleTreatmentPlanChange
                        }
                    />

                    <InvoicePaymentSection
                        paymentMethod={form.paymentMethod}
                        transactionReference={
                            form.transactionReference
                        }
                        paidAmount={form.paidAmount}
                        isInstallmentPayment={
                            form.isInstallmentPayment
                        }
                        isPending={isPending}
                        hasTreatmentPlan={
                            !!form.treatmentPlanId
                        }
                        onPaymentMethodChange={
                            handlePaymentMethodChange
                        }
                        onChange={handleChange}
                        onPaidAmountChange={
                            handlePaidAmountChange
                        }
                        onInstallmentChange={
                            handleInstallmentChange
                        }
                    />

                    {form.isInstallmentPayment && (
                        <InvoiceInstallmentSection
                            numberOfInstallments={
                                form.numberOfInstallments
                            }
                            interestRate={
                                form.interestRate
                            }
                            firstDueDate={
                                form.firstDueDate
                            }
                            isPending={isPending}
                            onChange={handleChange}
                        />
                    )}
                </div>
            </GenericDrawer>
        </>
    );
};

export default CreateInvoiceDrawer;