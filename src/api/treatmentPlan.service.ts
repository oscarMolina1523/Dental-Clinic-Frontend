import type { TreatmentPlanDto } from "../models/TreatmentPlanModel";
import HTTPService from "./http-service";

export default class TreatmentPlanService extends HTTPService {
  private path: string;

  constructor() {
    super();
    this.path = "treatmentPlan";
  }

  /**
   * Obtiene la lista completa de planes de tratamiento.
   */
  async getTreatmentPlans(): Promise<TreatmentPlanDto[]> {
    const response = await super.get<TreatmentPlanDto[]>(this.path);

    return response || [];
  }

  /**
   * Obtiene un plan de tratamiento por su ID.
   */
  async getById(id: string): Promise<TreatmentPlanDto | null> {
    const response = await super.get<TreatmentPlanDto | null>(
      `${this.path}/${id}`
    );

    return response || null;
  }

  /**
   * Crea un nuevo plan de tratamiento.
   */
  async addTreatmentPlan(
    treatmentPlan: TreatmentPlanDto
  ): Promise<TreatmentPlanDto | null> {
    const response = await super.post<
      TreatmentPlanDto,
      TreatmentPlanDto
    >(
      this.path,
      treatmentPlan
    );

    return response || null;
  }

  /**
   * Actualiza un plan de tratamiento.
   */
  async updateTreatmentPlan(
    id: string,
    treatmentPlan: TreatmentPlanDto
  ): Promise<TreatmentPlanDto | null> {
    const response = await super.put<
      TreatmentPlanDto,
      TreatmentPlanDto
    >(
      `${this.path}/${id}`,
      treatmentPlan
    );

    return response || null;
  }

  /**
   * Elimina un plan de tratamiento.
   */
  async deleteTreatmentPlan(id: string): Promise<void> {
    await super.delete(`${this.path}/${id}`);
  }

  // ============================================================
  // ESTADOS
  // ============================================================

  /**
   * Propone un plan de tratamiento.
   */
  async propose(
    id: string
  ): Promise<TreatmentPlanDto | null> {
    const response = await super.post<
      TreatmentPlanDto
    >(
      `${this.path}/${id}/propose`
    );

    return response || null;
  }

  /**
   * Acepta un plan de tratamiento.
   */
  async accept(
    id: string
  ): Promise<TreatmentPlanDto | null> {
    const response = await super.post<
      TreatmentPlanDto
    >(
      `${this.path}/${id}/accept`
    );

    return response || null;
  }

  /**
   * Inicia un plan de tratamiento.
   */
  async start(
    id: string
  ): Promise<TreatmentPlanDto | null> {
    const response = await super.post<
      TreatmentPlanDto
    >(
      `${this.path}/${id}/start`
    );

    return response || null;
  }

  /**
   * Completa un plan de tratamiento.
   */
  async complete(
    id: string
  ): Promise<TreatmentPlanDto | null> {
    const response = await super.post<
      TreatmentPlanDto
    >(
      `${this.path}/${id}/complete`
    );

    return response || null;
  }

  /**
   * Cancela un plan de tratamiento.
   */
  async cancel(
    id: string
  ): Promise<TreatmentPlanDto | null> {
    const response = await super.post<
      TreatmentPlanDto
    >(
      `${this.path}/${id}/cancel`
    );

    return response || null;
  }

  // ============================================================
  // DINERO
  // ============================================================

  /**
   * Establece el subtotal del plan de tratamiento.
   */
  async setSubtotal(
    id: string,
    amount: number
  ): Promise<TreatmentPlanDto | null> {
    const response = await super.put<
      TreatmentPlanDto,
      { amount: number }
    >(
      `${this.path}/${id}/subtotal`,
      {
        amount
      }
    );

    return response || null;
  }

  /**
   * Aplica un descuento al plan de tratamiento.
   *
   * El descuento es un monto fijo, no un porcentaje.
   */
  async applyDiscount(
    id: string,
    discount: number
  ): Promise<TreatmentPlanDto | null> {
    const response = await super.put<
      TreatmentPlanDto,
      { discount: number }
    >(
      `${this.path}/${id}/discount`,
      {
        discount
      }
    );

    return response || null;
  }

  /**
   * Elimina el descuento del plan de tratamiento.
   */
  async removeDiscount(
    id: string
  ): Promise<void> {
    await super.delete(
      `${this.path}/${id}/discount`
    );
  }
}