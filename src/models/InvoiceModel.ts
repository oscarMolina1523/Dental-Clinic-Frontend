import type { InvoiceStatus } from "../utils/invoiceStatus.enum";
import BaseModel from "./BaseModel";

export default class Invoice extends BaseModel {
  patientId: string;
  patientFullName: string;

  dentistId: string;
  dentistFullName: string;

  treatmentPlanId?: string;
  treatmentId?: string;

  invoiceNumber: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: InvoiceStatus;

  hasInstallment: boolean;
  createdAt: Date;

  constructor({
    id,
    patientId,
    patientFullName,
    dentistId,
    dentistFullName,
    treatmentPlanId,
    treatmentId,
    invoiceNumber,
    totalAmount,
    paidAmount,
    pendingAmount,
    status,
    hasInstallment,
    createdAt
  }: {
    id: string;
    patientId: string;
    patientFullName: string;
    dentistId: string;
    dentistFullName: string;
    treatmentPlanId?: string;
    treatmentId?: string;
    invoiceNumber: string;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    status: InvoiceStatus;
    hasInstallment: boolean;
    createdAt: Date;
  }) {
    super(id);

    this.patientId = patientId;
    this.patientFullName = patientFullName;
    this.dentistId = dentistId;
    this.dentistFullName = dentistFullName;
    this.treatmentPlanId = treatmentPlanId;
    this.treatmentId = treatmentId;
    this.invoiceNumber = invoiceNumber;
    this.totalAmount = totalAmount;
    this.paidAmount = paidAmount;
    this.pendingAmount = pendingAmount;
    this.status = status;
    this.hasInstallment = hasInstallment;
    this.createdAt = createdAt;
  }
}

export interface InvoiceDto {
  patientId: string;
  patientFullName: string;
  dentistId: string;
  dentistFullName: string;
  treatmentPlanId?: string;
  treatmentId?: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: InvoiceStatus;
  hasInstallment: boolean;
  createdAt: Date;
}
