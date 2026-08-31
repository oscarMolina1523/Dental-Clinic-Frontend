

import type { MeasurementUnitDTO } from "../models/MeasurementUnitModel";
import type MeasurementUnit from "../models/MeasurementUnitModel";
import HTTPService from "./http-service";

export default class MeasurementUnitService extends HTTPService {
  private path: string;

  constructor() {
    super();
    this.path = "measurementUnit";
  }

  /**
   * Obtiene la lista completa de MeasurementUnit sin paginación
   */
  async getMeasurementUnites(): Promise<MeasurementUnit[]> {
    const response = await super.get<MeasurementUnit[]>(this.path);

    return response || [];
  }

  /**
   * Obtiene un measurement por su ID
   */
  async getById(id: string): Promise<MeasurementUnit | null> {
    const response = await super.get<MeasurementUnit | null>(`${this.path}/${id}`);

    return response || null;
  }

  /**
   * Crea un nuevo measurement
   */
  async addMeasurementUnit(measurementUnit: MeasurementUnitDTO): Promise<MeasurementUnit | null> {
    const response = await super.post<MeasurementUnit, MeasurementUnitDTO>(this.path, measurementUnit);

    return response || null;
  }

  /**
   * Actualiza el nombre de un measurementUnit
   */
  async updateMeasurementUnit(id: string, measurementUnit: MeasurementUnitDTO): Promise<MeasurementUnit | null> {
    const response = await super.put<MeasurementUnit, MeasurementUnitDTO>(
      `${this.path}/${id}`,
      measurementUnit
    );

    return response || null;
  }

  /**
   * Elimina un measurementUnit por su ID
   */
  async deleteMeasurementUnit(id: string): Promise<void> {
    await super.delete(`${this.path}/${id}`);
  }
}