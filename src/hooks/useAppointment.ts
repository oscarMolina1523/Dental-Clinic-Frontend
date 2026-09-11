import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from "../models/AppointmentModel";

import type Appointment from "../models/AppointmentModel";

import AppointmentService from "../api/appointment.service";

const appointmentService = new AppointmentService();

/* =========================================================
   GET APPOINTMENTS
========================================================= */

export function useAppointments(
  page: number = 1,
  pageSize: number = 100
) {
  return useQuery<Appointment[], Error>({
    queryKey: ["appointments", page, pageSize],
    queryFn: () =>
      appointmentService.getAppointments(page, pageSize),
  });
}

/* =========================================================
   GET APPOINTMENT BY ID
========================================================= */

export function useAppointmentById(id: string) {
  return useQuery<Appointment | null, Error>({
    queryKey: ["appointmentById", id],
    queryFn: () => appointmentService.getById(id),
    enabled: !!id,
  });
}

/* =========================================================
   CREATE APPOINTMENT
========================================================= */

export function useAddAppointment() {
  const queryClient = useQueryClient();

  return useMutation<
    Appointment | null,
    Error,
    CreateAppointmentDTO
  >({
    mutationKey: ["addAppointment"],

    mutationFn: (appointment) =>
      appointmentService.addAppointment(appointment),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });
    },
  });
}

/* =========================================================
   UPDATE APPOINTMENT
========================================================= */

export interface UpdateAppointmentVariables {
  id: string;
  appointment: UpdateAppointmentDTO;
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation<
    Appointment | null,
    Error,
    UpdateAppointmentVariables
  >({
    mutationKey: ["updateAppointment"],

    mutationFn: ({ id, appointment }) =>
      appointmentService.updateAppointment(
        id,
        appointment
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointmentById", variables.id],
      });
    },
  });
}

/* =========================================================
   DELETE APPOINTMENT
========================================================= */

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationKey: ["deleteAppointment"],

    mutationFn: (id) =>
      appointmentService.deleteAppointment(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointmentById", id],
      });
    },
  });
};

/* =========================================================
   CONFIRM APPOINTMENT
========================================================= */

export function useConfirmAppointment() {
  const queryClient = useQueryClient();

  return useMutation<Appointment | null, Error, string>({
    mutationKey: ["confirmAppointment"],

    mutationFn: (id) =>
      appointmentService.confirmAppointment(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointmentById", id],
      });
    },
  });
}

/* =========================================================
   START APPOINTMENT
========================================================= */

export function useStartAppointment() {
  const queryClient = useQueryClient();

  return useMutation<Appointment | null, Error, string>({
    mutationKey: ["startAppointment"],

    mutationFn: (id) =>
      appointmentService.startAppointment(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointmentById", id],
      });
    },
  });
}

/* =========================================================
   COMPLETE APPOINTMENT
========================================================= */

export function useCompleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation<Appointment | null, Error, string>({
    mutationKey: ["completeAppointment"],

    mutationFn: (id) =>
      appointmentService.completeAppointment(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointmentById", id],
      });
    },
  });
};

/* =========================================================
   CANCEL APPOINTMENT
========================================================= */

export interface CancelAppointmentVariables {
  id: string;
  notes: string;
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation<
    Appointment | null,
    Error,
    CancelAppointmentVariables
  >({
    mutationKey: ["cancelAppointment"],

    mutationFn: ({ id, notes }) =>
      appointmentService.cancelAppointment(id, notes),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointmentById", variables.id],
      });
    },
  });
}

/* =========================================================
   MARK AS NO SHOW
========================================================= */

export function useMarkAppointmentAsNoShow() {
  const queryClient = useQueryClient();

  return useMutation<Appointment | null, Error, string>({
    mutationKey: ["markAppointmentAsNoShow"],

    mutationFn: (id) =>
      appointmentService.markAsNoShow(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointmentById", id],
      });
    },
  });
};

/* =========================================================
   MARK REMINDER AS SENT
========================================================= */

export function useMarkReminderAsSent() {
  const queryClient = useQueryClient();

  return useMutation<Appointment | null, Error, string>({
    mutationKey: ["markReminderAsSent"],

    mutationFn: (id) =>
      appointmentService.markReminderAsSent(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointmentById", id],
      });
    },
  });
};

/* =========================================================
   GET DURATION
========================================================= */

export function useAppointmentDuration(id: string) {
  return useQuery<number | null, Error>({
    queryKey: ["appointmentDuration", id],

    queryFn: () =>
      appointmentService.getDurationInMinutes(id),

    enabled: !!id,
  });
}

/* =========================================================
   IS CANCELLED
========================================================= */

export function useAppointmentIsCancelled(id: string) {
  return useQuery<boolean | null, Error>({
    queryKey: ["appointmentIsCancelled", id],

    queryFn: () =>
      appointmentService.isCancelled(id),

    enabled: !!id,
  });
}

/* =========================================================
   IS COMPLETED
========================================================= */

export function useAppointmentIsCompleted(id: string) {
  return useQuery<boolean | null, Error>({
    queryKey: ["appointmentIsCompleted", id],

    queryFn: () =>
      appointmentService.isCompleted(id),

    enabled: !!id,
  });
}

/* =========================================================
   IS PENDING
========================================================= */

export function useAppointmentIsPending(id: string) {
  return useQuery<boolean | null, Error>({
    queryKey: ["appointmentIsPending", id],

    queryFn: () =>
      appointmentService.isPending(id),

    enabled: !!id,
  });
}