import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import { useTreatmentPlans } from "../../hooks/useTreatmentPlan";
import { useAddInvoice } from "../../hooks/useInvoices";
import type { InvoiceStatus } from "../../utils/invoiceStatus.enum";

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
        mutate: addInvoice,
        isPending: isLoadingInvoice
    } = useAddInvoice();

    const [form, setForm] = useState<{
        patientId: string;
        patientFullName: string;
        treatmentPlanId: string;
        totalAmount: string;
        paidAmount: string;
        pendingAmount: string;
    }>({
        patientId: "",
        patientFullName: "",
        treatmentPlanId: "",
        totalAmount: "",
        paidAmount: "",
        pendingAmount: "",
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
        });

        setToast(null);
        onHide();
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

        addInvoice(
            {
                patientId,
                patientFullName,
                treatmentPlanId,
                totalAmount,
                paidAmount,
                pendingAmount,
                status,
            },
            {
                onSuccess: () => {
                    showToast(
                        "success",
                        "La factura se creó correctamente."
                    );

                    cleanForm();
                },

                onError: (error) => {
                    showToast(
                        "error",
                        error.message ||
                        "No se pudo crear la factura."
                    );
                },
            }
        );
    };

    const isPending =
        isLoadingInvoice ||
        isLoadingTreatments;

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

                    {/* =================================================
                        MONTO PAGADO
                    ================================================= */}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Monto a pagar
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

                    {/* =================================================
                        MONTO PENDIENTE
                    ================================================= */}

                    <div>
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
                    </div>

                </div>
            </GenericDrawer>
        </>
    );
};

export default CreateInvoiceDrawer;