import type { InvoiceStatus } from "../utils/invoiceStatus.enum";
import BaseModel from "./BaseModel";

export default class Invoice extends BaseModel {
  patientId: string;
  patientFullName:string;
  treatmentPlanId: string;
  invoiceNumber: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: InvoiceStatus;

  constructor({
    id,
    patientId,
    patientFullName,
    treatmentPlanId,
    invoiceNumber,
    totalAmount,
    paidAmount,
    pendingAmount,
    status,
  }: {
    id: string;
    patientId: string;
    patientFullName: string;
    treatmentPlanId: string;
    invoiceNumber: string;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    status: InvoiceStatus;
  }) {
    super(id);

    this.patientId = patientId;
    this.patientFullName = patientFullName;
    this.treatmentPlanId = treatmentPlanId;
    this.invoiceNumber = invoiceNumber;
    this.totalAmount = totalAmount;
    this.paidAmount = paidAmount;
    this.pendingAmount = pendingAmount;
    this.status = status;
  }
}

export interface InvoiceDto {
  patientId: string;
  patientFullName: string;
  treatmentPlanId: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: InvoiceStatus;
}
