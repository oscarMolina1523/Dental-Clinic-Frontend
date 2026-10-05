import type { CreateAppointmentDTO } from "./AppointmentModel";
import type Appointment from "./AppointmentModel";
import type { CreateTreatmentCatalogDTO } from "./TreatmentCatalogModel";
import type TreatmentCatalogModel from "./TreatmentCatalogModel";
import type { TreatmentPlanDetailDto } from "./TreatmentPlanDetailsModel";
import type TreatmentPlanDetail from "./TreatmentPlanDetailsModel";
import type { TreatmentPlanDto } from "./TreatmentPlanModel";
import type TreatmentPlan from "./TreatmentPlanModel";

export interface AppointmentWithDetails {
  appointment: Appointment;

  treatment: TreatmentCatalogModel | null;

  treatmentPlan: TreatmentPlan | null;

  treatmentPlanDetails: TreatmentPlanDetail[];
}

export interface CreateAppointmentOrchestratorDto {
  appointment: CreateAppointmentDTO;

  treatment?: CreateTreatmentCatalogDTO;

  treatmentPlan?: {
    data: TreatmentPlanDto;
    details: TreatmentPlanDetailDto[];
  };
}
