import type { TreatmentPlanDetailDto } from "../models/TreatmentPlanDetailsModel";
import type TreatmentPlanDetail from "../models/TreatmentPlanDetailsModel";
import type { TreatmentPlanDto } from "../models/TreatmentPlanModel";
import type TreatmentPlan from "../models/TreatmentPlanModel";

// ============================================================
// TREATMENT PLAN ORCHESTRATOR RESPONSE
// ============================================================

export interface TreatmentPlanOrchestratorResponse {

  treatmentPlan: TreatmentPlan;

  details: TreatmentPlanDetail[];

}


// ============================================================
// CREATE TREATMENT PLAN REQUEST
// ============================================================

export interface CreateTreatmentPlanRequest {

  data: TreatmentPlanDto;

  details: TreatmentPlanDetailDto[];

}