import BaseModel from "./BaseModel";

export default class DentalChart extends BaseModel {
  clinicalProgressId: string;
  patientId: string;
  evaluationDate: Date;
  dentistId: string;
  observations: string;

  constructor({
    id,
    clinicalProgressId,
    patientId,
    evaluationDate,
    dentistId,
    observations,
  }: {
    id: string;
    clinicalProgressId: string;
    patientId: string;
    evaluationDate: Date;
    dentistId: string;
    observations: string;
  }) {
    super(id);
    this.patientId = patientId;
    this.clinicalProgressId = clinicalProgressId;
    this.evaluationDate = evaluationDate;
    this.dentistId = dentistId;
    this.observations = observations;
  }
}
