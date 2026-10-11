export type PaymentMethods =
  | "CASH"
  | "CARD"
  | "TRANSFER"

  export const PaymentMehodsSpanishOptions: {
        value: PaymentMethods;
        label: string;
    }[] = [
        { value: "CASH", label: "Efectivo" },
        { value: "CARD", label: "Tarjeta" },
        { value: "TRANSFER", label: "Transferencia" }
    ];