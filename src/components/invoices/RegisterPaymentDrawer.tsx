import React, { useState } from "react";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import {
    usePaymentPlanById,
    useRegisterPayment,
} from "../../hooks/usePaymentPlanOrchestrator";
import type { PaymentMethods } from "../../utils/paymentMethodsStatus.enum";
import type Invoice from "../../models/InvoiceModel";
import type Installment from "../../models/InstallmentModel";
import Toast from "../../shared/Toast";

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
        const invoiceId = invoice?.id || "";
        const {
            mutate: registerPayment,
            isPending,
            isError,
            error,
        } = useRegisterPayment(invoiceId);

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
            invoice?.id
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
                    Number(installment.amount || 0)
            ) || [];

        /*
         * =========================================================
         * SALDO PENDIENTE DE LA CUOTA
         * =========================================================
         */

        const pendingAmount = selectedInstallment
            ? Math.max(
                Number(
                    selectedInstallment.amount || 0
                ) -
                Number(
                    selectedInstallment.paidAmount || 0
                ),
                0
            )
            : 0;

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

            setSelectedInstallment(
                installment
            );

            setAmount(
                installment
                    ? Math.max(
                        Number(
                            installment.amount || 0
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

            if (
                numericAmount > pendingAmount
            ) {
                showToast(
                    "error",
                    "El pago de la cuota no puede ser mayor al pago pendiente."
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
                onHide={onHide}
                title="Registrar pago"
                description="Seleccione la cuota y registre el pago"
                width="w-112.5"
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
                    <div className="text-sm text-slate-500">
                        Esta factura no tiene un plan de pago.
                    </div>
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

                        <div>
                            <h3 className="
                            text-sm
                            font-semibold
                            text-slate-800
                            mb-4
                        ">
                                Información de la factura
                            </h3>

                            <div className="
                            border
                            border-slate-200
                            rounded-xl
                            p-4
                            space-y-4
                        ">
                                <div>
                                    <label className="
                                    block
                                    text-xs
                                    font-medium
                                    text-slate-600
                                    mb-1
                                ">
                                        Factura
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            invoice.invoiceNumber
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

                                <div>
                                    <label className="
                                    block
                                    text-xs
                                    font-medium
                                    text-slate-600
                                    mb-1
                                ">
                                        Paciente
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            invoice.patientFullName
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

                                <div>
                                    <label className="
                                    block
                                    text-xs
                                    font-medium
                                    text-slate-600
                                    mb-1
                                ">
                                        Saldo pendiente de factura
                                    </label>

                                    <input
                                        type="text"
                                        value={formatCurrency(
                                            Number(
                                                invoice.pendingAmount ||
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
                                        bg-blue-50
                                        text-[#001D4A]
                                        font-semibold
                                        outline-none
                                    "
                                    />
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                        SELECCIONAR CUOTA
                    ================================================= */}

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

                        {/* =================================================
                        INFORMACIÓN DE LA CUOTA
                    ================================================= */}

                        {selectedInstallment && (
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
                                    <div>
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

                                    <div>
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

                                    <div>
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

                                    <div>
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

                                    <div>
                                        <label className="
                                        block
                                        text-xs
                                        font-medium
                                        text-slate-600
                                        mb-1
                                    ">
                                            Fecha de vencimiento
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
                        )}

                        {/* =================================================
                        DATOS DEL PAGO
                    ================================================= */}

                        {selectedInstallment && (
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
                                    <div>
                                        <label className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        mb-2
                                    ">
                                            Monto a pagar
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

                                    <div>
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

                                    {paymentMethod === "TRANSFER" && (
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

                                    {/* <div>
                                    <label className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        mb-2
                                    ">
                                        Atendido por
                                    </label>

                                    <input
                                        type="text"
                                        value={servedBy}
                                        onChange={(event) =>
                                            setServedBy(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Usuario que registra el pago"
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
                                </div> */}

                                    <div>
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
                                </div>
                            </div>
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
