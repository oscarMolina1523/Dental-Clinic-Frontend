import BaseModel from "./BaseModel";

export default class ClinicalProgres extends BaseModel {
  patientId: string;
  dateId: string; //hace referencia a la cita 
  dentistId: string;
  diagnosis: string;
  treatmentId: string;
  observations: string;
  registrationDate: Date;

  constructor({
    id,
    patientId,
    dateId,
    dentistId,
    diagnosis,
    treatmentId,
    observations,
    registrationDate,
  }: {
    id: string;
    patientId: string;
    dateId: string;
    dentistId: string;
    diagnosis: string;
    treatmentId: string;
    observations: string;
    registrationDate: Date;
  }) {
    super(id);
    this.patientId = patientId;
    this.dateId = dateId;
    this.dentistId = dentistId;
    this.diagnosis = diagnosis;
    this.treatmentId = treatmentId;
    this.observations = observations;
    this.registrationDate = registrationDate;
  }
}

export interface ClinicalProgresDto {
  patientId: string;
  dateId: string;
  dentistId: string;
  diagnosis: string;
  treatmentId: string;
  observations: string;
  registrationDate: Date;
}
