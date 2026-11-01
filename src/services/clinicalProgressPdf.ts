
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import type PatientModel from "../models/PatientModel";
import { dentalChartStatusSpanishOptions } from "../utils/dentalChartStatus.enum";
import logoClinica from "../assets/logo.webp";

export const loadImageAsBase64 = (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const image = new Image();

        // Debe configurarse ANTES de asignar src.
        image.crossOrigin = "anonymous";

        image.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                if (!context) {
                    reject(new Error("No se pudo crear el contexto del canvas."));
                    return;
                }

                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;

                context.drawImage(
                    image,
                    0,
                    0,
                    image.naturalWidth,
                    image.naturalHeight
                );

                // Convertimos todas las imágenes a PNG.
                const base64 = canvas.toDataURL("image/png");

                resolve(base64);
            } catch (error) {
                reject(error);
            }
        };

        image.onerror = () => {
            reject(
                new Error(
                    `No se pudo cargar la imagen: ${src}. Verifica los permisos CORS del servidor.`
                )
            );
        };

        image.src = src;
    });
};

// ------------------------------------------------------
// Interfaces
// ------------------------------------------------------

interface ClinicalProgressDetail {
    id: string;
    diagnosis?: string | null;
    observations?: string | null;
    registrationDate?: string | Date | null;
}

interface MedicalPrescription {
    dentistFullName?: string | null;
    generalInstructions?: string | null;
}

interface MedicalPrescriptionDetail {
    id: string;
    medicine?: string | null;
    dose?: string | null;
    frequency?: string | null;
    duration?: string | null;
}

interface DentalChart {
    observations?: string | null;
}

interface DentalChartDetail {
    id: string;
    toothNumber?: number | string | null;
    face?: string | null;
    toothStatus?: string | null;
    notes?: string | null;
}

interface PatientAttachment {
    description?: string | null;
    fileName?: string | null;
    fileUrl?: string | null;
}

export interface ClinicalProgressPdfRecord {
    clinicalProgress: ClinicalProgressDetail;

    medicalPrescription?: {
        medicalPrescription?: MedicalPrescription | null;
        details?: MedicalPrescriptionDetail[];
    } | null;

    dentalChart?: {
        dentalChart?: DentalChart | null;
        details?: DentalChartDetail[];
    } | null;

    patientAttachment?: PatientAttachment | null;
}

// ------------------------------------------------------
// Export PDF
// ------------------------------------------------------

