import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import type InventoryModel from "../models/InventoryModel";
import { loadImageAsBase64 } from "./medicalPrescriptionPdf";
import logoClinica from "../assets/logo.webp";

export const exportInventoryPdf = async (
    inventories: InventoryModel[]
) => {
    if (!inventories.length) {
        throw new Error("No hay inventarios para generar el reporte.");
    }

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 16;
    const primaryColor: [number, number, number] = [15, 118, 110];
    const textColor: [number, number, number] = [30, 41, 59];
    const secondaryColor: [number, number, number] = [71, 85, 105];

    const formatDate = (date: Date) =>
        date.toLocaleString("es-NI", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    // --------------------------------------------------
    // Header
    // --------------------------------------------------

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

    doc.text("Odontología integral Dr. López", 45, 13);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("REPORTE DE INVENTARIO", 45, 22);

    doc.setFontSize(9);
    doc.text("Existencias y niveles de stock", 45, 28);

    // --------------------------------------------------
    // Report information
    // --------------------------------------------------

    let currentY = 47;

    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    doc.text("Información del reporte", margin, currentY);

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY + 4, pageWidth - margin, currentY + 4);

    currentY += 13;

    const lowStockCount = inventories.filter(
        (item) => item.currentStock < item.minimumStock
    ).length;

    const normalStockCount = inventories.length - lowStockCount;

    const reportInfo = [
        ["Fecha de generación", formatDate(new Date())],
        ["Total de inventarios", String(inventories.length)],
        ["Inventarios con stock bajo", String(lowStockCount)],
        ["Inventarios con stock normal", String(normalStockCount)],
    ];

    reportInfo.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...textColor);
        doc.text(`${label}:`, margin, currentY);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(...secondaryColor);
        doc.text(value, margin + 55, currentY);

        currentY += 7;
    });

    currentY += 8;

    // --------------------------------------------------
    // Inventory table
    // --------------------------------------------------

    autoTable(doc, {
        startY: currentY,
        margin: {
            left: margin,
            right: margin,
            bottom: 20,
        },
        head: [[
            "N.º",
            "Producto",
            "Stock actual",
            "Stock mínimo",
            "Estado",
        ]],
        body: inventories.map((inventory, index) => [
            String(index + 1),
            inventory.productName || "Sin nombre",
            String(inventory.currentStock ?? 0),
            String(inventory.minimumStock ?? 0),
            inventory.currentStock < inventory.minimumStock
                ? "Stock bajo"
                : "Normal",
        ]),
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
        columnStyles: {
            0: { cellWidth: 12, halign: "center" },
            1: { cellWidth: 75 },
            2: { cellWidth: 27, halign: "center" },
            3: { cellWidth: 27, halign: "center" },
            4: { cellWidth: 35, halign: "center" },
        },
        didParseCell: (data) => {
            if (
                data.section === "body" &&
                data.column.index === 4
            ) {
                const isLowStock =
                    String(data.cell.raw) === "Stock bajo";

                data.cell.styles.textColor = isLowStock
                    ? [185, 28, 28]
                    : [21, 128, 61];

                data.cell.styles.fontStyle = "bold";
            }
        },
    });

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
            "Odontología integral Dr. López | Reporte de inventario",
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

    const fileName = `reporte-inventario-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;

    doc.save(fileName);
};
