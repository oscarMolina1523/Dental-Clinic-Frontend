import type { CreateAppointmentDTO, UpdateAppointmentDTO } from "../models/AppointmentModel";
import type Appointment from "../models/AppointmentModel";
import HTTPService from "./http-service";

export default class AppointmentService extends HTTPService {
  private path: string;

  constructor() {
    super();
    this.path = "appointment";
  }

  /**
   * Obtiene la lista de citas
   */
  async getAppointments(
    page: number = 1,
    pageSize: number = 100
  ): Promise<Appointment[]> {
    const response = await super.get<Appointment[]>(
      `${this.path}?page=${page}&pageSize=${pageSize}`
    );

    return response || [];
  }

  /**
   * Obtiene una cita por su ID
   */
  async getById(id: string): Promise<Appointment | null> {
    const response = await super.get<Appointment | null>(
      `${this.path}/${id}`
    );

    return response || null;
  }

  /**
   * Crea una nueva cita
   */
  async addAppointment(
    appointment: CreateAppointmentDTO
  ): Promise<Appointment | null> {
    const response = await super.post<
      Appointment,
      CreateAppointmentDTO
    >(this.path, appointment);

    return response || null;
  }

  /**
   * Actualiza una cita
   */
  async updateAppointment(
    id: string,
    appointment: UpdateAppointmentDTO
  ): Promise<Appointment | null> {
    const response = await super.put<
      Appointment,
      UpdateAppointmentDTO
    >(`${this.path}/${id}`, appointment);

    return response || null;
  }

  /**
   * Elimina una cita por su ID
   */
  async deleteAppointment(id: string): Promise<void> {
    await super.delete(`${this.path}/${id}`);
  }

  // ============================================================
  // APPOINTMENT STATE
  // ============================================================

  /**
   * Confirma una cita
   */
  async confirmAppointment(
    id: string
  ): Promise<Appointment | null> {
    const response = await super.post<Appointment>(
      `${this.path}/${id}/confirm`
    );

    return response || null;
  }

  /**
   * Inicia una cita
   */
  async startAppointment(
    id: string
  ): Promise<Appointment | null> {
    const response = await super.post<Appointment>(
      `${this.path}/${id}/start`
    );

    return response || null;
  }

  /**
   * Completa una cita
   */
  async completeAppointment(
    id: string
  ): Promise<Appointment | null> {
    const response = await super.post<Appointment>(
      `${this.path}/${id}/complete`
    );

    return response || null;
  }

  /**
   * Cancela una cita
   */
  async cancelAppointment(
    id: string,
    notes: string
  ): Promise<Appointment | null> {
    const response = await super.post<
      Appointment,
      { notes: string }
    >(`${this.path}/${id}/cancel`, {
      notes,
    });

    return response || null;
  }

  /**
   * Marca una cita como no asistida
   */
  async markAsNoShow(
    id: string
  ): Promise<Appointment | null> {
    const response = await super.post<Appointment>(
      `${this.path}/${id}/no-show`
    );

    return response || null;
  }

  // ============================================================
  // REMINDER
  // ============================================================

  /**
   * Marca el recordatorio como enviado
   */
  async markReminderAsSent(
    id: string
  ): Promise<Appointment | null> {
    const response = await super.post<Appointment>(
      `${this.path}/${id}/reminder-sent`
    );

    return response || null;
  }

  // ============================================================
  // INFORMATION
  // ============================================================

  /**
   * Obtiene la duración de la cita en minutos
   */
  async getDurationInMinutes(
    id: string
  ): Promise<number | null> {
    const response = await super.get<number | null>(
      `${this.path}/${id}/duration`
    );

    return response ?? null;
  }

  /**
   * Verifica si la cita está cancelada
   */
  async isCancelled(
    id: string
  ): Promise<boolean | null> {
    const response = await super.get<boolean | null>(
      `${this.path}/${id}/cancelled`
    );

    return response ?? null;
  }

  /**
   * Verifica si la cita está completada
   */
  async isCompleted(
    id: string
  ): Promise<boolean | null> {
    const response = await super.get<boolean | null>(
      `${this.path}/${id}/completed`
    );

    return response ?? null;
  }

  /**
   * Verifica si la cita está pendiente
   */
  async isPending(
    id: string
  ): Promise<boolean | null> {
    const response = await super.get<boolean | null>(
      `${this.path}/${id}/pending`
    );

    return response ?? null;
  }
}