import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  CreatePaymentPlanRequest,
  CreatePaymentPlanResponse,
  RegisterPaymentRequest,
  RegisterPaymentResponse,
} from "../models/PaymentPlanOrchestrator";
import PaymentPlanOrchestratorService from "../api/paymentPlanOrchestrator";


const paymentPlanOrchestratorService = new PaymentPlanOrchestratorService();


/* =========================================================
   CREATE PAYMENT PLAN
========================================================= */

export function useCreatePaymentPlanOrchestrator() {
  const queryClient = useQueryClient();

  return useMutation<
    CreatePaymentPlanResponse | null,
    Error,
    CreatePaymentPlanRequest
  >({
    mutationKey: [
      "createPaymentPlanOrchestrator",
    ],

    mutationFn: (data) =>
      paymentPlanOrchestratorService
        .createPaymentPlan(data),

    onSuccess: () => {

      // Actualizar información relacionada con los planes de pago
      queryClient.invalidateQueries({
        queryKey: [
          "paymentPlansOrchestrator",
        ],
      });
    },
  });
}


/* =========================================================
   REGISTER PAYMENT
========================================================= */

export function useRegisterPayment() {
  const queryClient = useQueryClient();

  return useMutation<
    RegisterPaymentResponse | null,
    Error,
    RegisterPaymentRequest
  >({
    mutationKey: [
      "registerPayment",
    ],

    mutationFn: (data) =>
      paymentPlanOrchestratorService
        .registerPayment(data),

    onSuccess: () => {

      // Actualizar información relacionada con pagos
      queryClient.invalidateQueries({
        queryKey: [
          "paymentPlansOrchestrator",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "payments",
        ],
      });
    },
  });
}