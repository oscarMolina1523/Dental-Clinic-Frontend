import type { PaymentMethods } from "../utils/paymentMethodsStatus.enum";
import BaseModel from "./BaseModel";

export default class Payment extends BaseModel {
  invoice_id: string;
  amount: number;
  payment_method: PaymentMethods;
  transaction_reference?: string;//hace referencia al numero de transaccion ejemplo que da el banco, o el voucher de cuando se paga con tarjeta
  served_by: string;
  payment_date: string;
  installment_id?: string;

  constructor({
    id,
    invoice_id,
    amount,
    payment_method,
    transaction_reference,
    served_by,
    payment_date,
    installment_id,
  }: {
    id: string;
    invoice_id: string;
    amount: number;
    payment_method: PaymentMethods;
    transaction_reference?: string;
    served_by: string;
    payment_date: string;
    installment_id?: string;
  }) {
    super(id);

    this.invoice_id = invoice_id;
    this.amount = amount;
    this.payment_method = payment_method;
    this.transaction_reference = transaction_reference;
    this.served_by = served_by;
    this.payment_date = payment_date;
    this.installment_id = installment_id;
  }
}
