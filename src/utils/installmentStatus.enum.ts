export type InstallmentStatus =
  | "PENDING"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED"

  export const InstallmentStatusSpanishOptions: {
        value: InstallmentStatus;
        label: string;
    }[] = [
        { value: "PENDING", label: "Pendiente" },
        { value: "PARTIALLY_PAID", label: "Parcialmente pagada" },
        { value: "PAID", label: "Pagada" },
        { value: "OVERDUE", label: "Atrasada / En mora" },
        { value: "CANCELLED", label: "Abortada" },
    ];