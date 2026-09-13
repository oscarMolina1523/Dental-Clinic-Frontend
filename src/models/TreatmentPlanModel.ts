
import type { TreatmentPlanStatus } from "../utils/treatmentPlanStatus.enum";
import BaseModel from "./BaseModel";

export default class TreatmentPlan extends BaseModel {
  patientId: string;
  patientFullName:string;
  dentistId: string;
  dentistFullName:string;
  code: string;
  status: TreatmentPlanStatus;
  totalAmount: number; // Subtotal de todos los TreatmentPlanDetail
  discount: number;    // Descuento aplicado al plan
  createdAt: Date;

  constructor({
    id,
    patientId,
    patientFullName,
    dentistId,
    dentistFullName,
    code,
    status,
    totalAmount,
    discount,
    createdAt,
  }: {
    id: string;
    patientId: string;
    patientFullName: string;
    dentistId: string;
    dentistFullName: string;
    code: string;
    status: TreatmentPlanStatus;
    totalAmount: number;
    discount: number;
    createdAt: Date;
  }) {
    super(id);

    this.patientId = patientId;
    this.patientFullName = patientFullName;
    this.dentistId = dentistId;
    this.dentistFullName = dentistFullName;
    this.code = code;
    this.status = status;
    this.totalAmount = totalAmount;
    this.discount = discount;
    this.createdAt = createdAt;
  }

}

export interface TreatmentPlanDto {
  patientId: string;
  patientFullName: string;
  dentistId: string;
  dentistFullName: string;
  status: TreatmentPlanStatus;
  totalAmount: number;
  discount: number;
}
