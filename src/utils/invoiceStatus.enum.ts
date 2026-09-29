export type InvoiceStatus =
  | "PENDING"
  | "PARTIALLY_PAID"
  | "PAID"
  | "CANCELLED"


export const invoiceStatusSpanishOptions: {
    value: InvoiceStatus;
    label: string;
}[] = [
    { value: "PENDING", label: "Pendiente" },
    { value: "PARTIALLY_PAID", label: "Pago parcial" },
    { value: "PAID", label: "Pagada" },
    { value: "CANCELLED", label: "Cancelada" },
];

export const invoiceStatusColors: Record<
    InvoiceStatus,
    { bg: string; text: string; border: string }
> = {
    PENDING: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
    },
    PARTIALLY_PAID: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
    },
    PAID: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
    },
    CANCELLED: {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
    },
};