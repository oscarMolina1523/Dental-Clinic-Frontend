import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type Patient from "../models/PatientModel";

import type {
  ChangePatientAddressVariables,
  ChangePatientEmailVariables,
  ChangePatientImageVariables,
  ChangePatientPhoneNumberVariables,
  CreatePatientDTO,
  UpdateEmergencyContactVariables,
  UpdatePatientVariables,
} from "../models/PatientModel";

import PatientService from "../api/patient.service";

const patientService = new PatientService();

/* =========================================================
   GET PATIENTS
========================================================= */

export function usePatients() {
  return useQuery<Patient[], Error>({
    queryKey: ["patients"],
    queryFn: () => patientService.getPatients(),
  });
}

/* =========================================================
   GET PATIENT BY ID
========================================================= */

export function usePatientById(id: string) {
  return useQuery<Patient | null, Error>({
    queryKey: ["patientById", id],
    queryFn: () => patientService.getById(id),
    enabled: !!id,
  });
}

/* =========================================================
   CREATE PATIENT
========================================================= */

export function useAddPatient() {
  const queryClient = useQueryClient();

  return useMutation<Patient | null, Error, CreatePatientDTO>({
    mutationKey: ["addPatient"],

    mutationFn: (patient) =>
      patientService.addPatient(patient),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patients"],
      });
    },
  });
}

/* =========================================================
   UPDATE PATIENT
========================================================= */

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation<
    Patient | null,
    Error,
    UpdatePatientVariables
  >({
    mutationKey: ["updatePatient"],

    mutationFn: ({ id, patient }) =>
      patientService.updatePatient(id, patient),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["patients"],
      });

      queryClient.invalidateQueries({
        queryKey: ["patientById", variables.id],
      });
    },
  });
}

/* =========================================================
   DELETE PATIENT
========================================================= */

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationKey: ["deletePatient"],

    mutationFn: (id) =>
      patientService.deletePatient(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patients"],
      });
    },
  });
}

/* =========================================================
   CHANGE PHONE NUMBER
========================================================= */

export function useChangePatientPhoneNumber() {
  const queryClient = useQueryClient();

  return useMutation<
    Patient | null,
    Error,
    ChangePatientPhoneNumberVariables
  >({
    mutationKey: ["changePatientPhoneNumber"],

    mutationFn: ({ id, phoneNumber }) =>
      patientService.changePhoneNumber(
        id,
        phoneNumber
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["patients"],
      });

      queryClient.invalidateQueries({
        queryKey: ["patientById", variables.id],
      });
    },
  });
}

/* =========================================================
   CHANGE EMAIL
========================================================= */

export function useChangePatientEmail() {
  const queryClient = useQueryClient();

  return useMutation<
    Patient | null,
    Error,
    ChangePatientEmailVariables
  >({
    mutationKey: ["changePatientEmail"],

    mutationFn: ({ id, email }) =>
      patientService.changeEmail(
        id,
        email
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["patients"],
      });

      queryClient.invalidateQueries({
        queryKey: ["patientById", variables.id],
      });
    },
  });
}

/* =========================================================
   CHANGE ADDRESS
========================================================= */

export function useChangePatientAddress() {
  const queryClient = useQueryClient();

  return useMutation<
    Patient | null,
    Error,
    ChangePatientAddressVariables
  >({
    mutationKey: ["changePatientAddress"],

    mutationFn: ({ id, address }) =>
      patientService.changeAddress(
        id,
        address
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["patients"],
      });

      queryClient.invalidateQueries({
        queryKey: ["patientById", variables.id],
      });
    },
  });
}

/* =========================================================
   UPDATE EMERGENCY CONTACT
========================================================= */

export function useUpdateEmergencyContact() {
  const queryClient = useQueryClient();

  return useMutation<
    Patient | null,
    Error,
    UpdateEmergencyContactVariables
  >({
    mutationKey: ["updateEmergencyContact"],

    mutationFn: ({
      id,
      name,
      phone,
    }) =>
      patientService.updateEmergencyContact(
        id,
        name,
        phone
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["patients"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "patientById",
          variables.id,
        ],
      });
    },
  });
}

/* =========================================================
   CHANGE IMAGE
========================================================= */

export function useChangePatientImage() {
  const queryClient = useQueryClient();

  return useMutation<
    Patient | null,
    Error,
    ChangePatientImageVariables
  >({
    mutationKey: ["changePatientImage"],

    mutationFn: ({ id, image }) =>
      patientService.changeImage(
        id,
        image
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["patients"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "patientById",
          variables.id,
        ],
      });
    },
  });
}

/* =========================================================
   ACTIVATE PATIENT
========================================================= */

export function useActivatePatient() {
  const queryClient = useQueryClient();

  return useMutation<
    Patient | null,
    Error,
    string
  >({
    mutationKey: ["activatePatient"],

    mutationFn: (id) =>
      patientService.activatePatient(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["patients"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "patientById",
          id,
        ],
      });
    },
  });
}

/* =========================================================
   DEACTIVATE PATIENT
========================================================= */

export function useDeactivatePatient() {
  const queryClient = useQueryClient();

  return useMutation<
    Patient | null,
    Error,
    string
  >({
    mutationKey: ["deactivatePatient"],

    mutationFn: (id) =>
      patientService.deactivatePatient(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["patients"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "patientById",
          id,
        ],
      });
    },
  });
}