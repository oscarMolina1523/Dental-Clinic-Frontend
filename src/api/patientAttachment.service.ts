
import type { PatientAttachmentDto } from "../models/PatientAttachmentModel";
import type PatientAttachment from "../models/PatientAttachmentModel";
import HTTPService from "./http-service";

export default class PatientAttachmentService extends HTTPService {
  private path: string;

  constructor() {
    super();
    this.path = "patientAttachment";
  }

  /**
   * Obtiene la lista
   */
  async getPatientAttachments(
    page: number = 1,
    pageSize: number = 100
  ): Promise<PatientAttachment[]> {
    const response = await super.get<PatientAttachment[]>(
      `${this.path}?page=${page}&pageSize=${pageSize}`
    );

    return response || [];
  }

  /**
   * Obtiene por su ID
   */
  async getById(id: string): Promise<PatientAttachment | null> {
    const response = await super.get<PatientAttachment | null>(
      `${this.path}/${id}`
    );

    return response || null;
  }

  /**
   * Crea un nuevo registro
   */
  async addPatientAttachment(
    patientAttachment: PatientAttachmentDto
  ): Promise<PatientAttachment | null> {
    const response = await super.post<
      PatientAttachment,
      PatientAttachmentDto
    >(this.path, patientAttachment);

    return response || null;
  }

  /**
   * Actualiza una cita
   */
  async updateAppointment(
    id: string,
    patientAttachment: PatientAttachmentDto
  ): Promise<PatientAttachment | null> {
    const response = await super.put<
      PatientAttachment,
      PatientAttachmentDto
    >(`${this.path}/${id}`, patientAttachment);

    return response || null;
  }

  /**
   * Elimina una cita por su ID
   */
  async deletePatientAttachment(id: string): Promise<void> {
    await super.delete(`${this.path}/${id}`);
  }

}