export const exportClinicalProgressPdf = async (
    patient: PatientModel,
    progresses: ClinicalProgressPdfRecord[]
) => {
    if (!progresses.length) {
        throw new Error("No hay consultas para generar el expediente clínico.");
    }

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 16;
    const contentWidth = pageWidth - margin * 2;

    const primaryColor: [number, number, number] = [15, 118, 110];
    const textColor: [number, number, number] = [30, 41, 59];
    const secondaryColor: [number, number, number] = [71, 85, 105];

    let currentY = 45;

    const pdf = doc as jsPDF & {
        lastAutoTable?: { finalY: number };
    };

    // --------------------------------------------------
    // Helpers
    // --------------------------------------------------

    const textOrDefault = (
        value?: string | number | null
    ): string => {
        if (value === null || value === undefined || value === "") {
            return "No especificado";
        }

        return String(value);
    };

    const formatDate = (
        value?: string | Date | null
    ): string => {
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

    const addPageIfNeeded = (requiredHeight = 15) => {
        if (currentY + requiredHeight > pageHeight - 22) {
            doc.addPage();
            currentY = 20;
        }
    };

    const addSectionTitle = (title: string) => {
        addPageIfNeeded(15);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...textColor);

        doc.text(title, margin, currentY);

        doc.setDrawColor(226, 232, 240);
        doc.line(
            margin,
            currentY + 2,
            pageWidth - margin,
            currentY + 2
        );

        currentY += 9;
    };

    const addParagraph = (
        label: string,
        value?: string | null
    ) => {
        const content = textOrDefault(value);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);

        const labelWidth = doc.getTextWidth(`${label}: `);

        doc.setFont("helvetica", "normal");

        const lines = doc.splitTextToSize(
            content,
            contentWidth - labelWidth
        );

        const lineHeight = 5;
        const requiredHeight = Math.max(6, lines.length * lineHeight);

        addPageIfNeeded(requiredHeight + 3);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...textColor);

        doc.text(`${label}:`, margin, currentY);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(...secondaryColor);

        doc.text(
            lines,
            margin + labelWidth,
            currentY
        );

        currentY += requiredHeight + 3;
    };

    const addTable = (
        head: string[][],
        body: string[][],
        columnStyles?: Record<number, object>
    ) => {
        addPageIfNeeded(20);

        autoTable(doc, {
            startY: currentY,
            margin: {
                left: margin,
                right: margin,
                bottom: 20,
            },
            head,
            body,
            theme: "grid",
            styles: {
                font: "helvetica",
                fontSize: 8,
                cellPadding: 3,
                overflow: "linebreak",
                textColor,
            },
            headStyles: {
                fillColor: primaryColor,
                textColor: [255, 255, 255],
                fontStyle: "bold",
            },
            bodyStyles: {
                textColor,
            },
            columnStyles,
        });

        currentY = (pdf.lastAutoTable?.finalY ?? currentY) + 8;
    };

    // --------------------------------------------------
    // Header
    // --------------------------------------------------

    const addHeader = async () => {
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, pageWidth, 34, "F");

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

        doc.text(
            "Odontología integral Dr. López",
            45,
            13
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);

        doc.text("EXPEDIENTE CLÍNICO", 45, 22);

        doc.setFontSize(9);

        doc.text(
            "Historial de consultas y tratamientos",
            45,
            28
        );
    };

    await addHeader();

    // --------------------------------------------------
    // Patient information
    // --------------------------------------------------

    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    doc.text("Información del paciente", margin, currentY);

    doc.setDrawColor(226, 232, 240);

    doc.line(
        margin,
        currentY + 4,
        pageWidth - margin,
        currentY + 4
    );

    currentY += 13;

    const patientFullName =
        `${patient.name} ${patient.lastName}`;

    addParagraph("Paciente", patientFullName);
    addParagraph("Cédula", patient.idCard);
    addParagraph("Fecha de generación", formatDate(new Date()));
    addParagraph("Total de consultas", progresses.length.toString());

    currentY += 3;

    // --------------------------------------------------
    // Clinical progress records
    // --------------------------------------------------

    for (let index = 0; index < progresses.length; index++) {
        const item = progresses[index];
        const clinicalProgress = item.clinicalProgress;

        // Cada consulta comienza en una nueva página.
        // Esto facilita identificar y leer cada registro.
        if (index > 0) {
            doc.addPage();
            currentY = 20;
        }

        // Consulta title
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(
            margin,
            currentY - 5,
            contentWidth,
            17,
            2,
            2,
            "F"
        );

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(...primaryColor);

        doc.text(
            `Consulta #${index + 1}`,
            margin + 4,
            currentY + 2
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...secondaryColor);

        doc.text(
            formatDate(clinicalProgress.registrationDate),
            pageWidth - margin - 4,
            currentY + 2,
            { align: "right" }
        );

        currentY += 19;

        // ----------------------------------------------
        // Clinical information
        // ----------------------------------------------

        addSectionTitle("Información clínica");

        addParagraph(
            "Especialista",
            item.medicalPrescription?.medicalPrescription?.dentistFullName
        );

        addParagraph(
            "Observaciones clínicas",
            clinicalProgress.observations
        );

        addParagraph(
            "Diagnóstico",
            clinicalProgress.diagnosis
        );

        addParagraph(
            "Instrucciones generales",
            item.medicalPrescription?.medicalPrescription?.generalInstructions
        );

        // ----------------------------------------------
        // Medical prescription
        // ----------------------------------------------

        const prescriptionDetails =
            item.medicalPrescription?.details ?? [];

        addSectionTitle("Receta médica");

        if (prescriptionDetails.length > 0) {
            addTable(
                [[
                    "Medicamento",
                    "Dosis",
                    "Frecuencia",
                    "Duración",
                ]],
                prescriptionDetails.map((detail) => [
                    textOrDefault(detail.medicine),
                    textOrDefault(detail.dose),
                    textOrDefault(detail.frequency),
                    textOrDefault(detail.duration),
                ]),
                {
                    0: { cellWidth: 55 },
                    1: { cellWidth: 35 },
                    2: { cellWidth: 45 },
                    3: { cellWidth: 35 },
                }
            );
        } else {
            addParagraph(
                "Detalle",
                "No hay medicamentos registrados en esta consulta."
            );
        }

        // ----------------------------------------------
        // Dental chart
        // ----------------------------------------------

        if (item.dentalChart) {
            addSectionTitle("Odontograma");

            addParagraph(
                "Observaciones generales",
                item.dentalChart.dentalChart?.observations
            );

            const dentalDetails =
                item.dentalChart.details ?? [];

            if (dentalDetails.length > 0) {
                addTable(
                    [[
                        "Pieza dental",
                        "Cara",
                        "Estado",
                        "Observaciones",
                    ]],
                    dentalDetails.map((detail) => {
                        const status =
                            dentalChartStatusSpanishOptions.find(
                                (option) =>
                                    option.value === detail.toothStatus
                            )?.label ?? textOrDefault(detail.toothStatus);

                        return [
                            textOrDefault(detail.toothNumber),
                            textOrDefault(detail.face),
                            status,
                            textOrDefault(detail.notes),
                        ];
                    }),
                    {
                        0: { cellWidth: 25, halign: "center" },
                        1: { cellWidth: 25, halign: "center" },
                        2: { cellWidth: 40 },
                        3: { cellWidth: 80 },
                    }
                );
            } else {
                addParagraph(
                    "Detalle",
                    "No hay detalles registrados en el odontograma."
                );
            }
        }

        // ----------------------------------------------
        // Patient attachment
        // ----------------------------------------------

        if (item.patientAttachment) {
            addSectionTitle("Archivo adjunto");

            const attachment = item.patientAttachment;

            addParagraph(
                "Nombre del archivo",
                attachment.fileName
            );

            addParagraph(
                "Descripción",
                attachment.description
            );

            if (attachment.fileUrl) {
                try {
                    const imageBase64 = await loadImageAsBase64(
                        attachment.fileUrl
                    );

                    const imageProperties =
                        doc.getImageProperties(imageBase64);

                    const maxWidth = contentWidth;
                    const maxHeight = 85;

                    const ratio = Math.min(
                        maxWidth / imageProperties.width,
                        maxHeight / imageProperties.height
                    );

                    const imageWidth =
                        imageProperties.width * ratio;

                    const imageHeight =
                        imageProperties.height * ratio;

                    addPageIfNeeded(imageHeight + 8);

                    const imageFormat =
                        imageBase64.startsWith("data:image/png")
                            ? "PNG"
                            : "JPEG";

                    doc.addImage(
                        imageBase64,
                        imageFormat,
                        margin,
                        currentY,
                        imageWidth,
                        imageHeight,
                        undefined,
                        "FAST"
                    );

                    currentY += imageHeight + 8;
                } catch (error) {
                    console.error(
                        "No se pudo agregar el archivo adjunto al PDF:",
                        error
                    );

                    addParagraph(
                        "Archivo",
                        "No fue posible cargar la imagen adjunta."
                    );
                }
            }
        }
    }

    // --------------------------------------------------
    // Footer on every page
    // --------------------------------------------------

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
            "Odontología integral Dr. López | Expediente clínico",
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

    // --------------------------------------------------
    // Download
    // --------------------------------------------------

    const safePatientName = patientFullName
        .replace(/[<>:"/\\|?*\s]/g, "-");

    const fileName =
        `expediente-clinico-${safePatientName}.pdf`;

    doc.save(fileName);
};
