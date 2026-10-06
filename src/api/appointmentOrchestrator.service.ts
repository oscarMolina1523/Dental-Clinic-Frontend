import type {
  AppointmentWithDetails,
  CreateAppointmentOrchestratorDto
} from "../models/AppointmentOrchestratorModel";

import HTTPService from "./http-service";

export default class AppointmentOrchestratorService extends HTTPService {
  private path: string;

  constructor() {
    super();
    this.path = "appointmentOrchestrator";
  }

  /**
   * Obtiene todas las citas
   * junto con sus datos relacionados.
   */
  async getAppointments(): Promise<AppointmentWithDetails[]> {
    const response =
      await super.get<AppointmentWithDetails[]>(
        this.path
      );

    return response || [];
  }

  /**
   * Obtiene una cita por ID
   * junto con sus datos relacionados.
   */
  async getAppointmentById(
    id: string
  ): Promise<AppointmentWithDetails | null> {
    const response =
      await super.get<AppointmentWithDetails>(
        `${this.path}/${id}`
      );

    return response || null;
  }

  /**
   * Crea una cita junto con
   * su tratamiento o plan de tratamiento.
   */
  async addAppointment(
    data: CreateAppointmentOrchestratorDto
  ): Promise<AppointmentWithDetails | null> {
    const response =
      await super.post<
        AppointmentWithDetails,
        CreateAppointmentOrchestratorDto
      >(
        this.path,
        data
      );

    return response || null;
  }

  /**
   * Actualiza una cita junto con
   * su tratamiento o plan de tratamiento.
   */
  async updateAppointment(
    id: string,
    data: CreateAppointmentOrchestratorDto
  ): Promise<AppointmentWithDetails | null> {
    const response =
      await super.put<
        AppointmentWithDetails,
        CreateAppointmentOrchestratorDto
      >(
        `${this.path}/${id}`,
        data
      );

    return response || null;
  }

  /**
   * Elimina una cita y sus datos relacionados.
   */
  async deleteAppointment(
    id: string
  ): Promise<boolean> {
    const response =
      await super.delete<boolean>(
        `${this.path}/${id}`
      );

    return response ?? false;
  }
}