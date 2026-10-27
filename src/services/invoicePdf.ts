
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import type Invoice from "../models/InvoiceModel";
import type Payment from "../models/PaymentModel";
import type Installment from "../models/InstallmentModel";
import {
    invoiceStatusSpanishOptions,
} from "../utils/invoiceStatus.enum";
import {
    PaymentPlanStatusSpanishOptions,
} from "../utils/paymentPlanStatus.enum";
import {
    InstallmentStatusSpanishOptions,
} from "../utils/installmentStatus.enum";
import {
    PaymentMehodsSpanishOptions,
} from "../utils/paymentMethodsStatus.enum";
import { loadImageAsBase64 } from "./medicalPrescriptionPdf";
import logoClinica from "../assets/logo.webp";

interface InvoicePdfPaymentPlanDetails {
    paymentPlan: {
        totalAmount?: number | string;
        numberOfInstallments?: number;
        frequencyDays?: number;
        interestRate?: number;
        status?: string;
    };
    installments?: Installment[];
    payments?: Payment[];
}

export const exportInvoicePdf = async (
    invoice: Invoice,
    planDetails?: InvoicePdfPaymentPlanDetails | null
) => {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;

    const formatCurrency = (value?: number | string | null) =>
        Number(value ?? 0).toLocaleString("es-NI", {
            style: "currency",
            currency: "NIO",
        });

    const formatDate = (value?: string | Date | null) => {
        if (!value) return "No especificada";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "No especificada";
        }

        return date.toLocaleString("es-NI", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const textOrDefault = (
        value?: string | number | null
    ) => {
        if (value === null || value === undefined || value === "") {
            return "No especificado";
        }

        return String(value);
    };

    const invoiceStatus =
        invoiceStatusSpanishOptions.find(
            (option) => option.value === invoice.status
        )?.label ?? textOrDefault(invoice.status);

    let currentY = 45;

    // Encabezado
    doc.setFillColor(15, 118, 110);
    doc.rect(0, 0, pageWidth, 34, "F");

    // Logo a la izquierda del título
    try {
        const logo = await loadImageAsBase64(logoClinica);

        doc.addImage(
            logo,
            "PNG",
            margin,
            7,
            24,
            24,
            undefined,
            "FAST"
        );
    } catch (error) {
        console.error("Error al cargar el logo:", error);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(19);
    doc.text("Odontología integral Dr. López", 45, 13);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("FACTURA", 45, 22);
    doc.setFontSize(9);
    doc.text("Comprobante de facturación", 45, 28);

    // Información general
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Información de la factura", margin, currentY);

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY + 4, pageWidth - margin, currentY + 4);

    currentY += 13;

    const addInfo = (label: string, value: string) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(label, margin, currentY);

        doc.setFont("helvetica", "normal");
        doc.text(
            doc.splitTextToSize(value, contentWidth - 45),
            margin + 45,
            currentY
        );

        currentY += 9;
    };

    addInfo("N.º de factura:", textOrDefault(invoice.invoiceNumber));
    addInfo("Cliente:", textOrDefault(invoice.patientFullName));
    addInfo("Estado:", invoiceStatus);

    // Resumen económico
    autoTable(doc, {
        startY: currentY + 2,
        margin: { left: margin, right: margin },
        head: [["Total de la factura", "Monto pagado", "Monto pendiente"]],
        body: [[
            formatCurrency(invoice.totalAmount),
            formatCurrency(invoice.paidAmount),
            formatCurrency(invoice.pendingAmount),
        ]],
        theme: "grid",
        styles: {
            font: "helvetica",
            fontSize: 9,
            cellPadding: 4,
            halign: "center",
        },
        headStyles: {
            fillColor: [15, 118, 110],
            textColor: [255, 255, 255],
            fontStyle: "bold",
        },
        bodyStyles: {
            textColor: [30, 41, 59],
        },
    });

    const pdf = doc as jsPDF & {
        lastAutoTable?: { finalY: number };
    };

    currentY = (pdf.lastAutoTable?.finalY ?? currentY) + 10;

    const addSectionTitle = (title: string) => {
        if (currentY > pageHeight - 35) {
            doc.addPage();
            currentY = 20;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text(title, margin, currentY);

        currentY += 5;
    };

    // Información del plan de cuotas (si existe)
    if (planDetails?.paymentPlan) {
        const plan = planDetails.paymentPlan;

        addSectionTitle("Plan de cuotas");

        autoTable(doc, {
            startY: currentY,
            margin: { left: margin, right: margin, bottom: 20 },
            head: [[
                "Total del plan",
                "N.º de cuotas",
                "Frecuencia",
                "Interés",
                "Estado",
            ]],
            body: [[
                formatCurrency(plan.totalAmount),
                textOrDefault(plan.numberOfInstallments),
                `Cada ${textOrDefault(plan.frequencyDays)} días`,
                `${Number(plan.interestRate ?? 0)}%`,
                PaymentPlanStatusSpanishOptions.find(
                    (option) => option.value === plan.status
                )?.label ?? textOrDefault(plan.status),
            ]],
            theme: "grid",
            styles: {
                font: "helvetica",
                fontSize: 8,
                cellPadding: 3,
                overflow: "linebreak",
            },
            headStyles: {
                fillColor: [15, 118, 110],
                textColor: [255, 255, 255],
            },
        });

        currentY = (pdf.lastAutoTable?.finalY ?? currentY) + 9;

        // Cuotas
        addSectionTitle("Detalle de cuotas");

        const installments = planDetails.installments ?? [];

        autoTable(doc, {
            startY: currentY,
            margin: { left: margin, right: margin, bottom: 20 },
            head: [[
                "Cuota",
                "Monto",
                "Pagado",
                "Fecha límite",
                "Estado",
            ]],
            body: installments.length
                ? installments.map((item) => [
                    textOrDefault(item.installmentNumber),
                    formatCurrency(item.amount),
                    formatCurrency(item.paidAmount),
                    formatDate(item.dueDate),
                    InstallmentStatusSpanishOptions.find(
                        (option) => option.value === item.status
                    )?.label ?? textOrDefault(item.status),
                ])
                : [["Sin cuotas", "-", "-", "-", "-"]],
            theme: "grid",
            styles: {
                font: "helvetica",
                fontSize: 8,
                cellPadding: 3,
                overflow: "linebreak",
            },
            headStyles: {
                fillColor: [15, 118, 110],
                textColor: [255, 255, 255],
            },
        });

        currentY = (pdf.lastAutoTable?.finalY ?? currentY) + 9;

        // Pagos registrados
        addSectionTitle("Pagos registrados");

        const payments = planDetails.payments ?? [];

        autoTable(doc, {
            startY: currentY,
            margin: { left: margin, right: margin, bottom: 20 },
            head: [[
                "Monto",
                "Método de pago",
                "Referencia",
                "Fecha del pago",
            ]],
            body: payments.length
                ? payments.map((payment) => [
                    formatCurrency(payment.amount),
                    PaymentMehodsSpanishOptions.find(
                        (option) => option.value === payment.payment_method
                    )?.label ?? textOrDefault(payment.payment_method),
                    textOrDefault(payment.transaction_reference),
                    formatDate(payment.payment_date),
                ])
                : [["Sin pagos registrados", "-", "-", "-"]],
            theme: "grid",
            styles: {
                font: "helvetica",
                fontSize: 8,
                cellPadding: 3,
                overflow: "linebreak",
            },
            headStyles: {
                fillColor: [15, 118, 110],
                textColor: [255, 255, 255],
            },
        });

        currentY = (pdf.lastAutoTable?.finalY ?? currentY) + 8;
    } else {
        addSectionTitle("Información de pagos");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        doc.text(
            "Esta factura no tiene detalles de un plan de cuotas disponibles.",
            margin,
            currentY + 2
        );

        currentY += 12;
    }

    // Pie de página en todas las páginas
    const pageCount = doc.getNumberOfPages();

    for (let page = 1; page <= pageCount; page++) {
        doc.setPage(page);

        doc.setDrawColor(226, 232, 240);
        doc.line(
            margin,
            pageHeight - 15,
            pageWidth - margin,
            pageHeight - 15
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);

        doc.text(
            "Odontología integral Dr. López | Factura",
            margin,
            pageHeight - 9
        );

        doc.text(
            `Página ${page} de ${pageCount}`,
            pageWidth - margin,
            pageHeight - 9,
            { align: "right" }
        );
    }

    const safeInvoiceNumber = textOrDefault(invoice.invoiceNumber)
        .replace(/[<>:"/\\|?*\s]/g, "-");

    doc.save(`factura-${safeInvoiceNumber}.pdf`);
};
