import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import MedicalPrescriptionOrchestratorService from "../api/medicalPrescriptionOrchestrator.service";

import type {
  CreateMedicalPrescriptionRequest,
  MedicalPrescriptionOrchestratorResponse,
  UpdateMedicalPrescriptionRequest,
} from "../models/MedicalPrescriptionOrchestratorModel";


const medicalPrescriptionOrchestratorService =
  new MedicalPrescriptionOrchestratorService();


/* =========================================================
   GET ALL MEDICAL PRESCRIPTIONS
========================================================= */

export function useMedicalPrescriptionsOrchestrator(
  page: number = 1,
  pageSize: number = 100
) {
  return useQuery<
    MedicalPrescriptionOrchestratorResponse[],
    Error
  >({
    queryKey: [
      "medicalPrescriptionsOrchestrator",
      page,
      pageSize,
    ],

    queryFn: () =>
      medicalPrescriptionOrchestratorService
        .getAllMedicalPrescriptionOrchestrator(
          page,
          pageSize
        ),
  });
}


/* =========================================================
   GET MEDICAL PRESCRIPTION BY ID
========================================================= */

export function useMedicalPrescriptionOrchestrator(
  id: string
) {
  return useQuery<
    MedicalPrescriptionOrchestratorResponse | null,
    Error
  >({
    queryKey: [
      "medicalPrescriptionByIdOrchestrator",
      id,
    ],

    queryFn: () =>
      medicalPrescriptionOrchestratorService
        .getByIdMedicalPrescriptionOrchestrator(id),

    enabled: !!id,
  });
}


/* =========================================================
   CREATE MEDICAL PRESCRIPTION
========================================================= */

export function useCreateMedicalPrescriptionOrchestrator() {
  const queryClient = useQueryClient();

  return useMutation<
    MedicalPrescriptionOrchestratorResponse | null,
    Error,
    CreateMedicalPrescriptionRequest
  >({
    mutationKey: [
      "createMedicalPrescriptionOrchestrator",
    ],

    mutationFn: (data) =>
      medicalPrescriptionOrchestratorService
        .createMedicalPrescriptionOrchestrator(data),

    onSuccess: () => {

      // Actualizar lista de recetas médicas
      queryClient.invalidateQueries({
        queryKey: [
          "medicalPrescriptionsOrchestrator",
        ],
      });
    },
  });
}


/* =========================================================
   UPDATE MEDICAL PRESCRIPTION
========================================================= */

export interface UpdateMedicalPrescriptionVariables {
  id: string;
  data: UpdateMedicalPrescriptionRequest;
}


export function useUpdateMedicalPrescriptionOrchestrator() {
  const queryClient = useQueryClient();

  return useMutation<
    MedicalPrescriptionOrchestratorResponse | null,
    Error,
    UpdateMedicalPrescriptionVariables
  >({
    mutationKey: [
      "updateMedicalPrescriptionOrchestrator",
    ],

    mutationFn: ({
      id,
      data,
    }) =>
      medicalPrescriptionOrchestratorService
        .updateMedicalPrescriptionOrchestrator(
          id,
          data
        ),

    onSuccess: (_, variables) => {

      // Actualizar lista de recetas médicas
      queryClient.invalidateQueries({
        queryKey: [
          "medicalPrescriptionsOrchestrator",
        ],
      });

      // Actualizar receta médica específica
      queryClient.invalidateQueries({
        queryKey: [
          "medicalPrescriptionByIdOrchestrator",
          variables.id,
        ],
      });
    },
  });
}


/* =========================================================
   DELETE MEDICAL PRESCRIPTION
========================================================= */

export function useDeleteMedicalPrescriptionOrchestrator() {
  const queryClient = useQueryClient();

  return useMutation<
    boolean,
    Error,
    string
  >({
    mutationKey: [
      "deleteMedicalPrescriptionOrchestrator",
    ],

    mutationFn: (id) =>
      medicalPrescriptionOrchestratorService
        .deleteMedicalPrescriptionOrchestrator(id),

    onSuccess: (_, id) => {

      // Actualizar lista de recetas médicas
      queryClient.invalidateQueries({
        queryKey: [
          "medicalPrescriptionsOrchestrator",
        ],
      });

      // Eliminar receta específica de caché
      queryClient.removeQueries({
        queryKey: [
          "medicalPrescriptionByIdOrchestrator",
          id,
        ],
      });
    },
  });
}