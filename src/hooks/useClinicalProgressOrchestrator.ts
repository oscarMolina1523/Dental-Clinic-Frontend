import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  ClinicalProgressOrchestratorResult,
  CreateClinicalProgressOrchestratorDto,
} from "../models/ClinicalProgressOrchestratorModel";

import ClinicalProgressOrchestratorService from "../api/clinicalProgressOrchestrator.service";

const clinicalProgressOrchestratorService =
  new ClinicalProgressOrchestratorService();

/* =========================================================
   GET CLINICAL PROGRESSES
========================================================= */

export function useClinicalProgressOrchestrator() {
  return useQuery<
    ClinicalProgressOrchestratorResult[],
    Error
  >({
    queryKey: ["clinicalProgressOrchestrator"],
    queryFn: () =>
      clinicalProgressOrchestratorService.getClinicalProgresses(),
  });
}

/* =========================================================
   GET CLINICAL PROGRESSES BY PATIENT
========================================================= */

export function useClinicalProgressOrchestratorByPatientId(
  patientId: string
) {
  return useQuery<
    ClinicalProgressOrchestratorResult[],
    Error
  >({
    queryKey: [
      "clinicalProgressOrchestrator",
      "patient",
      patientId,
    ],

    queryFn: () =>
      clinicalProgressOrchestratorService
        .getClinicalProgressesByPatientId(patientId),

    enabled: !!patientId,
  });
}

/* =========================================================
   CREATE CLINICAL PROGRESS
========================================================= */

export function useAddClinicalProgressOrchestrator() {
  const queryClient = useQueryClient();

  return useMutation<
    ClinicalProgressOrchestratorResult | null,
    Error,
    CreateClinicalProgressOrchestratorDto
  >({
    mutationKey: ["addClinicalProgressOrchestrator"],

    mutationFn: (data) =>
      clinicalProgressOrchestratorService.addClinicalProgress(
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clinicalProgressOrchestrator"],
      });
    },
  });
}