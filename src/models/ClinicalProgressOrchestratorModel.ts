import type { ClinicalProgresDto } from "./ClinicalProgressModel";
import type { DentalChartDto } from "./DentalChartModel";
import type { DentalChartDetailDto, DentalChartWithDetails } from "./DentalChartOrchestratorModel";
import type { MedicalPrescriptionDetailDto } from "./MedicalPrescriptionDetailModel";
import type { MedicalPrescriptionDto } from "./MedicalPrescriptionModel";
import type { PatientAttachmentDto } from "./PatientAttachmentModel";
import type ClinicalProgres from "../models/ClinicalProgressModel";
import type MedicalPrescription from "./MedicalPrescriptionModel";
import type MedicalPrescriptionDetail from "./MedicalPrescriptionDetailModel";
import type PatientAttachment from "./PatientAttachmentModel";

export interface CreateClinicalProgressOrchestratorDto {
  clinicalProgress: ClinicalProgresDto;

  medicalPrescription?: {
    data: MedicalPrescriptionDto;
    details: MedicalPrescriptionDetailDto[];
  };

  dentalChart?: {
    dentalChart: DentalChartDto;
    details: DentalChartDetailDto[];
  };

  patientAttachment?: PatientAttachmentDto;
}

export interface MedicalPrescriptionWithDetails {
  medicalPrescription: MedicalPrescription;
  details: MedicalPrescriptionDetail[];
}

export interface ClinicalProgressOrchestratorResult {
  clinicalProgress: ClinicalProgres;

  medicalPrescription:
    | MedicalPrescriptionWithDetails
    | null;

  dentalChart:
    | DentalChartWithDetails
    | null;

  patientAttachment:
    | PatientAttachment
    | null;
}