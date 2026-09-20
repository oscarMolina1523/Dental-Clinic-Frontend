import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  CancelPaymentPlanResponse,
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

export function useCancelPaymentPlan(
  invoiceId?: string
) {

  const queryClient = useQueryClient();

  return useMutation<
    CancelPaymentPlanResponse | null,
    Error,
    void
  >({

    mutationKey: [
      "cancelPaymentPlan",
      invoiceId,
    ],

    mutationFn: () => {

      if (!invoiceId) {
        throw new Error(
          "El ID de la factura es requerido"
        );
      }

      return paymentPlanOrchestratorService
        .cancelPaymentPlan(invoiceId);
    },

    onSuccess: () => {

      if (invoiceId) {

        // Actualizar detalle del plan
        queryClient.invalidateQueries({
          queryKey: [
            "paymentPlanOrchestrator",
            invoiceId,
          ],
        });
      }

      // Actualizar listado de planes
      queryClient.invalidateQueries({
        queryKey: [
          "paymentPlansOrchestrator",
        ],
      });

      // Actualizar factura
      queryClient.invalidateQueries({
        queryKey: [
          "invoices",
        ],
      });

      // Actualizar pagos
      queryClient.invalidateQueries({
        queryKey: [
          "payments",
        ],
      });
    },
  });
}