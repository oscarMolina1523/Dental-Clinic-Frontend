import type { AppointmentStatus } from "../utils/appointmentStatus.enum";
import BaseModel from "./BaseModel";

export default class Appointment extends BaseModel {
  patientId: string;
  patientFullName: string;
  dentistId: string;
  dentistFullName: string;
  dentistSpeciality: string;

  treatmentPlanId?: string;
  treatmentId?: string;

  allergies?: string;
  symptoms?: string;
  diagnosis?: string;
  clinicalNotes?: string;

  startAppointmentTime: Date;
  endAppointmentTime: Date;
  reason: string;
  status: AppointmentStatus;
  cancelationNotes: string;
  reminderSent: boolean;
  createdAt: Date;
  isInvoiced: boolean;

  constructor({
    id,
    patientId,
    patientFullName,
    dentistId,
    dentistFullName,

    dentistSpeciality,
    treatmentPlanId,

    treatmentId,
    allergies,
    symptoms,
    diagnosis,
    clinicalNotes,

    startAppointmentTime,
    endAppointmentTime,
    reason,
    status,
    cancelationNotes,
    reminderSent,
    createdAt,
    isInvoiced
  }: {
    id: string;
    patientId: string;
    patientFullName: string;
    dentistId: string;
    dentistFullName: string;
    dentistSpeciality: string;

    treatmentPlanId?: string;
    treatmentId?: string;

    allergies?: string;
    symptoms?: string;
    diagnosis?: string;
    clinicalNotes?: string;

    startAppointmentTime: Date;
    endAppointmentTime: Date;
    reason: string;
    status: AppointmentStatus;
    cancelationNotes: string;
    reminderSent: boolean;
    createdAt: Date;
    isInvoiced: boolean;
  }) {
    super(id);

    this.patientId = patientId;
    this.patientFullName = patientFullName;
    this.dentistId = dentistId;
    this.dentistFullName = dentistFullName;
    this.dentistSpeciality = dentistSpeciality;

    this.treatmentPlanId = treatmentPlanId;
    this.treatmentId = treatmentId;
    
    this.allergies = allergies;
    this.symptoms = symptoms;
    this.diagnosis = diagnosis;
    this.clinicalNotes = clinicalNotes;

    this.startAppointmentTime = startAppointmentTime;
    this.endAppointmentTime = endAppointmentTime;
    this.reason = reason;
    this.status = status;
    this.cancelationNotes = cancelationNotes?.trim() ?? "";
    this.reminderSent = reminderSent;
    this.createdAt = createdAt;
    this.isInvoiced = isInvoiced;
  }
}


export interface CreateAppointmentDTO {
  patientId: string;
  patientFullName: string;
  dentistId: string;
  dentistFullName: string;
  dentistSpeciality: string;
  
  startAppointmentTime: Date;
  endAppointmentTime: Date;
  reason: string;
  status: AppointmentStatus;
  cancelationNotes: string;
  reminderSent: boolean;

  treatmentPlanId?: string;
  treatmentId?: string;

  allergies?: string;
  symptoms?: string;
  diagnosis?: string;
  clinicalNotes?: string;
  isInvoiced: boolean;
}

export interface UpdateAppointmentDTO {
  patientId: string;
  patientFullName: string;
  dentistId: string;
  dentistFullName: string;
  dentistSpeciality: string;

  treatmentPlanId?: string;
  treatmentId?: string;

  allergies?: string;
  symptoms?: string;
  diagnosis?: string;
  clinicalNotes?: string;
  
  startAppointmentTime: Date;
  endAppointmentTime: Date;
  reason: string;
  isInvoiced: boolean;
}