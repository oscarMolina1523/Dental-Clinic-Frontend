import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import DentalChartOrchestratorService from "../api/dentalChartOrchestrator.service";

import type {
  CreateDentalChartRequest,
  DentalChartOrchestratorResponse,
  UpdateDentalChartRequest,
} from "../models/DentalChartOrchestratorModel";


const dentalChartOrchestratorService =
  new DentalChartOrchestratorService();


/* =========================================================
   GET DENTAL CHART BY ID
========================================================= */

export function useDentalChartOrchestrator(
  id: string
) {
  return useQuery<
    DentalChartOrchestratorResponse | null,
    Error
  >({
    queryKey: [
      "dentalChartByIdOrchestrator",
      id,
    ],

    queryFn: () =>
      dentalChartOrchestratorService
        .getByIdDentalChartOrchestrator(id),

    enabled: !!id,
  });
}


/* =========================================================
   CREATE DENTAL CHART
========================================================= */

export function useCreateDentalChartOrchestrator() {
  const queryClient = useQueryClient();

  return useMutation<
    DentalChartOrchestratorResponse | null,
    Error,
    CreateDentalChartRequest
  >({
    mutationKey: [
      "createDentalChartOrchestrator",
    ],

    mutationFn: (data) =>
      dentalChartOrchestratorService
        .createDentalChartOrchestrator(data),

    onSuccess: (data) => {

      // Actualizar ficha dental específica
      if (data?.dentalChart.id) {
        queryClient.invalidateQueries({
          queryKey: [
            "dentalChartByIdOrchestrator",
            data.dentalChart.id,
          ],
        });
      }
    },
  });
}


/* =========================================================
   UPDATE DENTAL CHART
========================================================= */

export interface UpdateDentalChartVariables {
  id: string;
  data: UpdateDentalChartRequest;
}


export function useUpdateDentalChartOrchestrator() {
  const queryClient = useQueryClient();

  return useMutation<
    DentalChartOrchestratorResponse | null,
    Error,
    UpdateDentalChartVariables
  >({
    mutationKey: [
      "updateDentalChartOrchestrator",
    ],

    mutationFn: ({
      id,
      data,
    }) =>
      dentalChartOrchestratorService
        .updateDentalChartOrchestrator(
          id,
          data
        ),

    onSuccess: (_, variables) => {

      // Actualizar ficha dental específica
      queryClient.invalidateQueries({
        queryKey: [
          "dentalChartByIdOrchestrator",
          variables.id,
        ],
      });
    },
  });
}


/* =========================================================
   DELETE DENTAL CHART
========================================================= */

export function useDeleteDentalChartOrchestrator() {
  const queryClient = useQueryClient();

  return useMutation<
    boolean,
    Error,
    string
  >({
    mutationKey: [
      "deleteDentalChartOrchestrator",
    ],

    mutationFn: (id) =>
      dentalChartOrchestratorService
        .deleteDentalChartOrchestrator(id),

    onSuccess: (_, id) => {

      // Eliminar ficha dental específica de caché
      queryClient.removeQueries({
        queryKey: [
          "dentalChartByIdOrchestrator",
          id,
        ],
      });
    },
  });
}