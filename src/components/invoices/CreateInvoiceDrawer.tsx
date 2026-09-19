import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import { useTreatmentPlans } from "../../hooks/useTreatmentPlan";
import type { InvoiceStatus } from "../../utils/invoiceStatus.enum";
import { useCreateInvoiceWithPayment } from "../../hooks/useInvoicesPayment";
import type { PaymentMethods } from "../../utils/paymentMethodsStatus.enum";
import type { CreateInvoiceWithPaymentDto } from "../../models/InvoicePaymentModel";

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

            // Limpiar datos de pago cuando se desactiva
            ...(checked
                ? {}
                : {
                    paymentMethod: "CASH",
                    transactionReference: "",
                    servedBy: "b0459bf8f4656468",
                    installmentId: "",
                }),
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
         * PAGO EN CUOTAS
         * =========================================================
         *
         * Si seleccionó cuotas, el monto debe ser menor al total.
         */

        if (
            form.isInstallmentPayment &&
            paidAmount >= totalAmount
        ) {
            showToast(
                "error",
                "Si desea pagar el total de una vez, desmarque 'Registrar pago en cuotas'."
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
            onSuccess: () => {
                setToast({
                    type: "success",
                    message:
                        "Factura y pago creados correctamente.",
                });

                setTimeout(() => {
                    onHide();
                }, 1000);

                cleanForm();
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

                    {/* =================================================
                        PLAN DE TRATAMIENTO
                    ================================================= */}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Plan de tratamiento
                        </label>

                        <select
                            name="treatmentPlanId"
                            value={form.treatmentPlanId}
                            onChange={handleTreatmentPlanChange}
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
                                    {treatment.code ||
                                        treatment.id}
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
                            value={form.patientFullName}
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
                            value={form.totalAmount}
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Método de pago
                        </label>

                        <select
                            name="paymentMethod"
                            value={form.paymentMethod}
                            onChange={handlePaymentMethodChange}
                            disabled={isPending}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#001D4A]"
                        >
                            <option value="CASH">Efectivo</option>
                            <option value="CARD">Tarjeta</option>
                            <option value="TRANSFER">
                                Transferencia
                            </option>
                        </select>
                    </div>

                    {(form.paymentMethod == "TRANSFER") && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Referencia de transacción
                            </label>

                            <input
                                type="text"
                                name="transactionReference"
                                value={form.transactionReference}
                                onChange={handleChange}
                                disabled={isPending}
                                placeholder="Número de referencia"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#001D4A]"
                            />
                        </div>
                    )}

                    {/* =================================================
                        MONTO PAGADO
                    ================================================= */}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Monto recibido
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            name="paidAmount"
                            value={form.paidAmount}
                            onChange={handlePaidAmountChange}
                            disabled={!form.treatmentPlanId}
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

                    {/* CHECKBOX */}
                    <div className="flex items-center gap-3 py-2">
                        <input
                            id="isInstallmentPayment"
                            type="checkbox"
                            checked={form.isInstallmentPayment}
                            onChange={handleInstallmentChange}
                            disabled={isPending}
                            className="h-4 w-4 rounded border-gray-300 text-[#001D4A] focus:ring-[#001D4A]"
                        />

                        <label
                            htmlFor="isInstallmentPayment"
                            className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                            Registrar pago en cuotas
                        </label>
                    </div>


                    {/* CUOTA */}
                    {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Referencia de cuota
                                </label>

                                <input
                                    type="text"
                                    name="installmentId"
                                    value={form.installmentId}
                                    onChange={handleChange}
                                    disabled={isPending}
                                    placeholder="ID de la cuota"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#001D4A]"
                                />
                            </div> */}

                    {/* =================================================
                        MONTO PENDIENTE
                    ================================================= */}

                    {/* <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Monto pendiente
                                </label>

                                <input
                                    type="number"
                                    name="pendingAmount"
                                    value={form.pendingAmount}
                                    disabled
                                    placeholder="0.00"
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
                            </div> */}
                </div>
            </GenericDrawer>
        </>
    );
};

export default CreateInvoiceDrawer;