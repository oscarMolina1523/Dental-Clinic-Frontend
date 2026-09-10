import BaseModel from "./BaseModel";

export default class MedicalPrescription extends BaseModel {
  patientId: string;
  patientFullName:string;
  dentistId: string;
  dentistFullName:string;
  date: Date;
  generalInstructions: string;

  constructor({
    id,
    patientId,
    patientFullName,
    dentistId,
    dentistFullName,
    date,
    generalInstructions,
  }: {
    id: string;
    patientId: string;
    patientFullName: string;
    dentistId: string;
    dentistFullName: string;
    date: Date;
    generalInstructions: string;
  }) {
    super(id);
    this.patientId = patientId;
    this.patientFullName = patientFullName;
    this.dentistId = dentistId;
    this.dentistFullName = dentistFullName;
    this.date = date;
    this.generalInstructions = generalInstructions;
  }
}


export interface MedicalPrescriptionDto {
  patientId: string;
  patientFullName: string;
  dentistId: string;
  dentistFullName: string;
  date: Date;
  generalInstructions: string;
}
