import type { ClinicalProgresDto } from "../models/ClinicalProgressModel";
import type ClinicalProgres from "../models/ClinicalProgressModel";
import HTTPService from "./http-service";

export default class ClinicalProgressService extends HTTPService {
  private path: string;

  constructor() {
    super();
    this.path = "clinicalProgres";
  }

  /**
   * Obtiene la lista completa de ClinicalProgres sin paginación
   */
  async getClinicalProgress(): Promise<ClinicalProgres[]> {
    const response = await super.get<ClinicalProgres[]>(this.path);

    return response || [];
  }

  /**
   * Obtiene un clinicalProgress por su ID
   */
  async getById(id: string): Promise<ClinicalProgres | null> {
    const response = await super.get<ClinicalProgres | null>(`${this.path}/${id}`);

    return response || null;
  }

  /**
   * Crea un nuevo clinicalProgress
   */
  async addClinicalProgress(clinicalProgress: ClinicalProgresDto): Promise<ClinicalProgres | null> {
    const response = await super.post<ClinicalProgres, ClinicalProgresDto>(this.path, clinicalProgress);

    return response || null;
  }

  /**
   * Actualiza el nombre de un clinicalProgress
   */
  async updateClinicalProgress(id: string, clinicalProgress: ClinicalProgresDto): Promise<ClinicalProgres | null> {
    const response = await super.put<ClinicalProgres, ClinicalProgresDto>(
      `${this.path}/${id}`,
      clinicalProgress
    );

    return response || null;
  }

  /**
   * Elimina un clinicalProgress por su ID
   */
  async deleteClinicalProgress(id: string): Promise<void> {
    await super.delete(`${this.path}/${id}`);
  }
}