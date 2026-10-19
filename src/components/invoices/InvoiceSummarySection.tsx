import React from "react";
import type Invoice from "../../models/InvoiceModel";

interface InvoiceSummarySectionProps {
    invoice: Invoice;
    formatCurrency: (value: number) => string;
}

const InvoiceSummarySection: React.FC<InvoiceSummarySectionProps> = ({
    invoice,
    formatCurrency,
}) => {
    return (
        <div>
            <h3 className="
                                text-sm
                                font-semibold
                                text-slate-800
                                mb-4
                            ">
                Información de la factura - {invoice.invoiceNumber}
            </h3>

            <div className="
                            border
                            border-slate-200
                            rounded-xl
                            p-4
                            space-y-4
                        ">
                <div className="flex flex-col md:flex-row gap-2 w-full">
                    <div className="flex-1">
                        <label className="
                                    block
                                    text-xs
                                    font-medium
                                    text-slate-600
                                    mb-1
                                ">
                            Deudor
                        </label>

                        <input
                            type="text"
                            value={
                                invoice.patientFullName
                            }
                            disabled
                            className="
                                        w-full
                                        px-3
                                        py-2.5
                                        border
                                        border-slate-200
                                        rounded-lg
                                        text-sm
                                        bg-slate-50
                                        text-slate-500
                                        outline-none
                                    "
                        />
                    </div>

                    <div className="flex-1">
                        <label className="
                                    block
                                    text-xs
                                    font-medium
                                    text-slate-600
                                    mb-1
                                ">
                            Saldo pendiente de factura
                        </label>

                        <input
                            type="text"
                            value={formatCurrency(
                                Number(
                                    invoice.pendingAmount ||
                                    0
                                )
                            )}
                            disabled
                            className="
                                        w-full
                                        px-3
                                        py-2.5
                                        border
                                        border-slate-200
                                        rounded-lg
                                        text-sm
                                        bg-blue-50
                                        text-[#001D4A]
                                        font-semibold
                                        outline-none
                                    "
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceSummarySection;