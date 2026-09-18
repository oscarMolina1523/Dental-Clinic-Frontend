import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  AddPaymentToInvoiceDto,
  CreateInvoiceWithPaymentDto,
  InvoicePaymentResponse,
} from "../models/InvoicePaymentModel";
import InvoicePaymentService from "../api/invoicesPayment.service";

const invoicePaymentService = new InvoicePaymentService();

/* =========================================================
   CREATE INVOICE + INITIAL PAYMENT
========================================================= */

export function useCreateInvoiceWithPayment() {

  const queryClient = useQueryClient();

  return useMutation<
    InvoicePaymentResponse | null,
    Error,
    CreateInvoiceWithPaymentDto
  >({

    mutationKey: [
      "createInvoiceWithPayment",
    ],

    mutationFn: (data) =>
      invoicePaymentService
        .createInvoiceWithPayment(data),

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: [
          "invoices",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "payments",
        ],
      });
    },
  });
}


/* =========================================================
   ADD PAYMENT TO EXISTING INVOICE
========================================================= */

export interface AddPaymentToInvoiceVariables {
  invoiceId: string;
  data: AddPaymentToInvoiceDto;
}


export function useAddPaymentToInvoice() {

  const queryClient = useQueryClient();

  return useMutation<
    InvoicePaymentResponse | null,
    Error,
    AddPaymentToInvoiceVariables
  >({

    mutationKey: [
      "addPaymentToInvoice",
    ],

    mutationFn: ({
      invoiceId,
      data,
    }) =>
      invoicePaymentService
        .addPaymentToInvoice(
          invoiceId,
          data
        ),

    onSuccess: (_, variables) => {

      queryClient.invalidateQueries({
        queryKey: [
          "invoices",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "invoiceById",
          variables.invoiceId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "payments",
        ],
      });
    },
  });
}