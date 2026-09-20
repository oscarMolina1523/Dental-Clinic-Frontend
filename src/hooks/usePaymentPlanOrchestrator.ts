import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  CreatePaymentPlanRequest,
  CreatePaymentPlanResponse,
  GetPaymentPlanByIdResponse,
  RegisterPaymentRequest,
  RegisterPaymentResponse,
} from "../models/PaymentPlanOrchestrator";
import PaymentPlanOrchestratorService from "../api/paymentPlanOrchestrator";


const paymentPlanOrchestratorService = new PaymentPlanOrchestratorService();

export function usePaymentPlanById(
  id?: string
) {

  return useQuery<
    GetPaymentPlanByIdResponse | null,
    Error
  >({

    queryKey: [
      "paymentPlanOrchestrator",
      id,
    ],

    queryFn: () => {

      if (!id) {
        throw new Error(
          "El ID del plan de la fatcura es requerida"
        );
      }

      return paymentPlanOrchestratorService
        .getPaymentPlanById(id);
    },

    enabled: Boolean(id),

  });
}

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
      queryClient.invalidateQueries({
        queryKey: [
          "invoices",
        ],
      });
    },
  });
}


/* =========================================================
   REGISTER PAYMENT
========================================================= */

export function useRegisterPayment(invoiceId?: string) {
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

      if (invoiceId) {
        queryClient.invalidateQueries({
          queryKey: [
            "paymentPlanOrchestrator",
            invoiceId,
          ],
        });
      }

      // Actualizar información relacionada con pagos
      queryClient.invalidateQueries({
        queryKey: [
          "paymentPlansOrchestrator",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "invoices",
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