import type { PaymentPlanStatus } from "../utils/paymentPlanStatus.enum";
import BaseModel from "./BaseModel";


export default class PaymentPlan extends BaseModel {
  invoiceId: string;
  totalAmount: number; //total que se pacto a pagar con el porcentaje de interes aplicado
  numberOfInstallments: number;
  frequencyDays: number; //cada cuantos dias vence una cuota
  interestRate: number; //solo guarda el interes pactado
  lateFreePercentage: number; //hace referncia a la tolerancia de un pago minimo, es decir si la cuota vale 100 y nos dan 50 segun el negocio puede tolerarlo y asi
  gracePeriodDays: number;
  status: PaymentPlanStatus;

  constructor({
    id,
    invoiceId,
    totalAmount,
    numberOfInstallments,
    frequencyDays,
    interestRate,
    lateFreePercentage,
    gracePeriodDays,
    status,
  }: {
    id: string;
    invoiceId: string;
    totalAmount: number;
    numberOfInstallments: number;
    frequencyDays: number;
    interestRate: number;
    lateFreePercentage: number;
    gracePeriodDays: number;
    status: PaymentPlanStatus;
  }) {
    super(id);

    this.invoiceId = invoiceId;
    this.totalAmount = totalAmount;
    this.numberOfInstallments = numberOfInstallments;
    this.frequencyDays = frequencyDays;
    this.interestRate = interestRate;
    this.lateFreePercentage = lateFreePercentage;
    this.gracePeriodDays = gracePeriodDays;
    this.status = status;
  }

}
