import BaseModel from "./BaseModel";

export default class MedicalPrescription extends BaseModel {
  clinicalProgressId:string;
  patientId: string;
  patientFullName:string;
  dentistId: string;
  dentistFullName:string;
  date: Date;
  generalInstructions: string;

  constructor({
    id,
    clinicalProgressId, 
    patientId,
    patientFullName,
    dentistId,
    dentistFullName,
    date,
    generalInstructions,
  }: {
    id: string;
    clinicalProgressId:string;
    patientId: string;
    patientFullName: string;
    dentistId: string;
    dentistFullName: string;
    date: Date;
    generalInstructions: string;
  }) {
    super(id);
    this.clinicalProgressId = clinicalProgressId;
    this.patientId = patientId;
    this.patientFullName = patientFullName;
    this.dentistId = dentistId;
    this.dentistFullName = dentistFullName;
    this.date = date;
    this.generalInstructions = generalInstructions;
  }
}


export interface MedicalPrescriptionDto {
  clinicalProgressId:string;
  patientId: string;
  patientFullName: string;
  dentistId: string;
  dentistFullName: string;
  date: Date;
  generalInstructions: string;
}
