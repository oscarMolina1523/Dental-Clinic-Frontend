import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import TreatmentPlanOrchestratorService
  from "../api/treatmentPlanOrchestrator.service";

import type {
  CreateTreatmentPlanRequest,
  TreatmentPlanOrchestratorResponse,
} from "../models/TreatmentPlanOrchestratorModel";


const treatmentPlanOrchestratorService =
  new TreatmentPlanOrchestratorService();


/* =========================================================
   GET ALL TREATMENT PLANS
========================================================= */

export function useTreatmentPlansOrchestrator(
  page: number = 1,
  pageSize: number = 100
) {
  return useQuery<
    TreatmentPlanOrchestratorResponse[],
    Error
  >({
    queryKey: [
      "treatmentPlansOrchestrator",
      page,
      pageSize,
    ],

    queryFn: () =>
      treatmentPlanOrchestratorService
        .getAllTreatmentPlanOrchestrator(
          page,
          pageSize
        ),
  });
}


/* =========================================================
   CREATE TREATMENT PLAN
========================================================= */

export function useCreateTreatmentPlanOrchestrator() {
  const queryClient = useQueryClient();

  return useMutation<
    TreatmentPlanOrchestratorResponse | null,
    Error,
    CreateTreatmentPlanRequest
  >({
    mutationKey: [
      "createTreatmentPlanOrchestrator",
    ],

    mutationFn: (data) =>
      treatmentPlanOrchestratorService
        .createTreatmentPlanOrchestrator(data),

    onSuccess: () => {

      // Actualizar lista de planes de tratamiento
      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlansOrchestrator",
        ],
      });
    },
  });
}