

import type { CreateMedicalPrescriptionRequest, MedicalPrescriptionOrchestratorResponse, UpdateMedicalPrescriptionRequest } from "../models/MedicalPrescriptionOrchestratorModel";
import HTTPService from "./http-service";

export default class MedicalPrescriptionOrchestratorService
  extends HTTPService {

  private path: string;

  constructor() {
    super();
    this.path = "medicalPrescriptionOrchestrator";
  }

  /**
   * Obtiene todas las recetas médicas.
   *
   * Internamente el backend:
   * - obtiene las recetas médicas
   * - obtiene los detalles asociados a cada receta
   * - devuelve cada receta junto con sus detalles
   */
  async getAllMedicalPrescriptionOrchestrator(
    page: number = 1,
    pageSize: number = 100
  ): Promise<MedicalPrescriptionOrchestratorResponse[]> {

    const response =
      await super.get<MedicalPrescriptionOrchestratorResponse[]>(
        `${this.path}?page=${page}&pageSize=${pageSize}`
      );

    return response || [];
  }

  /**
   * Obtiene una receta médica completa.
   *
   * Internamente el backend:
   * - obtiene la receta médica
   * - obtiene todos sus detalles
   */
  async getByIdMedicalPrescriptionOrchestrator(
    id: string
  ): Promise<MedicalPrescriptionOrchestratorResponse | null> {

    const response =
      await super.get<MedicalPrescriptionOrchestratorResponse>(
        `${this.path}/${id}`
      );

    return response || null;
  }

  /**
   * Crea una receta médica completa.
   *
   * Internamente el backend:
   * - crea la receta médica
   * - crea todos sus detalles
   */
  async createMedicalPrescriptionOrchestrator(
    data: CreateMedicalPrescriptionRequest
  ): Promise<MedicalPrescriptionOrchestratorResponse | null> {

    const response =
      await super.post<
        MedicalPrescriptionOrchestratorResponse,
        CreateMedicalPrescriptionRequest
      >(
        `${this.path}`,
        data
      );

    return response || null;
  }

  /**
   * Actualiza una receta médica completa.
   *
   * Internamente el backend:
   * - actualiza la receta médica
   * - actualiza los detalles existentes
   * - crea los nuevos detalles
   */
  async updateMedicalPrescriptionOrchestrator(
    id: string,
    data: UpdateMedicalPrescriptionRequest
  ): Promise<MedicalPrescriptionOrchestratorResponse | null> {

    const response =
      await super.put<
        MedicalPrescriptionOrchestratorResponse,
        UpdateMedicalPrescriptionRequest
      >(
        `${this.path}/${id}`,
        data
      );

    return response || null;
  }

  /**
   * Elimina una receta médica completa.
   *
   * Internamente el backend:
   * - elimina todos los detalles asociados
   * - elimina la receta médica
   */
  async deleteMedicalPrescriptionOrchestrator(
    id: string
  ): Promise<boolean> {

    await super.delete(
      `${this.path}/${id}`
    );

    return true;
  }
}