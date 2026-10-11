export type PaymentPlanStatus =
  | "PENDING"
  | "ACTIVE"
  | "IN_ARREARS"
  | "COMPLETED"
  | "CANCELLED";

  export const PaymentPlanStatusSpanishOptions: {
      value: PaymentPlanStatus;
      label: string;
  }[] = [
      { value: "PENDING", label: "Pendiente" },
      { value: "ACTIVE", label: "Activo" },
      { value: "IN_ARREARS", label: "En mora" },
      { value: "COMPLETED", label: "Completado" },
      { value: "CANCELLED", label: "Abortada" },
  ];