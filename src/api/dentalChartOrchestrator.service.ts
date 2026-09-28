import type { CreateDentalChartRequest, DentalChartOrchestratorResponse, UpdateDentalChartRequest } from "../models/DentalChartOrchestratorModel";
import HTTPService from "./http-service";

export default class DentalChartOrchestratorService
  extends HTTPService {

  private path: string;

  constructor() {
    super();
    this.path = "dentalChartOrchestrator";
  }

  /**
   * Obtiene una ficha dental completa.
   *
   * Internamente el backend:
   * - obtiene la ficha dental
   * - obtiene todos los detalles asociados
   * - devuelve la ficha junto con sus detalles
   */
  async getByIdDentalChartOrchestrator(
    id: string
  ): Promise<DentalChartOrchestratorResponse | null> {

    const response =
      await super.get<DentalChartOrchestratorResponse>(
        `${this.path}/${id}`
      );

    return response || null;
  }

  /**
   * Crea una ficha dental completa.
   *
   * Internamente el backend:
   * - crea la ficha dental
   * - crea todos los detalles asociados
   */
  async createDentalChartOrchestrator(
    data: CreateDentalChartRequest
  ): Promise<DentalChartOrchestratorResponse | null> {

    const response =
      await super.post<
        DentalChartOrchestratorResponse,
        CreateDentalChartRequest
      >(
        `${this.path}`,
        data
      );

    return response || null;
  }

  /**
   * Actualiza una ficha dental completa.
   *
   * Internamente el backend:
   * - actualiza la ficha dental
   * - actualiza los detalles existentes
   * - crea los nuevos detalles
   */
  async updateDentalChartOrchestrator(
    id: string,
    data: UpdateDentalChartRequest
  ): Promise<DentalChartOrchestratorResponse | null> {

    const response =
      await super.put<
        DentalChartOrchestratorResponse,
        UpdateDentalChartRequest
      >(
        `${this.path}/${id}`,
        data
      );

    return response || null;
  }

  /**
   * Elimina una ficha dental completa.
   *
   * Internamente el backend:
   * - elimina todos los detalles asociados
   * - elimina la ficha dental
   */
  async deleteDentalChartOrchestrator(
    id: string
  ): Promise<boolean> {

    await super.delete(
      `${this.path}/${id}`
    );

    return true;
  }
}