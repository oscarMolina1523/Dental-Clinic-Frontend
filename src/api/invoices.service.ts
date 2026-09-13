import type Invoice from "../models/InvoiceModel";
import type { InvoiceDto } from "../models/InvoiceModel";
import HTTPService from "./http-service";

export default class InvoiceService extends HTTPService {
  private path: string;

  constructor() {
    super();
    this.path = "invoice";
  }

  /**
   * Obtiene la lista de invoices con paginación
   */
  async getInvoices(
    page: number = 1,
    pageSize: number = 100
  ): Promise<Invoice[]> {
    const response = await super.get<Invoice[]>(
      `${this.path}?page=${page}&pageSize=${pageSize}`
    );

    return response || [];
  }

  /**
   * Obtiene un invoice por su ID
   */
  async getById(id: string): Promise<Invoice | null> {
    const response = await super.get<Invoice | null>(
      `${this.path}/${id}`
    );

    return response || null;
  }

  /**
   * Crea un nuevo invoice
   */
  async addInvoice(
    invoice: InvoiceDto
  ): Promise<Invoice | null> {
    const response = await super.post<Invoice, InvoiceDto>(
      this.path,
      invoice
    );

    return response || null;
  }

  /**
   * Actualiza un invoice
   */
  async updateInvoice(
    id: string,
    invoice: InvoiceDto
  ): Promise<Invoice | null> {
    const response = await super.put<Invoice, InvoiceDto>(
      `${this.path}/${id}`,
      invoice
    );

    return response || null;
  }

  /**
   * Elimina un invoice por su ID
   */
  async deleteInvoice(id: string): Promise<void> {
    await super.delete(`${this.path}/${id}`);
  }

  /**
   * Agrega un pago al invoice
   */
  async addPayment(
    id: string,
    amount: number
  ): Promise<Invoice | null> {
    const response = await super.post<
      Invoice,
      { amount: number }
    >(
      `${this.path}/${id}/payment`,
      { amount }
    );

    return response || null;
  }

  /**
   * Elimina/revierte un pago del invoice
   */
  async removePayment(
    id: string,
    amount: number
  ): Promise<Invoice | null> {
    const response = await super.post<
      Invoice,
      { amount: number }
    >(
      `${this.path}/${id}/payment/remove`,
      { amount }
    );

    return response || null;
  }

  /**
   * Cambia el monto total del invoice
   */
  async changeTotal(
    id: string,
    amount: number
  ): Promise<Invoice | null> {
    const response = await super.put<
      Invoice,
      { amount: number }
    >(
      `${this.path}/${id}/total`,
      { amount }
    );

    return response || null;
  }

  /**
   * Cancela un invoice
   */
  async cancelInvoice(
    id: string
  ): Promise<Invoice | null> {
    const response = await super.post<Invoice, undefined>(
      `${this.path}/${id}/cancel`,
      undefined
    );

    return response || null;
  }
}