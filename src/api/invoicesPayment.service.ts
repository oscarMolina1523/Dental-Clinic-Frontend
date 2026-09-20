

import type { AddPaymentToInvoiceDto, CreateInvoiceWithPaymentDto, InvoicePaymentResponse } from "../models/InvoicePaymentModel";
import HTTPService from "./http-service";


export default class InvoicePaymentService extends HTTPService {
  private path: string;

  constructor() {
    super();
    this.path = "invoice-payments";
  }


  // ============================================================
  // CREATE INVOICE + INITIAL PAYMENT
  // ============================================================

  async createInvoiceWithPayment(
    data: CreateInvoiceWithPaymentDto
  ): Promise<InvoicePaymentResponse | null> {

    const response =
      await super.post<
        InvoicePaymentResponse,
        CreateInvoiceWithPaymentDto
      >(
        `${this.path}`,
        data
      );

    return response || null;
  }


  // ============================================================
  // ADD PAYMENT TO EXISTING INVOICE
  // ============================================================

  async addPaymentToInvoice(
    invoiceId: string,
    data: AddPaymentToInvoiceDto
  ): Promise<InvoicePaymentResponse | null> {

    const response =
      await super.post<
        InvoicePaymentResponse,
        AddPaymentToInvoiceDto
      >(
        `${this.path}/${invoiceId}/payments`,
        data
      );

    return response || null;
  }
}