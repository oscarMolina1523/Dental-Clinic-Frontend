import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { TreatmentPlanDto } from "../models/TreatmentPlanModel";
import TreatmentPlanService from "../api/treatmentPlan.service";
import type TreatmentPlan from "../models/TreatmentPlanModel";

const treatmentPlanService = new TreatmentPlanService();

/* =========================================================
   GET TREATMENT PLANS
========================================================= */

export function useTreatmentPlans() {
  return useQuery<TreatmentPlan[], Error>({
    queryKey: ["treatmentPlans"],
    queryFn: () => treatmentPlanService.getTreatmentPlans(),
  });
}

/* =========================================================
   GET TREATMENT PLAN BY ID
========================================================= */

export function useTreatmentPlanById(id: string) {
  return useQuery<TreatmentPlanDto | null, Error>({
    queryKey: ["treatmentPlanById", id],
    queryFn: () => treatmentPlanService.getById(id),
    enabled: !!id,
  });
}

/* =========================================================
   CREATE TREATMENT PLAN
========================================================= */

export function useAddTreatmentPlan() {
  const queryClient = useQueryClient();

  return useMutation<TreatmentPlanDto | null, Error, TreatmentPlanDto>({
    mutationKey: ["addTreatmentPlan"],

    mutationFn: (treatmentPlan) =>
      treatmentPlanService.addTreatmentPlan(treatmentPlan),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["treatmentPlans"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlansOrchestrator",
        ],
      });
    },
  });
}

/* =========================================================
   UPDATE TREATMENT PLAN
========================================================= */

export interface UpdateTreatmentPlanVariables {
  id: string;
  treatmentPlan: TreatmentPlanDto;
}

export function useUpdateTreatmentPlan() {
  const queryClient = useQueryClient();

  return useMutation<
    TreatmentPlanDto | null,
    Error,
    UpdateTreatmentPlanVariables
  >({
    mutationKey: ["updateTreatmentPlan"],

    mutationFn: ({ id, treatmentPlan }) =>
      treatmentPlanService.updateTreatmentPlan(id, treatmentPlan),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["treatmentPlans"],
      });

      queryClient.invalidateQueries({
        queryKey: ["treatmentPlanById", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlansOrchestrator",
        ],
      });
    },
  });
}

/* =========================================================
   DELETE TREATMENT PLAN
========================================================= */

export function useDeleteTreatmentPlan() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationKey: ["deleteTreatmentPlan"],

    mutationFn: (id) =>
      treatmentPlanService.deleteTreatmentPlan(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["treatmentPlans"],
      });

      queryClient.invalidateQueries({
        queryKey: ["treatmentPlanById", id],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlansOrchestrator",
        ],
      });
    },
  });
}

/* =========================================================
   PROPOSE TREATMENT PLAN
========================================================= */

export function useProposeTreatmentPlan() {
  const queryClient = useQueryClient();

  return useMutation<TreatmentPlanDto | null, Error, string>({
    mutationKey: ["proposeTreatmentPlan"],

    mutationFn: (id) =>
      treatmentPlanService.propose(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["treatmentPlans"],
      });

      queryClient.invalidateQueries({
        queryKey: ["treatmentPlanById", id],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlansOrchestrator",
        ],
      });
    },
  });
}

/* =========================================================
   ACCEPT TREATMENT PLAN
========================================================= */

export function useAcceptTreatmentPlan() {
  const queryClient = useQueryClient();

  return useMutation<TreatmentPlanDto | null, Error, string>({
    mutationKey: ["acceptTreatmentPlan"],

    mutationFn: (id) =>
      treatmentPlanService.accept(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["treatmentPlans"],
      });

      queryClient.invalidateQueries({
        queryKey: ["treatmentPlanById", id],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlansOrchestrator",
        ],
      });
    },
  });
}

/* =========================================================
   START TREATMENT PLAN
========================================================= */

export function useStartTreatmentPlan() {
  const queryClient = useQueryClient();

  return useMutation<TreatmentPlanDto | null, Error, string>({
    mutationKey: ["startTreatmentPlan"],

    mutationFn: (id) =>
      treatmentPlanService.start(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["treatmentPlans"],
      });

      queryClient.invalidateQueries({
        queryKey: ["treatmentPlanById", id],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlansOrchestrator",
        ],
      });
    },
  });
}

/* =========================================================
   COMPLETE TREATMENT PLAN
========================================================= */

export function useCompleteTreatmentPlan() {
  const queryClient = useQueryClient();

  return useMutation<TreatmentPlanDto | null, Error, string>({
    mutationKey: ["completeTreatmentPlan"],

    mutationFn: (id) =>
      treatmentPlanService.complete(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["treatmentPlans"],
      });

      queryClient.invalidateQueries({
        queryKey: ["treatmentPlanById", id],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlansOrchestrator",
        ],
      });
    },
  });
}

/* =========================================================
   CANCEL TREATMENT PLAN
========================================================= */

export function useCancelTreatmentPlan() {
  const queryClient = useQueryClient();

  return useMutation<TreatmentPlanDto | null, Error, string>({
    mutationKey: ["cancelTreatmentPlan"],

    mutationFn: (id) =>
      treatmentPlanService.cancel(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["treatmentPlans"],
      });

      queryClient.invalidateQueries({
        queryKey: ["treatmentPlanById", id],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlansOrchestrator",
        ],
      });
    },
  });
}

/* =========================================================
   SET SUBTOTAL
========================================================= */

export interface SetTreatmentPlanSubtotalVariables {
  id: string;
  amount: number;
}

export function useSetTreatmentPlanSubtotal() {
  const queryClient = useQueryClient();

  return useMutation<
    TreatmentPlanDto | null,
    Error,
    SetTreatmentPlanSubtotalVariables
  >({
    mutationKey: ["setTreatmentPlanSubtotal"],

    mutationFn: ({ id, amount }) =>
      treatmentPlanService.setSubtotal(id, amount),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["treatmentPlans"],
      });

      queryClient.invalidateQueries({
        queryKey: ["treatmentPlanById", variables.id],
      });
    },
  });
}

/* =========================================================
   APPLY DISCOUNT
========================================================= */

export interface ApplyTreatmentPlanDiscountVariables {
  id: string;
  discount: number;
}

export function useApplyTreatmentPlanDiscount() {
  const queryClient = useQueryClient();

  return useMutation<
    TreatmentPlanDto | null,
    Error,
    ApplyTreatmentPlanDiscountVariables
  >({
    mutationKey: ["applyTreatmentPlanDiscount"],

    mutationFn: ({ id, discount }) =>
      treatmentPlanService.applyDiscount(id, discount),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["treatmentPlans"],
      });

      queryClient.invalidateQueries({
        queryKey: ["treatmentPlanById", variables.id],
      });
    },
  });
}

/* =========================================================
   REMOVE DISCOUNT
========================================================= */

export function useRemoveTreatmentPlanDiscount() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationKey: ["removeTreatmentPlanDiscount"],

    mutationFn: (id) =>
      treatmentPlanService.removeDiscount(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["treatmentPlans"],
      });

      queryClient.invalidateQueries({
        queryKey: ["treatmentPlanById", id],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "treatmentPlansOrchestrator",
        ],
      });
    },
  });
}