
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import type { MedicalPrescriptionOrchestratorResponse } from "../models/MedicalPrescriptionOrchestratorModel";
import logoClinica from "../assets/logo.webp";

export const loadImageAsBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => {
            const canvas = document.createElement("canvas");

            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;

            const context = canvas.getContext("2d");

            if (!context) {
                reject(new Error("No se pudo procesar el logo"));
                return;
            }

            context.drawImage(image, 0, 0);

            // Convertir la imagen a PNG para jsPDF
            resolve(canvas.toDataURL("image/png"));
        };

        image.onerror = () => {
            reject(
                new Error(`No se pudo cargar el logo: ${url}`)
            );
        };

        image.src = url;
    });
};


export const exportMedicalPrescriptionPdf = async (
    prescription: MedicalPrescriptionOrchestratorResponse
) => {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;

    const medicalPrescription = prescription.medicalPrescription;

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

    const textOrDefault = (value?: string | null) =>
        value?.trim() || "No especificado";

    // Encabezado de la clínica
    doc.setFillColor(15, 118, 110);
    doc.rect(0, 0, pageWidth, 38, "F");

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
    doc.text("Odontología integral Dr. López", 46, 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("RECETA MÉDICA", 46, 23);
    doc.text("Documento de prescripción", 46, 30);

    // Información del paciente y especialista
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Información de la receta", margin, 49);

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, 53, pageWidth - margin, 53);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Paciente:", margin, 62);
    doc.text("Especialista:", margin, 74);
    doc.text("Fecha:", margin, 86);

    doc.setFont("helvetica", "normal");
    doc.text(
        doc.splitTextToSize(
            textOrDefault(medicalPrescription.patientFullName),
            contentWidth - 30
        ),
        margin + 30,
        62
    );
    doc.text(
        doc.splitTextToSize(
            textOrDefault(medicalPrescription.dentistFullName),
            contentWidth - 30
        ),
        margin + 30,
        74
    );
    doc.text(
        formatDate(medicalPrescription.date),
        margin + 30,
        86
    );

    // Instrucciones generales
    let currentY = 99;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Instrucciones generales", margin, currentY);

    currentY += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const instructions = doc.splitTextToSize(
        textOrDefault(medicalPrescription.generalInstructions),
        contentWidth - 8
    );

    const instructionsHeight = Math.max(
        12,
        instructions.length * 5 + 6
    );

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(
        margin,
        currentY - 2,
        contentWidth,
        instructionsHeight,
        2,
        2,
        "FD"
    );

    doc.text(instructions, margin + 4, currentY + 4);

    currentY += instructionsHeight + 10;

    // Medicamentos
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Medicamentos prescritos", margin, currentY);

    const medicines = prescription.details ?? [];

    autoTable(doc, {
        startY: currentY + 5,
        margin: {
            left: margin,
            right: margin,
            bottom: 20,
        },
        head: [[
            "Medicamento",
            "Dosis",
            "Frecuencia",
            "Duración",
        ]],
        body: medicines.length
            ? medicines.map((detail) => [
                textOrDefault(detail.medicine),
                textOrDefault(detail.dose),
                textOrDefault(detail.frequency),
                textOrDefault(detail.duration),
            ])
            : [["Sin medicamentos", "-", "-", "-"]],
        theme: "grid",
        styles: {
            font: "helvetica",
            fontSize: 9,
            cellPadding: 3,
            overflow: "linebreak",
            valign: "top",
        },
        headStyles: {
            fillColor: [15, 118, 110],
            textColor: [255, 255, 255],
            fontStyle: "bold",
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252],
        },
        columnStyles: {
            0: { cellWidth: 48 },
            1: { cellWidth: 38 },
            2: { cellWidth: 43 },
            3: { cellWidth: "auto" },
        },
    });

    // Pie de página en todas las páginas
    const pageCount = doc.getNumberOfPages();

    for (let page = 1; page <= pageCount; page++) {
        doc.setPage(page);

        const pageHeight = doc.internal.pageSize.getHeight();

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
            "Odontología integral Dr. López | Receta médica",
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

    const filename = `${medicalPrescription.patientFullName}-${formatDate(
        medicalPrescription.date
    )
        .replace(/[/:,\s]/g, "-")}.pdf`;

    doc.save(filename);
};
