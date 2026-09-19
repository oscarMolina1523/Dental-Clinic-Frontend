import type { CreatePaymentPlanRequest, CreatePaymentPlanResponse, GetPaymentPlanByIdResponse, RegisterPaymentRequest, RegisterPaymentResponse } from "../models/PaymentPlanOrchestrator";
import HTTPService from "./http-service";

export default class PaymentPlanOrchestratorService
  extends HTTPService {

  private path: string;

  constructor() {
    super();
    this.path = "paymentPlanOrchestrator";
  }

  async getPaymentPlanById(
    id: string
  ): Promise<GetPaymentPlanByIdResponse | null> {

    const response =
      await super.get<GetPaymentPlanByIdResponse>(
        `${this.path}/${id}`
      );

    return response || null;
  }

  // ============================================================
  // CREATE PAYMENT PLAN
  // ============================================================

  async createPaymentPlan(
    data: CreatePaymentPlanRequest
  ): Promise<CreatePaymentPlanResponse | null> {

    const response =
      await super.post<
        CreatePaymentPlanResponse,
        CreatePaymentPlanRequest
      >(
        `${this.path}`,
        data
      );

    return response || null;
  }


  // ============================================================
  // REGISTER PAYMENT
  // ============================================================

  async registerPayment(
    data: RegisterPaymentRequest
  ): Promise<RegisterPaymentResponse | null> {

    const response =
      await super.post<
        RegisterPaymentResponse,
        RegisterPaymentRequest
      >(
        `${this.path}/register-payment`,
        data
      );

    return response || null;
  }
}