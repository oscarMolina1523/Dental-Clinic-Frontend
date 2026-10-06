import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  AppointmentWithDetails,
  CreateAppointmentOrchestratorDto,
} from "../models/AppointmentOrchestratorModel";

import AppointmentOrchestratorService from "../api/appointmentOrchestrator.service";

const appointmentOrchestratorService =
  new AppointmentOrchestratorService();

/* =========================================================
   GET APPOINTMENTS
========================================================= */

export function useAppointmentOrchestrator() {
  return useQuery<
    AppointmentWithDetails[],
    Error
  >({
    queryKey: ["appointmentOrchestrator"],

    queryFn: () =>
      appointmentOrchestratorService.getAppointments(),
  });
}

/* =========================================================
   GET APPOINTMENT BY ID
========================================================= */

export function useAppointmentOrchestratorById(
  id: string
) {
  return useQuery<
    AppointmentWithDetails | null,
    Error
  >({
    queryKey: [
      "appointmentOrchestratorById",
      id,
    ],

    queryFn: () =>
      appointmentOrchestratorService.getAppointmentById(
        id
      ),

    enabled: !!id,
  });
}

/* =========================================================
   CREATE APPOINTMENT
========================================================= */

export function useAddAppointmentOrchestrator() {
  const queryClient = useQueryClient();

  return useMutation<
    AppointmentWithDetails | null,
    Error,
    CreateAppointmentOrchestratorDto
  >({
    mutationKey: [
      "addAppointmentOrchestrator",
    ],

    mutationFn: (data) =>
      appointmentOrchestratorService.addAppointment(
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "appointmentOrchestrator",
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "appointments",
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "appointmentOrchestratorById",
        ],
      });
    },
  });
}

/* =========================================================
   UPDATE APPOINTMENT
========================================================= */

export function useUpdateAppointmentOrchestrator() {
  const queryClient = useQueryClient();

  return useMutation<
    AppointmentWithDetails | null,
    Error,
    {
      id: string;
      data: CreateAppointmentOrchestratorDto;
    }
  >({
    mutationKey: [
      "updateAppointmentOrchestrator",
    ],

    mutationFn: ({ id, data }) =>
      appointmentOrchestratorService.updateAppointment(
        id,
        data
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "appointmentOrchestrator",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "appointments",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "appointmentOrchestratorById",
          variables.id,
        ],
      });
    },
  });
}

/* =========================================================
   DELETE APPOINTMENT
========================================================= */

export function useDeleteAppointmentOrchestrator() {
  const queryClient = useQueryClient();

  return useMutation<
    boolean,
    Error,
    string
  >({
    mutationKey: [
      "deleteAppointmentOrchestrator",
    ],

    mutationFn: (id) =>
      appointmentOrchestratorService.deleteAppointment(
        id
      ),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: [
          "appointmentOrchestrator",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "appointments",
        ],
      });

      queryClient.removeQueries({
        queryKey: [
          "appointmentOrchestratorById",
          id,
        ],
      });
    },
  });
}