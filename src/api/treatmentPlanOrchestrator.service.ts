import type {
  CreateTreatmentPlanRequest,
  TreatmentPlanOrchestratorResponse
} from "../models/TreatmentPlanOrchestratorModel";

import HTTPService from "./http-service";


export default class TreatmentPlanOrchestratorService
  extends HTTPService {

  private path: string;


  constructor() {

    super();

    this.path = "treatmentPlanOrchestrator";

  }


  // ============================================================
  // GET ALL COMPLETE TREATMENT PLANS
  // ============================================================

  async getAllTreatmentPlanOrchestrator(
    page: number = 1,
    pageSize: number = 100
  ): Promise<TreatmentPlanOrchestratorResponse[]> {

    const response =
      await super.get<TreatmentPlanOrchestratorResponse[]>(
        `${this.path}?page=${page}&pageSize=${pageSize}`
      );

    return response || [];
  }


  // ============================================================
  // CREATE COMPLETE TREATMENT PLAN
  // ============================================================

  async createTreatmentPlanOrchestrator(
    data: CreateTreatmentPlanRequest
  ): Promise<TreatmentPlanOrchestratorResponse | null> {

    const response =
      await super.post<
        TreatmentPlanOrchestratorResponse,
        CreateTreatmentPlanRequest
      >(
        `${this.path}`,
        data
      );

    return response || null;
  }

  async deleteTreatmentPlanOrchestrator(
    id: string
  ): Promise<boolean> {

    await super.delete(
      `${this.path}/${id}`
    );

    return true;
  }
}