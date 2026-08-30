import type {
  CreatePatientDTO,
  UpdatePatientDTO,
} from "../models/PatientModel";

import type Patient from "../models/PatientModel";
import HTTPService from "./http-service";

export default class PatientService extends HTTPService {
  private path: string;

  constructor() {
    super();
    this.path = "patient";
  }

  // =========================================================
  // GET ALL PATIENTS
  // =========================================================

  async getPatients(): Promise<Patient[]> {
    const response = await super.get<Patient[]>(this.path);

    return response || [];
  }

  // =========================================================
  // GET PATIENT BY ID
  // =========================================================

  async getById(id: string): Promise<Patient | null> {
    const response = await super.get<Patient | null>(
      `${this.path}/${id}`
    );

    return response || null;
  }

  // =========================================================
  // CREATE PATIENT
  // =========================================================

  async addPatient(
    patient: CreatePatientDTO
  ): Promise<Patient | null> {
    const response = await super.post<
      Patient,
      CreatePatientDTO
    >(
      this.path,
      patient
    );

    return response || null;
  }

  // =========================================================
  // UPDATE PATIENT
  // =========================================================

  async updatePatient(
    id: string,
    patient: UpdatePatientDTO
  ): Promise<Patient | null> {
    const response = await super.put<
      Patient,
      UpdatePatientDTO
    >(
      `${this.path}/${id}`,
      patient
    );

    return response || null;
  }

  // =========================================================
  // DELETE PATIENT
  // =========================================================

  async deletePatient(id: string): Promise<void> {
    await super.delete(
      `${this.path}/${id}`
    );
  }

  // =========================================================
  // CHANGE PHONE NUMBER
  // =========================================================

  async changePhoneNumber(
    id: string,
    phoneNumber: string
  ): Promise<Patient | null> {
    const response = await super.put<
      Patient,
      { phoneNumber: string }
    >(
      `${this.path}/${id}/phone`,
      {
        phoneNumber,
      }
    );

    return response || null;
  }

  // =========================================================
  // CHANGE EMAIL
  // =========================================================

  async changeEmail(
    id: string,
    email: string
  ): Promise<Patient | null> {
    const response = await super.put<
      Patient,
      { email: string }
    >(
      `${this.path}/${id}/email`,
      {
        email,
      }
    );

    return response || null;
  }

  // =========================================================
  // CHANGE ADDRESS
  // =========================================================

  async changeAddress(
    id: string,
    address: string
  ): Promise<Patient | null> {
    const response = await super.put<
      Patient,
      { address: string }
    >(
      `${this.path}/${id}/address`,
      {
        address,
      }
    );

    return response || null;
  }

  // =========================================================
  // UPDATE EMERGENCY CONTACT
  // =========================================================

  async updateEmergencyContact(
    id: string,
    name: string,
    phone: string
  ): Promise<Patient | null> {
    const response = await super.put<
      Patient,
      {
        name: string;
        phone: string;
      }
    >(
      `${this.path}/${id}/emergency-contact`,
      {
        name,
        phone,
      }
    );

    return response || null;
  }

  // =========================================================
  // CHANGE IMAGE
  // =========================================================

  async changeImage(
    id: string,
    image: string
  ): Promise<Patient | null> {
    const response = await super.put<
      Patient,
      { image: string }
    >(
      `${this.path}/${id}/image`,
      {
        image,
      }
    );

    return response || null;
  }

  // =========================================================
  // ACTIVATE PATIENT
  // =========================================================

  async activatePatient(
    id: string
  ): Promise<Patient | null> {
    const response = await super.post<
      Patient,
      undefined
    >(
      `${this.path}/${id}/activate`,
      undefined
    );

    return response || null;
  }

  // =========================================================
  // DEACTIVATE PATIENT
  // =========================================================

  async deactivatePatient(
    id: string
  ): Promise<Patient | null> {
    const response = await super.post<
      Patient,
      undefined
    >(
      `${this.path}/${id}/deactivate`,
      undefined
    );

    return response || null;
  }
}