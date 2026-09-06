import type { AppointmentStatus } from "../utils/appointmentStatus.enum";
import BaseModel from "./BaseModel";

export default class Appointment extends BaseModel {
  patientId: string;
  patientFullName: string;
  dentistId: string;
  dentistFullName: string;
  startAppointmentTime: Date;
  endAppointmentTime: Date;
  reason: string;
  status: AppointmentStatus;
  cancelationNotes: string;
  reminderSent: boolean ;
  createdAt: Date;

  constructor({
    id,
    patientId,
    patientFullName,
    dentistId,
    dentistFullName,
    startAppointmentTime,
    endAppointmentTime,
    reason,
    status,
    cancelationNotes,
    reminderSent,
    createdAt,
  }: {
    id: string;
    patientId: string;
    patientFullName: string;
    dentistId: string;
    dentistFullName: string;
    startAppointmentTime: Date;
    endAppointmentTime: Date;
    reason: string;
    status: AppointmentStatus;
    cancelationNotes: string;
    reminderSent: boolean ;
    createdAt: Date;
  }) {
    super(id);

    this.patientId = patientId;
    this.patientFullName = patientFullName;
    this.dentistId = dentistId;
    this.dentistFullName = dentistFullName;
    this.startAppointmentTime = startAppointmentTime;
    this.endAppointmentTime = endAppointmentTime;
    this.reason = reason;
    this.status = status;
    this.cancelationNotes = cancelationNotes?.trim() ?? "";
    this.reminderSent = reminderSent;
    this.createdAt = createdAt;
  }
}


export interface CreateAppointmentDTO {
  patientId: string;
  patientFullName: string;
  dentistId: string;
  dentistFullName: string;
  startAppointmentTime: Date;
  endAppointmentTime: Date;
  reason: string;
  status: AppointmentStatus;
  cancelationNotes: string;
  reminderSent: boolean ;
}

export interface UpdateAppointmentDTO {
  patientId?: string;
  patientFullName?: string;
  dentistId: string;
  dentistFullName: string;
  startAppointmentTime: Date;
  endAppointmentTime: Date;
  reason: string;
}