import type { DentalChartDetailsStatus } from "../utils/dentalChartStatus.enum";
import BaseModel from "./BaseModel";

export default class DentalChartDetail extends BaseModel {
  dentalChartId: string;
  toothNumber: number;
  face: string;
  toothStatus: DentalChartDetailsStatus;
  notes: string;

  constructor({
    id,
    dentalChartId,
    toothNumber,
    face,
    toothStatus,
    notes,
  }: {
    id: string;
    dentalChartId: string;
    toothNumber: number;
    face: string;
    toothStatus: DentalChartDetailsStatus;
    notes: string;
  }) {
    super(id);

    this.dentalChartId = dentalChartId;
    this.toothNumber = toothNumber;
    this.face = face;
    this.toothStatus = toothStatus;
    this.notes = notes?.trim() ?? "";
  }
}
