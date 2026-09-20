import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type Invoice from "../models/InvoiceModel";
import type { InvoiceDto } from "../models/InvoiceModel";
import InvoiceService from "../api/invoices.service";

const invoiceService = new InvoiceService();

/* =========================================================
   GET INVOICES
========================================================= */

export function useInvoices(
  page: number = 1,
  pageSize: number = 100
) {
  return useQuery<Invoice[], Error>({
    queryKey: ["invoices", page, pageSize],

    queryFn: () =>
      invoiceService.getInvoices(page, pageSize),
  });
}

/* =========================================================
   GET INVOICE BY ID
========================================================= */

export function useInvoiceById(id: string) {
  return useQuery<Invoice | null, Error>({
    queryKey: ["invoiceById", id],

    queryFn: () =>
      invoiceService.getById(id),

    enabled: !!id,
  });
}

/* =========================================================
   CREATE INVOICE
========================================================= */

export function useAddInvoice() {
  const queryClient = useQueryClient();

  return useMutation<Invoice | null, Error, InvoiceDto>({
    mutationKey: ["addInvoice"],

    mutationFn: (invoice) =>
      invoiceService.addInvoice(invoice),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
    },
  });
}

/* =========================================================
   UPDATE INVOICE
========================================================= */

export interface UpdateInvoiceVariables {
  id: string;
  invoice: InvoiceDto;
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation<
    Invoice | null,
    Error,
    UpdateInvoiceVariables
  >({
    mutationKey: ["updateInvoice"],

    mutationFn: ({ id, invoice }) =>
      invoiceService.updateInvoice(id, invoice),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });

      queryClient.invalidateQueries({
        queryKey: ["invoiceById", variables.id],
      });
    },
  });
}

/* =========================================================
   DELETE INVOICE
========================================================= */

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationKey: ["deleteInvoice"],

    mutationFn: (id) =>
      invoiceService.deleteInvoice(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
    },
  });
}

/* =========================================================
   ADD PAYMENT
========================================================= */

export interface AddPaymentVariables {
  id: string;
  amount: number;
}

export function useAddInvoicePayment() {
  const queryClient = useQueryClient();

  return useMutation<
    Invoice | null,
    Error,
    AddPaymentVariables
  >({
    mutationKey: ["addInvoicePayment"],

    mutationFn: ({ id, amount }) =>
      invoiceService.addPayment(id, amount),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });

      queryClient.invalidateQueries({
        queryKey: ["invoiceById", variables.id],
      });
    },
  });
}

/* =========================================================
   REMOVE PAYMENT
========================================================= */

export interface RemovePaymentVariables {
  id: string;
  amount: number;
}

export function useRemoveInvoicePayment() {
  const queryClient = useQueryClient();

  return useMutation<
    Invoice | null,
    Error,
    RemovePaymentVariables
  >({
    mutationKey: ["removeInvoicePayment"],

    mutationFn: ({ id, amount }) =>
      invoiceService.removePayment(id, amount),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });

      queryClient.invalidateQueries({
        queryKey: ["invoiceById", variables.id],
      });
    },
  });
}

/* =========================================================
   CHANGE TOTAL
========================================================= */

export interface ChangeInvoiceTotalVariables {
  id: string;
  amount: number;
}

export function useChangeInvoiceTotal() {
  const queryClient = useQueryClient();

  return useMutation<
    Invoice | null,
    Error,
    ChangeInvoiceTotalVariables
  >({
    mutationKey: ["changeInvoiceTotal"],

    mutationFn: ({ id, amount }) =>
      invoiceService.changeTotal(id, amount),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });

      queryClient.invalidateQueries({
        queryKey: ["invoiceById", variables.id],
      });
    },
  });
}

/* =========================================================
   CANCEL INVOICE
========================================================= */

export function useCancelInvoice() {
  const queryClient = useQueryClient();

  return useMutation<Invoice | null, Error, string>({
    mutationKey: ["cancelInvoice"],

    mutationFn: (id) =>
      invoiceService.cancelInvoice(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });

      queryClient.invalidateQueries({
        queryKey: ["invoiceById", id],
      });
    },
  });
}