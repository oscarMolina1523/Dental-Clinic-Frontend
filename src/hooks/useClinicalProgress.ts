import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import ClinicalProgressService from "../api/clinicalProgress.service";
import type ClinicalProgres from "../models/ClinicalProgressModel";
import type { ClinicalProgresDto } from "../models/ClinicalProgressModel";

const clinicalProgress = new ClinicalProgressService();

/* =========================================================
   GET All
========================================================= */

export function useClinicalProgress() {
  return useQuery<ClinicalProgres[], Error>({
    queryKey: ["clinicalProgresses"],
    queryFn: () => clinicalProgress.getClinicalProgress(),
  });
}

/* =========================================================
   GET ClinicalProgres BY ID
========================================================= */

export function useClinicalProgressById(id: string) {
  return useQuery<ClinicalProgres | null, Error>({
    queryKey: ["clinicalProgressById", id],
    queryFn: () => clinicalProgress.getById(id),
    enabled: !!id,
  });
}

/* =========================================================
   CREATE ClinicalProgres
========================================================= */

export function useAddClinicalProgress() {
  const queryClient = useQueryClient();

  return useMutation<ClinicalProgres | null, Error, ClinicalProgresDto>({
    mutationKey: ["addClinicalProgress"],

    mutationFn: (clinical) => clinicalProgress.addClinicalProgress(clinical),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clinicalProgresses"],
      });
    },
  });
}

/* =========================================================
   UPDATE ClinicalProgres
========================================================= */

export interface UpdateClinicalVariables {
  id: string;
  clinicalProgress: ClinicalProgresDto;
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation<ClinicalProgres | null, Error, UpdateClinicalVariables>({
    mutationKey: ["updateClinicalProgress"],

    mutationFn: ({ id, clinicalProgress: clinicalProgres }) => clinicalProgress.updateClinicalProgress(id, clinicalProgres),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinicalProgresses"] });
    },
  });
}

/* =========================================================
   DELETE ClinicalProgres
========================================================= */

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationKey: ["deleteClinicalProgress"],

    mutationFn: (id) => clinicalProgress.deleteClinicalProgress(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clinicalProgresses"],
      });
    },
  });
}