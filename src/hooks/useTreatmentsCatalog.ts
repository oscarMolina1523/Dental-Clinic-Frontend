import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type TreatmentCatalogModel from "../models/TreatmentCatalogModel";

import type {
  CreateTreatmentCatalogDTO,
  UpdateTreatmentCatalogDTO,
} from "../models/TreatmentCatalogModel";

import TreatmentCatalogService from "../api/treatmentCatalog.service";

const treatmentCatalogService = new TreatmentCatalogService();

/* =========================================================
   GET TREATMENTS
========================================================= */

export function useTreatments() {
  return useQuery<TreatmentCatalogModel[], Error>({
    queryKey: ["treatments"],
    queryFn: () => treatmentCatalogService.getTreatments(),
  });
}

/* =========================================================
   GET TREATMENT BY ID
========================================================= */

export function useTreatmentById(id: string) {
  return useQuery<TreatmentCatalogModel | null, Error>({
    queryKey: ["treatmentById", id],
    queryFn: () => treatmentCatalogService.getById(id),
    enabled: !!id,
  });
}

/* =========================================================
   CREATE TREATMENT
========================================================= */

export function useAddTreatment() {
  const queryClient = useQueryClient();

  return useMutation<
    TreatmentCatalogModel | null,
    Error,
    CreateTreatmentCatalogDTO
  >({
    mutationKey: ["addTreatment"],

    mutationFn: (treatment) =>
      treatmentCatalogService.addTreatment(treatment),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["treatments"],
      });
    },
  });
}

/* =========================================================
   UPDATE TREATMENT
========================================================= */

export interface UpdateTreatmentVariables {
  id: string;
  treatment: UpdateTreatmentCatalogDTO;
}

export function useUpdateTreatment() {
  const queryClient = useQueryClient();

  return useMutation<
    TreatmentCatalogModel | null,
    Error,
    UpdateTreatmentVariables
  >({
    mutationKey: ["updateTreatment"],

    mutationFn: ({ id, treatment }) =>
      treatmentCatalogService.updateTreatment(id, treatment),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["treatments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["treatmentById", variables.id],
      });
    },
  });
}

/* =========================================================
   DELETE TREATMENT
========================================================= */

export function useDeleteTreatment() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationKey: ["deleteTreatment"],

    mutationFn: (id) =>
      treatmentCatalogService.deleteTreatment(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["treatments"],
      });
    },
  });
}

/* =========================================================
   CHANGE PRICE
========================================================= */

export interface ChangeTreatmentPriceVariables {
  id: string;
  price: number;
}

export function useChangeTreatmentPrice() {
  const queryClient = useQueryClient();

  return useMutation<
    TreatmentCatalogModel | null,
    Error,
    ChangeTreatmentPriceVariables
  >({
    mutationKey: ["changeTreatmentPrice"],

    mutationFn: ({ id, price }) =>
      treatmentCatalogService.changePrice(id, price),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["treatments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["treatmentById", variables.id],
      });
    },
  });
}

/* =========================================================
   CHANGE DURATION
========================================================= */

export interface ChangeTreatmentDurationVariables {
  id: string;
  minutes: number;
}

export function useChangeTreatmentDuration() {
  const queryClient = useQueryClient();

  return useMutation<
    TreatmentCatalogModel | null,
    Error,
    ChangeTreatmentDurationVariables
  >({
    mutationKey: ["changeTreatmentDuration"],

    mutationFn: ({ id, minutes }) =>
      treatmentCatalogService.changeDuration(id, minutes),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["treatments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["treatmentById", variables.id],
      });
    },
  });
}

/* =========================================================
   ACTIVATE TREATMENT
========================================================= */

export function useActivateTreatment() {
  const queryClient = useQueryClient();

  return useMutation<TreatmentCatalogModel | null, Error, string>({
    mutationKey: ["activateTreatment"],

    mutationFn: (id) =>
      treatmentCatalogService.activateTreatment(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["treatments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["treatmentById", id],
      });
    },
  });
}

/* =========================================================
   DEACTIVATE TREATMENT
========================================================= */

export function useDeactivateTreatment() {
  const queryClient = useQueryClient();

  return useMutation<TreatmentCatalogModel | null, Error, string>({
    mutationKey: ["deactivateTreatment"],

    mutationFn: (id) =>
      treatmentCatalogService.deactivateTreatment(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["treatments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["treatmentById", id],
      });
    },
  });
}