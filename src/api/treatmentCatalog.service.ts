import type { CreateTreatmentCatalogDTO, UpdateTreatmentCatalogDTO } from "../models/TreatmentCatalogModel";
import type TreatmentCatalogModel from "../models/TreatmentCatalogModel";
import HTTPService from "./http-service";

export default class TreatmentCatalogService extends HTTPService {
  private path: string;

  constructor() {
    super();
    this.path = "treatmentCatalog";
  }

  /**
   * Obtiene todos los tratamientos.
   */
  async getTreatments(): Promise<TreatmentCatalogModel[]> {
    const response = await super.get<TreatmentCatalogModel[]>(this.path);

    return response || [];
  }

  /**
   * Obtiene un tratamiento por ID.
   */
  async getById(id: string): Promise<TreatmentCatalogModel | null> {
    const response = await super.get<TreatmentCatalogModel | null>(
      `${this.path}/${id}`
    );

    return response || null;
  }

  /**
   * Crea un nuevo tratamiento.
   */
  async addTreatment(
    treatment: CreateTreatmentCatalogDTO
  ): Promise<TreatmentCatalogModel | null> {
    const response = await super.post<
      TreatmentCatalogModel,
      CreateTreatmentCatalogDTO
    >(
      this.path,
      treatment
    );

    return response || null;
  }

  /**
   * Actualiza los datos generales del tratamiento.
   *
   * No modifica precio, duración ni estado.
   */
  async updateTreatment(
    id: string,
    treatment: Partial<UpdateTreatmentCatalogDTO>
  ): Promise<TreatmentCatalogModel | null> {
    const response = await super.put<
      TreatmentCatalogModel,
      Partial<UpdateTreatmentCatalogDTO>
    >(
      `${this.path}/${id}`,
      treatment
    );

    return response || null;
  }

  /**
   * Elimina un tratamiento.
   */
  async deleteTreatment(id: string): Promise<void> {
    await super.delete(`${this.path}/${id}`);
  }

  /**
   * Cambia el precio base del tratamiento.
   */
  async changePrice(
    id: string,
    price: number
  ): Promise<TreatmentCatalogModel | null> {
    const response = await super.put<
      TreatmentCatalogModel,
      { price: number }
    >(
      `${this.path}/${id}/price`,
      { price }
    );

    return response || null;
  }

  /**
   * Cambia la duración estimada del tratamiento.
   */
  async changeDuration(
    id: string,
    minutes: number
  ): Promise<TreatmentCatalogModel | null> {
    const response = await super.put<
      TreatmentCatalogModel,
      { minutes: number }
    >(
      `${this.path}/${id}/duration`,
      { minutes }
    );

    return response || null;
  }

  /**
   * Activa el tratamiento.
   */
  async activateTreatment(
    id: string
  ): Promise<TreatmentCatalogModel | null> {
    const response = await super.post<
      TreatmentCatalogModel,
      undefined
    >(
      `${this.path}/${id}/activate`,
      undefined
    );

    return response || null;
  }

  /**
   * Desactiva el tratamiento.
   */
  async deactivateTreatment(
    id: string
  ): Promise<TreatmentCatalogModel | null> {
    const response = await super.post<
      TreatmentCatalogModel,
      undefined
    >(
      `${this.path}/${id}/deactivate`,
      undefined
    );

    return response || null;
  }
}
