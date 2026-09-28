import type { DentalChartDetailsStatus } from "../utils/dentalChartStatus.enum";
import type DentalChartDetail from "./DentalChartDetailModel";
import type { DentalChartDto } from "./DentalChartModel";
import type DentalChart from "./DentalChartModel";

export interface CreateDentalChartRequest {
  dentalChart: DentalChartDto;
  details: DentalChartDetailDto[];
}

export interface DentalChartOrchestratorResponse {
  dentalChart: DentalChart;
  details: DentalChartDetail[];
}

export interface UpdateDentalChartRequest {
  dentalChart: DentalChartDto;
  details: DentalChartDetailDto[];
}

export interface DentalChartWithDetails {
  dentalChart: DentalChart;
  details: DentalChartDetail[];
}

export interface DentalChartDetailDto {
  dentalChartId: string;
  toothNumber: number;
  face: string;
  toothStatus: DentalChartDetailsStatus;
  notes: string;
}
