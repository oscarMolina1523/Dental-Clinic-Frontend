import type { PaymentMethods } from "../utils/paymentMethodsStatus.enum";
import type Invoice from "./InvoiceModel";
import type { InvoiceDto } from "./InvoiceModel";
import type Payment from "./PaymentModel";

export interface CreateInvoiceWithPaymentDto {
  invoice: InvoiceDto;

  payment?: {
    amount: number;
    payment_method: PaymentMethods;
    transaction_reference?: string;
    served_by: string;
    payment_date: string;
    installment_id?: string; //hace referncia a cuotas
  };
}

export interface AddPaymentToInvoiceDto {
  invoiceId: string;
  
  amount: number;
  payment_method: PaymentMethods;
  transaction_reference?: string;
  served_by: string;
  payment_date: string;
  installment_id?: string;
}

export interface InvoicePaymentResponse {
  invoice: Invoice;
  payment: Payment | null;
}