
import type { TreatmentPlanDetailDto } from "../models/TreatmentPlanDetailsModel";
import type TreatmentPlanDetail from "../models/TreatmentPlanDetailsModel";
import HTTPService from "./http-service";

export default class TreatmentPlanDetailService extends HTTPService {
  private path: string;

  constructor() {
    super();
    this.path = "treatmentPlanDetail";
  }

  /**
   * Obtiene la lista de detalles de planes de tratamiento
   */
  async getTreatmentPlanDetails(
    page: number = 1,
    pageSize: number = 100
  ): Promise<TreatmentPlanDetail[]> {
    const response = await super.get<TreatmentPlanDetail[]>(
      `${this.path}?page=${page}&pageSize=${pageSize}`
    );

    return response || [];
  }

  /**
   * Obtiene un detalle de plan de tratamiento por su ID
   */
  async getById(
    id: string
  ): Promise<TreatmentPlanDetail | null> {
    const response = await super.get<TreatmentPlanDetail | null>(
      `${this.path}/${id}`
    );

    return response || null;
  }

  /**
   * Crea un nuevo detalle de plan de tratamiento
   */
  async addTreatmentPlanDetail(
    data: TreatmentPlanDetailDto
  ): Promise<TreatmentPlanDetail | null> {
    const response = await super.post<
      TreatmentPlanDetail,
      TreatmentPlanDetailDto
    >(this.path, data);

    return response || null;
  }

  /**
   * Actualiza un detalle de plan de tratamiento
   */
  async updateTreatmentPlanDetail(
    id: string,
    data: TreatmentPlanDetailDto
  ): Promise<TreatmentPlanDetail | null> {
    const response = await super.put<
      TreatmentPlanDetail,
      TreatmentPlanDetailDto
    >(`${this.path}/${id}`, data);

    return response || null;
  }

  /**
   * Elimina un detalle de plan de tratamiento
   */
  async deleteTreatmentPlanDetail(
    id: string
  ): Promise<void> {
    await super.delete(`${this.path}/${id}`);
  }

  // ============================================================
  // QUANTITY
  // ============================================================

  /**
   * Cambia la cantidad de un detalle
   */
  async changeQuantity(
    id: string,
    quantity: number
  ): Promise<TreatmentPlanDetail | null> {
    const response = await super.put<
      TreatmentPlanDetail,
      { quantity: number }
    >(`${this.path}/${id}/quantity`, {
      quantity,
    });

    return response || null;
  }

  // ============================================================
  // TOOTH
  // ============================================================

  /**
   * Cambia el número de diente de un detalle
   */
  async changeTooth(
    id: string,
    toothNumber: number
  ): Promise<TreatmentPlanDetail | null> {
    const response = await super.put<
      TreatmentPlanDetail,
      { toothNumber: number }
    >(`${this.path}/${id}/tooth`, {
      toothNumber,
    });

    return response || null;
  }

  // ============================================================
  // STATUS
  // ============================================================

  /**
   * Inicia un detalle de tratamiento
   */
  async start(
    id: string
  ): Promise<TreatmentPlanDetail | null> {
    const response = await super.post<TreatmentPlanDetail>(
      `${this.path}/${id}/start`
    );

    return response || null;
  }

  /**
   * Completa un detalle de tratamiento
   */
  async complete(
    id: string
  ): Promise<TreatmentPlanDetail | null> {
    const response = await super.post<TreatmentPlanDetail>(
      `${this.path}/${id}/complete`
    );

    return response || null;
  }

  /**
   * Cancela un detalle de tratamiento
   */
  async cancel(
    id: string
  ): Promise<TreatmentPlanDetail | null> {
    const response = await super.post<TreatmentPlanDetail>(
      `${this.path}/${id}/cancel`
    );

    return response || null;
  }
}