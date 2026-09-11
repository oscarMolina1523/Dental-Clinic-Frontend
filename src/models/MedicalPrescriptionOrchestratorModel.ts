import type {
  MedicalPrescriptionDto,
} from "./MedicalPrescriptionModel";

import type {
  MedicalPrescriptionDetailDto,
} from "./MedicalPrescriptionDetailModel";
import type MedicalPrescription from "./MedicalPrescriptionModel";
import type MedicalPrescriptionDetail from "./MedicalPrescriptionDetailModel";

export interface CreateMedicalPrescriptionRequest {
  data: MedicalPrescriptionDto;
  details: MedicalPrescriptionDetailDto[];
}

export interface UpdateMedicalPrescriptionRequest {
  data: MedicalPrescriptionDto;
  details: MedicalPrescriptionDetailDto[];
}

export interface MedicalPrescriptionOrchestratorResponse {
  medicalPrescription: MedicalPrescription;
  details: MedicalPrescriptionDetail[];
}