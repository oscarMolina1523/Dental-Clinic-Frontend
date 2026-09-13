import type { TreatmentPlanDetailStatus } from "../utils/treatmentPlanStatus.enum";
import BaseModel from "./BaseModel";

export default class TreatmentPlanDetail extends BaseModel {
  planId: string;
  treatmentId: string;
  treatmentName: string;
   toothNumber: number;
   quantity: number;
   unitPrice: number; //almacena el precio del momento que tenia el tratamiento, asi en el futuro cuando aumente el precio este tendra el de ese momento y no se cambiara
   subtotal: number;
  status: TreatmentPlanDetailStatus;

  constructor({
    id,
    planId,
    treatmentId,
    treatmentName,
    toothNumber,
    quantity,
    unitPrice,
    subtotal,
    status,
  }: {
    id: string;
    planId: string;
    treatmentId: string;
    treatmentName: string;
    toothNumber: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    status: TreatmentPlanDetailStatus;
  }) {
    super(id);

    this.planId = planId;
    this.treatmentId = treatmentId;
    this.treatmentName = treatmentName;
    this.toothNumber = toothNumber;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.subtotal = subtotal;
    this.status = status;
  }
}

export interface TreatmentPlanDetailDto {
  treatmentId: string;
  treatmentName: string;
  toothNumber: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  status: TreatmentPlanDetailStatus;
}