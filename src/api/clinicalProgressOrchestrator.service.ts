

import type { ClinicalProgressOrchestratorResult, CreateClinicalProgressOrchestratorDto } from "../models/ClinicalProgressOrchestratorModel";
import HTTPService from "./http-service";

export default class ClinicalProgressOrchestratorService extends HTTPService {
  private path: string;

  constructor() {
    super();
    this.path = "clinicalProgressOrchestrator";
  }

  /**
   * Obtiene todos los progresos clínicos
   * junto con sus datos relacionados.
   */
  async getClinicalProgresses(): Promise<
    ClinicalProgressOrchestratorResult[]
  > {
    const response =
      await super.get<ClinicalProgressOrchestratorResult[]>(
        this.path
      );

    return response || [];
  }

  /**
   * Obtiene todos los progresos clínicos
   * de un paciente junto con sus datos relacionados.
   */
  async getClinicalProgressesByPatientId(
    patientId: string
  ): Promise<ClinicalProgressOrchestratorResult[]> {
    const response =
      await super.get<ClinicalProgressOrchestratorResult[]>(
        `${this.path}/patient/${patientId}`
      );

    return response || [];
  }

  /**
   * Crea un progreso clínico junto con
   * sus datos relacionados opcionales.
   */
  async addClinicalProgress(
    data: CreateClinicalProgressOrchestratorDto
  ): Promise<ClinicalProgressOrchestratorResult | null> {

    const response =
      await super.post<
        ClinicalProgressOrchestratorResult,
        CreateClinicalProgressOrchestratorDto
      >(
        this.path,
        data
      );

    return response || null;
  }
}