import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import PatientAttachmentService from "../api/patientAttachment.service";
import type PatientAttachment from "../models/PatientAttachmentModel";
import type { PatientAttachmentDto } from "../models/PatientAttachmentModel";

const patientAttachmentService = new PatientAttachmentService();

/* =========================================================
   GET PATIENT ATTACHMENTS
========================================================= */

export function usePatientAttachments(
  page: number = 1,
  pageSize: number = 100
) {
  return useQuery<PatientAttachment[], Error>({
    queryKey: ["patientAttachments", page, pageSize],
    queryFn: () =>
      patientAttachmentService.getPatientAttachments(
        page,
        pageSize
      ),
  });
}

/* =========================================================
   GET PATIENT ATTACHMENT BY ID
========================================================= */

export function usePatientAttachmentById(id: string) {
  return useQuery<PatientAttachment | null, Error>({
    queryKey: ["patientAttachmentById", id],
    queryFn: () => patientAttachmentService.getById(id),
    enabled: !!id,
  });
}

/* =========================================================
   CREATE PATIENT ATTACHMENT
========================================================= */

export function useAddPatientAttachment() {
  const queryClient = useQueryClient();

  return useMutation<
    PatientAttachment | null,
    Error,
    PatientAttachmentDto
  >({
    mutationKey: ["addPatientAttachment"],

    mutationFn: (patientAttachment) =>
      patientAttachmentService.addPatientAttachment(
        patientAttachment
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patientAttachments"],
      });
    },
  });
}

/* =========================================================
   UPDATE PATIENT ATTACHMENT
========================================================= */

export interface UpdatePatientAttachmentVariables {
  id: string;
  patientAttachment: PatientAttachmentDto;
}

export function useUpdatePatientAttachment() {
  const queryClient = useQueryClient();

  return useMutation<
    PatientAttachment | null,
    Error,
    UpdatePatientAttachmentVariables
  >({
    mutationKey: ["updatePatientAttachment"],

    mutationFn: ({ id, patientAttachment }) =>
      patientAttachmentService.updatePatientAttachment(
        id,
        patientAttachment
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["patientAttachments"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "patientAttachmentById",
          variables.id,
        ],
      });
    },
  });
}

/* =========================================================
   DELETE PATIENT ATTACHMENT
========================================================= */

export function useDeletePatientAttachment() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationKey: ["deletePatientAttachment"],

    mutationFn: (id) =>
      patientAttachmentService.deletePatientAttachment(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patientAttachments"],
      });
    },
  });
}