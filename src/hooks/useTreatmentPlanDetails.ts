import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { TreatmentPlanDetailDto } from "../models/TreatmentPlanDetailsModel";
import type TreatmentPlanDetail from "../models/TreatmentPlanDetailsModel";

import TreatmentPlanDetailService from "../api/treatmentPlanDetail.service";

const treatmentPlanDetailService =
  new TreatmentPlanDetailService();

/* =========================================================
   GET TREATMENT PLAN DETAILS
========================================================= */

export function useTreatmentPlanDetails(
  page: number = 1,
  pageSize: number = 100
) {
  return useQuery<TreatmentPlanDetail[], Error>({
    queryKey: [
      "treatmentPlanDetails",
      page,
      pageSize,
    ],

    queryFn: () =>
      treatmentPlanDetailService.getTreatmentPlanDetails(
        page,
        pageSize
      ),
  });
}

/* =========================================================
   GET TREATMENT PLAN DETAIL BY ID
========================================================= */

export function useTreatmentPlanDetailById(
  id: string
) {
  return useQuery<TreatmentPlanDetail | null, Error>({
    queryKey: [
      "treatmentPlanDetailById",
      id,
    ],

    queryFn: () =>
      treatmentPlanDetailService.getById(id),

    enabled: !!id,
  });
}

/* =========================================================
   CREATE TREATMENT PLAN DETAIL
========================================================= */

export function useAddTreatmentPlanDetail() {
  const queryClient = useQueryClient();

  return useMutation<
    TreatmentPlanDetail | null,
    Error,
    TreatmentPlanDetailDto
  >({
    mutationKey: [
      "addTreatmentPlanDetail",
    ],

    mutationFn: (data) =>
      treatmentPlanDetailService.addTreatmentPlanDetail(
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlanDetails",
        ],
      });
    },
  });
}

/* =========================================================
   UPDATE TREATMENT PLAN DETAIL
========================================================= */

export interface UpdateTreatmentPlanDetailVariables {
  id: string;
  data: TreatmentPlanDetailDto;
}

export function useUpdateTreatmentPlanDetail() {
  const queryClient = useQueryClient();

  return useMutation<
    TreatmentPlanDetail | null,
    Error,
    UpdateTreatmentPlanDetailVariables
  >({
    mutationKey: [
      "updateTreatmentPlanDetail",
    ],

    mutationFn: ({ id, data }) =>
      treatmentPlanDetailService.updateTreatmentPlanDetail(
        id,
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlanDetails",
        ],
      });
    },
  });
}

/* =========================================================
   DELETE TREATMENT PLAN DETAIL
========================================================= */

export function useDeleteTreatmentPlanDetail() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    string
  >({
    mutationKey: [
      "deleteTreatmentPlanDetail",
    ],

    mutationFn: (id) =>
      treatmentPlanDetailService.deleteTreatmentPlanDetail(
        id
      ),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlanDetails",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlanDetailById",
          id,
        ],
      });
    },
  });
}

/* =========================================================
   CHANGE QUANTITY
========================================================= */

export interface ChangeQuantityVariables {
  id: string;
  quantity: number;
}

export function useChangeTreatmentPlanDetailQuantity() {
  const queryClient = useQueryClient();

  return useMutation<
    TreatmentPlanDetail | null,
    Error,
    ChangeQuantityVariables
  >({
    mutationKey: [
      "changeTreatmentPlanDetailQuantity",
    ],

    mutationFn: ({ id, quantity }) =>
      treatmentPlanDetailService.changeQuantity(
        id,
        quantity
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlanDetails",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlanDetailById",
          variables.id,
        ],
      });
    },
  });
}

/* =========================================================
   CHANGE TOOTH
========================================================= */

export interface ChangeToothVariables {
  id: string;
  toothNumber: number;
}

export function useChangeTreatmentPlanDetailTooth() {
  const queryClient = useQueryClient();

  return useMutation<
    TreatmentPlanDetail | null,
    Error,
    ChangeToothVariables
  >({
    mutationKey: [
      "changeTreatmentPlanDetailTooth",
    ],

    mutationFn: ({ id, toothNumber }) =>
      treatmentPlanDetailService.changeTooth(
        id,
        toothNumber
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlanDetails",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlanDetailById",
          variables.id,
        ],
      });
    },
  });
}

/* =========================================================
   START TREATMENT PLAN DETAIL
========================================================= */

export function useStartTreatmentPlanDetail() {
  const queryClient = useQueryClient();

  return useMutation<
    TreatmentPlanDetail | null,
    Error,
    string
  >({
    mutationKey: [
      "startTreatmentPlanDetail",
    ],

    mutationFn: (id) =>
      treatmentPlanDetailService.start(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlanDetails",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlanDetailById",
          id,
        ],
      });
    },
  });
}

/* =========================================================
   COMPLETE TREATMENT PLAN DETAIL
========================================================= */

export function useCompleteTreatmentPlanDetail() {
  const queryClient = useQueryClient();

  return useMutation<
    TreatmentPlanDetail | null,
    Error,
    string
  >({
    mutationKey: [
      "completeTreatmentPlanDetail",
    ],

    mutationFn: (id) =>
      treatmentPlanDetailService.complete(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlanDetails",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlanDetailById",
          id,
        ],
      });
    },
  });
}

/* =========================================================
   CANCEL TREATMENT PLAN DETAIL
========================================================= */

export function useCancelTreatmentPlanDetail() {
  const queryClient = useQueryClient();

  return useMutation<
    TreatmentPlanDetail | null,
    Error,
    string
  >({
    mutationKey: [
      "cancelTreatmentPlanDetail",
    ],

    mutationFn: (id) =>
      treatmentPlanDetailService.cancel(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlanDetails",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlanDetailById",
          id,
        ],
      });
    },
  });
}