import type { CreatePaymentPlanRequest, CreatePaymentPlanResponse, RegisterPaymentRequest, RegisterPaymentResponse } from "../models/PaymentPlanOrchestrator";
import HTTPService from "./http-service";

export default class PaymentPlanOrchestratorService
  extends HTTPService {

  private path: string;

  constructor() {
    super();
    this.path = "paymentPlanOrchestrator";
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