
import type { TreatmentPlanStatus } from "../utils/treatmentPlanStatus.enum";
import BaseModel from "./BaseModel";

export default class TreatmentPlan extends BaseModel {
  patientId: string;
  dentistId: string;
  code: string;
  status: TreatmentPlanStatus;
  totalAmount: number; // Subtotal de todos los TreatmentPlanDetail
  discount: number;    // Descuento aplicado al plan
  createdAt: Date;

  constructor({
    id,
    patientId,
    dentistId,
    code,
    status,
    totalAmount,
    discount,
    createdAt,
  }: {
    id: string;
    patientId: string;
    dentistId: string;
    code: string;
    status: TreatmentPlanStatus;
    totalAmount: number;
    discount: number;
    createdAt: Date;
  }) {
    super(id);

    this.patientId = patientId;
    this.dentistId = dentistId;
    this.code = code;
    this.status = status;
    this.totalAmount = totalAmount;
    this.discount = discount;
    this.createdAt = createdAt;
  }

}


export interface TreatmentPlanDto {
  patientId: string;
  dentistId: string;
  code: string;
  status: TreatmentPlanStatus;
  totalAmount: number;
  discount: number;
  createdAt: Date;
}
