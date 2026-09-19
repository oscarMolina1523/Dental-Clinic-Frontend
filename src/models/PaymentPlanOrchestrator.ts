import type { PaymentMethods } from "../utils/paymentMethodsStatus.enum";
import type Installment from "./InstallmentModel";
import type Invoice from "./InvoiceModel";
import type Payment from "./PaymentModel";
import type PaymentPlan from "./PaymentPlanModel";

export interface CreatePaymentPlanRequest {
  invoiceId: string;
  numberOfInstallments: number;
  frequencyDays: number;
  interestRate: number;
  lateFreePercentage: number;
  gracePeriodDays: number;
  firstDueDate?: string;
}

export interface CreatePaymentPlanResponse {
  paymentPlan: PaymentPlan;
  installments: Installment[];
}

export interface RegisterPaymentRequest {
  installmentId: string;
  amount: number;
  paymentMethod: PaymentMethods;
  transactionReference: string;
  servedBy: string;
  paymentDate: string;
}

export interface RegisterPaymentResponse {
  payment: Payment;
  installment: Installment;
}

export interface GetPaymentPlanByIdResponse {
  paymentPlan: PaymentPlan;
  invoice: Invoice;
  installments: Installment[];
  payments: Payment[];

}