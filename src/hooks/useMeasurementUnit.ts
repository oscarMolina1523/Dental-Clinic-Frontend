import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import MeasurementUnitService from "../api/measurementUnit.service";
import type MeasurementUnit from "../models/MeasurementUnitModel";
import type { MeasurementUnitDTO } from "../models/MeasurementUnitModel";

const measurementUnitService = new MeasurementUnitService();

/* =========================================================
   GET MEASUREMENT UNIT
========================================================= */

export function useMeasurementUnites() {
  return useQuery<MeasurementUnit[], Error>({
    queryKey: ["measurementUnites"],
    queryFn: () => measurementUnitService.getMeasurementUnites(),
  });
}

/* =========================================================
   GET MeasurementUnit BY ID
========================================================= */

export function useMeasurementUnitById(id: string) {
  return useQuery<MeasurementUnit | null, Error>({
    queryKey: ["measurementUnitById", id],
    queryFn: () => measurementUnitService.getById(id),
    enabled: !!id,
  });
}

/* =========================================================
   CREATE MeasurementUnit
========================================================= */

export function useAddMeasurementUnit() {
  const queryClient = useQueryClient();

  return useMutation<MeasurementUnit | null, Error, MeasurementUnitDTO>({
    mutationKey: ["addMeasurementUnit"],

    mutationFn: (measurementUnit) => measurementUnitService.addMeasurementUnit(measurementUnit),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["measurementUnites"],
      });
    },
  });
}

/* =========================================================
   UPDATE MeasurementUnit
========================================================= */

export interface UpdateMeasurementUnitVariables {
  id: string;
  measurementUnit: MeasurementUnitDTO;
}

export function useUpdateMeasurementUnit() {
  const queryClient = useQueryClient();

  return useMutation<MeasurementUnit | null, Error, UpdateMeasurementUnitVariables>({
    mutationKey: ["updateMeasurementUnit"],

    mutationFn: ({ id, measurementUnit }) => measurementUnitService.updateMeasurementUnit(id, measurementUnit),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["measurementUnites"] });
      queryClient.invalidateQueries({ queryKey: ["measurementUnitById", variables.id] });
    },
  });
}

/* =========================================================
   DELETE MeasurementUnit
========================================================= */

export function useDeleteMeasurementUnit() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationKey: ["deleteMeasurementUnit"],

    mutationFn: (id) => measurementUnitService.deleteMeasurementUnit(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["measurementUnites"],
      });
    },
  });
}