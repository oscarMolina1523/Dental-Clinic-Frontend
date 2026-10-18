import React from "react";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import type Invoice from "../../models/InvoiceModel"
import type Payment from "../../models/PaymentModel";
import type Installment from "../../models/InstallmentModel";
import { usePaymentPlanById } from "../../hooks/usePaymentPlanOrchestrator";
import { invoiceStatusSpanishOptions } from "../../utils/invoiceStatus.enum";
import { PaymentPlanStatusSpanishOptions } from "../../utils/paymentPlanStatus.enum";
import { InstallmentStatusSpanishOptions } from "../../utils/installmentStatus.enum";
import { PaymentMehodsSpanishOptions } from "../../utils/paymentMethodsStatus.enum";
import { exportInvoicePdf } from "../../services/invoicePdf";
import { FileDown } from "lucide-react";

interface ShowDetailsInvoiceDrawerProps {
    isOpen: boolean;
    onHide: () => void;
    invoice: Invoice | null;
}

const ShowDetailsInvoiceDrawer: React.FC<
    ShowDetailsInvoiceDrawerProps
> = ({
    isOpen,
    onHide,
    invoice,
}) => {

        /*
         * =========================================================
         * ESTADO DE LA FACTURA
         * =========================================================
         */

        const isPaid =
            invoice?.status === "PAID";

        /*
         * =========================================================
         * PLAN DE PAGOS
         *
         * Si la factura está PAID:
         *     NO hacemos request.
         *
         * Si la factura tiene otro estado:
         *     buscamos el plan utilizando invoice.id.
         * =========================================================
         */

        const {
            data: paymentPlanDetails,
            isLoading: isLoadingPaymentPlan,
            isError: isPaymentPlanError,
            error: paymentPlanError,
        } = usePaymentPlanById(
            invoice?.status !== "PAID" && invoice?.hasInstallment
                ? invoice?.id
                : undefined
        );

        return (
            <>
                {/* =================================================
                OVERLAY
            ================================================= */}

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

                {/* =================================================
                    DRAWER
                ================================================= */}

                <GenericDrawer
                    isOpen={isOpen}
                    onHide={onHide}
                    title="Detalle de Factura"
                    description="Información de la factura y pagos"
                    width="w-80 md:w-200"
                >

                    {!invoice ? (

                        <div className="text-sm text-slate-500">
                            No hay información de la factura.
                        </div>

                    ) : (

                        <div className="space-y-5">

                            <button
                                type="button"
                                onClick={() => {
                                    if (invoice) {
                                        exportInvoicePdf(invoice, paymentPlanDetails ?? null);
                                    }
                                }}
                                disabled={!invoice || isLoadingPaymentPlan}
                                className="
                                    inline-flex w-full items-center justify-center gap-2
                                    rounded-lg bg-teal-700 px-4 py-3
                                    text-sm font-semibold text-white
                                    transition-colors hover:bg-teal-800
                                    disabled:cursor-not-allowed disabled:opacity-50
                                    focus:outline-none focus:ring-2
                                    focus:ring-teal-500 focus:ring-offset-2
                                "
                            >
                                <FileDown size={18} />
                                Exportar factura a PDF
                            </button>
                            {/* =================================================
                                INFORMACIÓN DE LA FACTURA
                            ================================================= */}

                            <div>

                                <div className="flex items-center gap-4 my-6">
                                    <div className="flex-1 h-px bg-slate-200" />

                                    <h2 className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                                        Información de la Factura
                                    </h2>

                                    <div className="flex-1 h-px bg-slate-200" />
                                </div>

                                <div className="space-y-4">

                                    <div className="flex flex-col md:flex-row gap-2 w-full">
                                        {/* NÚMERO DE FACTURA */}

                                        <div className="flex-1">
                                            <label
                                                className="
                                            block
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            mb-2
                                        "
                                            >
                                                Número de factura
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    invoice.invoiceNumber || ""
                                                }
                                                disabled
                                                className="
                                            w-full
                                            px-3 py-2.5
                                            border border-slate-200
                                            rounded-lg
                                            text-sm
                                            bg-slate-50
                                            text-slate-500
                                            outline-none
                                        "
                                            />
                                        </div>

                                        {/* ESTADO */}

                                        <div className="flex-1">
                                            <label
                                                className="
                                            block
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            mb-2
                                        "
                                            >
                                                Estado
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    invoiceStatusSpanishOptions.find(
                                                        (option) => option.value === invoice.status
                                                    )?.label || ""
                                                }
                                                disabled
                                                className="
                                            w-full
                                            px-3 py-2.5
                                            border border-slate-200
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
                                        {/* PACIENTE */}

                                        <div>
                                            <label
                                                className="
                                            block
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            mb-2
                                        "
                                            >
                                                Deudor
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    invoice.patientFullName || ""
                                                }
                                                disabled
                                                className="
                                            w-full
                                            px-3 py-2.5
                                            border border-slate-200
                                            rounded-lg
                                            text-sm
                                            bg-slate-50
                                            text-slate-500
                                            outline-none
                                        "
                                            />
                                        </div>

                                        {/* TOTAL */}

                                        <div>
                                            <label
                                                className="
                                            block
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            mb-2
                                        "
                                            >
                                                Total a pagar
                                            </label>

                                            <input
                                                type="text"
                                                value={Number(
                                                    invoice.totalAmount || 0
                                                ).toLocaleString("es-NI", {
                                                    style: "currency",
                                                    currency: "NIO",
                                                })}
                                                disabled
                                                className="
                                            w-full
                                            px-3 py-2.5
                                            border border-slate-200
                                            rounded-lg
                                            text-sm
                                            bg-slate-50
                                            text-slate-500
                                            outline-none
                                        "
                                            />
                                        </div>

                                        {/* PAGADO */}

                                        <div>
                                            <label
                                                className="
                                            block
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            mb-2
                                        "
                                            >
                                                Monto pagado
                                            </label>

                                            <input
                                                type="text"
                                                value={Number(
                                                    invoice.paidAmount || 0
                                                ).toLocaleString("es-NI", {
                                                    style: "currency",
                                                    currency: "NIO",
                                                })}
                                                disabled
                                                className="
                                            w-full
                                            px-3 py-2.5
                                            border border-slate-200
                                            rounded-lg
                                            text-sm
                                            bg-slate-50
                                            text-slate-500
                                            outline-none
                                        "
                                            />
                                        </div>

                                        {/* PENDIENTE */}

                                        <div>
                                            <label
                                                className="
                                            block
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            mb-2
                                        "
                                            >
                                                Monto pendiente
                                            </label>

                                            <input
                                                type="text"
                                                value={Number(
                                                    invoice.pendingAmount || 0
                                                ).toLocaleString("es-NI", {
                                                    style: "currency",
                                                    currency: "NIO",
                                                })}
                                                disabled
                                                className="
                                            w-full
                                            px-3 py-2.5
                                            border border-slate-200
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

                            {/* =================================================
                                FACTURA PAGADA
                            ================================================= */}

                            {isPaid && (

                                <div
                                    className="
                                    border-t
                                    border-slate-100
                                    pt-5
                                "
                                >

                                    <div
                                        className="
                                        border
                                        border-slate-200
                                        rounded-xl
                                        p-4
                                        bg-slate-50
                                    "
                                    >
                                        <p
                                            className="
                                            text-sm
                                            font-medium
                                            text-slate-700
                                        "
                                        >
                                            Esta factura se encuentra
                                            completamente pagada.
                                        </p>

                                        <p
                                            className="
                                            text-xs
                                            text-slate-500
                                            mt-1
                                        "
                                        >
                                            No tiene información de un
                                            plan de cuotas que consultar.
                                        </p>
                                    </div>

                                </div>

                            )}

                            {/* =================================================
                                CARGANDO PLAN
                            ================================================= */}

                            {!isPaid &&
                                isLoadingPaymentPlan && (

                                    <div
                                        className="
                                        border-t
                                        border-slate-100
                                        pt-5
                                    "
                                    >

                                        <div
                                            className="
                                            text-sm
                                            text-slate-500
                                        "
                                        >
                                            Consultando información del
                                            plan de cuotas...
                                        </div>

                                    </div>
                                )}

                            {/* =================================================
                                ERROR
                            ================================================= */}

                            {!isPaid &&
                                isPaymentPlanError && (

                                    <div
                                        className="
                                        border-t
                                        border-slate-100
                                        pt-5
                                    "
                                    >

                                        <div
                                            className="
                                            border
                                            border-red-200
                                            bg-red-50
                                            rounded-xl
                                            p-4
                                        "
                                        >

                                            <p
                                                className="
                                                text-sm
                                                font-medium
                                                text-red-700
                                            "
                                            >
                                                No se pudo obtener el
                                                plan de cuotas.
                                            </p>

                                            <p
                                                className="
                                                text-xs
                                                text-red-600
                                                mt-1
                                            "
                                            >
                                                {paymentPlanError?.message ||
                                                    "Ocurrió un error al consultar el plan."}
                                            </p>

                                        </div>

                                    </div>
                                )}

                            {/* =================================================
                                FACTURA SIN PLAN
                            ================================================= */}

                            {!isPaid &&
                                !isLoadingPaymentPlan &&
                                !isPaymentPlanError &&
                                !paymentPlanDetails && (

                                    <div
                                        className="
                                        border-t
                                        border-slate-100
                                        pt-5
                                    "
                                    >

                                        <div
                                            className="
                                            border
                                            border-slate-200
                                            rounded-xl
                                            p-4
                                        "
                                        >

                                            <p
                                                className="
                                                text-sm
                                                font-medium
                                                text-slate-700
                                            "
                                            >
                                                Esta factura no tiene un
                                                plan de cuotas.
                                            </p>

                                        </div>

                                    </div>
                                )}

                            {/* =================================================
                                PLAN DE CUOTAS
                            ================================================= */}

                            {!isPaid &&
                                paymentPlanDetails && (

                                    <div
                                        className="
                                        border-t
                                        border-slate-100
                                        pt-5
                                        space-y-5
                                    "
                                    >
                                        <div className="flex items-center gap-4 my-6">
                                            <div className="flex-1 h-px bg-slate-200" />

                                            <div className="flex flex-col items-center">
                                                <h2 className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                                                    Información del plan de cuotas
                                                </h2>
                                                <p
                                                    className="
                                                        text-xs
                                                        text-slate-500
                                                        mt-1
                                                    "
                                                >
                                                    Información del plan de
                                                    pago asociado a la factura.
                                                </p>
                                            </div>

                                            <div className="flex-1 h-px bg-slate-200" />
                                        </div>


                                        {/* DATOS DEL PLAN */}

                                        <div
                                            className="
                                            border
                                            border-slate-200
                                            rounded-xl
                                            p-4
                                            space-y-4
                                        "
                                        >
                                            <div className="flex flex-col md:flex-row gap-2 w-full">
                                                <div className="flex-1">
                                                    <label
                                                        className="
                                                    block
                                                    text-sm
                                                    font-medium
                                                    text-slate-700
                                                    mb-2
                                                "
                                                    >
                                                        Total del plan
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={Number(
                                                            paymentPlanDetails
                                                                .paymentPlan
                                                                .totalAmount || 0
                                                        ).toLocaleString("es-NI", {
                                                            style: "currency",
                                                            currency: "NIO",
                                                        })}
                                                        disabled
                                                        className="
                                                    w-full
                                                    px-3 py-2.5
                                                    border border-slate-200
                                                    rounded-lg
                                                    text-sm
                                                    bg-slate-50
                                                    text-slate-500
                                                    outline-none
                                                "
                                                    />
                                                </div>

                                                <div className="flex-1">
                                                    <label
                                                        className="
                                                    block
                                                    text-sm
                                                    font-medium
                                                    text-slate-700
                                                    mb-2
                                                "
                                                    >
                                                        Número de cuotas
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={
                                                            paymentPlanDetails
                                                                .paymentPlan
                                                                .numberOfInstallments ??
                                                            ""
                                                        }
                                                        disabled
                                                        className="
                                                    w-full
                                                    px-3 py-2.5
                                                    border border-slate-200
                                                    rounded-lg
                                                    text-sm
                                                    bg-slate-50
                                                    text-slate-500
                                                    outline-none
                                                "
                                                    />
                                                </div>

                                                <div className="flex-1">
                                                    <label
                                                        className="
                                                    block
                                                    text-sm
                                                    font-medium
                                                    text-slate-700
                                                    mb-2
                                                "
                                                    >
                                                        Frecuencia
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={`Cada ${paymentPlanDetails.paymentPlan.frequencyDays ?? ""} días`}
                                                        disabled
                                                        className="
                                                    w-full
                                                    px-3 py-2.5
                                                    border border-slate-200
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
                                                    <label
                                                        className="
                                                    block
                                                    text-sm
                                                    font-medium
                                                    text-slate-700
                                                    mb-2
                                                "
                                                    >
                                                        Interés
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={`${paymentPlanDetails.paymentPlan.interestRate ?? 0}%`}
                                                        disabled
                                                        className="
                                                    w-full
                                                    px-3 py-2.5
                                                    border border-slate-200
                                                    rounded-lg
                                                    text-sm
                                                    bg-slate-50
                                                    text-slate-500
                                                    outline-none
                                                "
                                                    />
                                                </div>

                                                <div className="flex-1">
                                                    <label
                                                        className="
                                                    block
                                                    text-sm
                                                    font-medium
                                                    text-slate-700
                                                    mb-2
                                                "
                                                    >
                                                        Estado del plan
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={
                                                            PaymentPlanStatusSpanishOptions.find(
                                                                (option) => option.value === paymentPlanDetails
                                                                    .paymentPlan
                                                                    .status
                                                            )?.label || ""
                                                        }
                                                        disabled
                                                        className="
                                                    w-full
                                                    px-3 py-2.5
                                                    border border-slate-200
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

                                        {/* =================================================
                                            CUOTAS
                                        ================================================= */}

                                        <div>

                                            <div className="flex items-center gap-4 my-6">
                                                <div className="flex-1 h-px bg-slate-200" />

                                                <div className="flex flex-col items-center">
                                                    <h2 className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                                                        Cuotas
                                                    </h2>
                                                    <p
                                                        className="
                                                        text-xs
                                                        text-slate-500
                                                        mt-1
                                                    "
                                                    >
                                                        Cuotas asociadas al plan de pago.
                                                    </p>
                                                </div>

                                                <div className="flex-1 h-px bg-slate-200" />
                                            </div>

                                            <div className="space-y-4">

                                                {paymentPlanDetails
                                                    .installments
                                                    ?.length > 0 ? (

                                                    paymentPlanDetails
                                                        .installments
                                                        .map(
                                                            (
                                                                installment: Installment
                                                            ) => (

                                                                <div
                                                                    key={
                                                                        installment.id
                                                                    }
                                                                    className="
                                                                    border
                                                                    border-slate-200
                                                                    rounded-xl
                                                                    p-4
                                                                    space-y-3
                                                                "
                                                                >

                                                                    <div
                                                                        className="
                                                                        flex
                                                                        items-center
                                                                        justify-between
                                                                    "
                                                                    >

                                                                        <span
                                                                            className="
                                                                            text-sm
                                                                            font-semibold
                                                                            text-slate-700
                                                                        "
                                                                        >
                                                                            Cuota{" "}
                                                                            {
                                                                                installment
                                                                                    .installmentNumber
                                                                            }
                                                                        </span>

                                                                        <span
                                                                            className="
                                                                            text-xs
                                                                            font-medium
                                                                            text-slate-500
                                                                        "
                                                                        >
                                                                            {
                                                                                InstallmentStatusSpanishOptions.find(
                                                                                    (option) => option.value === installment
                                                                                        .status
                                                                                )?.label || ""
                                                                            }
                                                                        </span>

                                                                    </div>

                                                                    <div className="flex flex-col md:flex-row gap-2 w-full">
                                                                        <div className="flex-1">

                                                                            <label
                                                                                className="
                                                                            block
                                                                            text-xs
                                                                            font-medium
                                                                            text-slate-600
                                                                            mb-1
                                                                        "
                                                                            >
                                                                                Monto
                                                                            </label>

                                                                            <input
                                                                                type="text"
                                                                                value={Number(
                                                                                    installment
                                                                                        .amount || 0
                                                                                ).toLocaleString(
                                                                                    "es-NI",
                                                                                    {
                                                                                        style: "currency",
                                                                                        currency: "NIO",
                                                                                    }
                                                                                )}
                                                                                disabled
                                                                                className="
                                                                            w-full
                                                                            px-3 py-2
                                                                            border border-slate-200
                                                                            rounded-lg
                                                                            text-sm
                                                                            bg-slate-50
                                                                            text-slate-500
                                                                            outline-none
                                                                        "
                                                                            />

                                                                        </div>

                                                                        <div className="flex-1">

                                                                            <label
                                                                                className="
                                                                            block
                                                                            text-xs
                                                                            font-medium
                                                                            text-slate-600
                                                                            mb-1
                                                                        "
                                                                            >
                                                                                Pagado
                                                                            </label>

                                                                            <input
                                                                                type="text"
                                                                                value={Number(
                                                                                    installment
                                                                                        .paidAmount || 0
                                                                                ).toLocaleString(
                                                                                    "es-NI",
                                                                                    {
                                                                                        style: "currency",
                                                                                        currency: "NIO",
                                                                                    }
                                                                                )}
                                                                                disabled
                                                                                className="
                                                                            w-full
                                                                            px-3 py-2
                                                                            border border-slate-200
                                                                            rounded-lg
                                                                            text-sm
                                                                            bg-slate-50
                                                                            text-slate-500
                                                                            outline-none
                                                                        "
                                                                            />

                                                                        </div>

                                                                        <div className="flex-1">

                                                                            <label
                                                                                className="
                                                                            block
                                                                            text-xs
                                                                            font-medium
                                                                            text-slate-600
                                                                            mb-1
                                                                        "
                                                                            >
                                                                                Fecha Limite de pago
                                                                            </label>

                                                                            <input
                                                                                type="text"
                                                                                value={
                                                                                    installment.dueDate
                                                                                        ? new Date(
                                                                                            installment.dueDate
                                                                                        ).toLocaleDateString(
                                                                                            "es-NI"
                                                                                        )
                                                                                        : "N/A"
                                                                                }
                                                                                disabled
                                                                                className="
                                                                            w-full
                                                                            px-3 py-2
                                                                            border border-slate-200
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
                                                            )
                                                        )

                                                ) : (

                                                    <div
                                                        className="
                                                        text-sm
                                                        text-slate-500
                                                        border
                                                        border-slate-200
                                                        rounded-xl
                                                        p-4
                                                    "
                                                    >
                                                        No hay cuotas registradas.
                                                    </div>

                                                )}

                                            </div>

                                        </div>

                                        {/* =================================================
                                            PAGOS
                                        ================================================= */}

                                        <div>
                                            <div className="flex items-center gap-4 my-6">
                                                <div className="flex-1 h-px bg-slate-200" />

                                                <div className="flex flex-col items-center">
                                                    <h2 className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                                                        Pagos registrados
                                                    </h2>
                                                    <p
                                                        className="
                                                        text-xs
                                                        text-slate-500
                                                        mt-1
                                                    "
                                                    >
                                                        Pagos realizados sobre esta factura.
                                                    </p>
                                                </div>

                                                <div className="flex-1 h-px bg-slate-200" />
                                            </div>

                                            <div className="space-y-4">

                                                {paymentPlanDetails
                                                    .payments
                                                    ?.length > 0 ? (

                                                    paymentPlanDetails
                                                        .payments
                                                        .map(
                                                            (payment: Payment) => (

                                                                <div
                                                                    key={
                                                                        payment.id
                                                                    }
                                                                    className="
                                                                    border
                                                                    border-slate-200
                                                                    rounded-xl
                                                                    p-4
                                                                    space-y-3
                                                                "
                                                                >

                                                                    <div className="flex flex-col md:flex-row gap-2 w-full">
                                                                        <div className="flex-1">
                                                                            <label
                                                                                className="
                                                                            block
                                                                            text-xs
                                                                            font-medium
                                                                            text-slate-600
                                                                            mb-1
                                                                        "
                                                                            >
                                                                                Monto
                                                                            </label>

                                                                            <input
                                                                                type="text"
                                                                                value={Number(
                                                                                    payment.amount || 0
                                                                                ).toLocaleString(
                                                                                    "es-NI",
                                                                                    {
                                                                                        style: "currency",
                                                                                        currency: "NIO",
                                                                                    }
                                                                                )}
                                                                                disabled
                                                                                className="
                                                                            w-full
                                                                            px-3 py-2
                                                                            border border-slate-200
                                                                            rounded-lg
                                                                            text-sm
                                                                            bg-slate-50
                                                                            text-slate-500
                                                                            outline-none
                                                                        "
                                                                            />
                                                                        </div>

                                                                        <div className="flex-1">
                                                                            <label
                                                                                className="
                                                                            block
                                                                            text-xs
                                                                            font-medium
                                                                            text-slate-600
                                                                            mb-1
                                                                        "
                                                                            >
                                                                                Método de pago
                                                                            </label>

                                                                            <input
                                                                                type="text"
                                                                                value={
                                                                                    PaymentMehodsSpanishOptions.find(
                                                                                        (option) => option.value === payment.payment_method
                                                                                    )?.label || ""
                                                                                }
                                                                                disabled
                                                                                className="
                                                                            w-full
                                                                            px-3 py-2
                                                                            border border-slate-200
                                                                            rounded-lg
                                                                            text-sm
                                                                            bg-slate-50
                                                                            text-slate-500
                                                                            outline-none
                                                                        "
                                                                            />
                                                                        </div>

                                                                        <div className="flex-1">
                                                                            <label
                                                                                className="
                                                                            block
                                                                            text-xs
                                                                            font-medium
                                                                            text-slate-600
                                                                            mb-1
                                                                        "
                                                                            >
                                                                                Referencia
                                                                            </label>

                                                                            <input
                                                                                type="text"
                                                                                value={
                                                                                    payment.transaction_reference ||
                                                                                    "N/A"
                                                                                }
                                                                                disabled
                                                                                className="
                                                                            w-full
                                                                            px-3 py-2
                                                                            border border-slate-200
                                                                            rounded-lg
                                                                            text-sm
                                                                            bg-slate-50
                                                                            text-slate-500
                                                                            outline-none
                                                                        "
                                                                            />
                                                                        </div>

                                                                        <div className="flex-1">
                                                                            <label
                                                                                className="
                                                                            block
                                                                            text-xs
                                                                            font-medium
                                                                            text-slate-600
                                                                            mb-1
                                                                        "
                                                                            >
                                                                                Fecha del pago
                                                                            </label>

                                                                            <input
                                                                                type="text"
                                                                                value={
                                                                                    payment.payment_date
                                                                                        ? new Date(
                                                                                            payment.payment_date
                                                                                        ).toLocaleDateString(
                                                                                            "es-NI"
                                                                                        )
                                                                                        : "N/A"
                                                                                }
                                                                                disabled
                                                                                className="
                                                                            w-full
                                                                            px-3 py-2
                                                                            border border-slate-200
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
                                                            )
                                                        )

                                                ) : (

                                                    <div
                                                        className="
                                                        text-sm
                                                        text-slate-500
                                                        border
                                                        border-slate-200
                                                        rounded-xl
                                                        p-4
                                                    "
                                                    >
                                                        No hay pagos registrados.
                                                    </div>

                                                )}

                                            </div>

                                        </div>

                                    </div>
                                )}

                        </div>
                    )}

                </GenericDrawer>
            </>
        );
    };

export default ShowDetailsInvoiceDrawer;