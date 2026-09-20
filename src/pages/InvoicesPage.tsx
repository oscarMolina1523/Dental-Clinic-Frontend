import React, { useMemo, useState } from "react";
import { Ban, Eye, Pencil, Plus } from "lucide-react";
import type { TableAction, TableColumn } from "../shared/Table/types";
import DataTable from "../shared/Table/DataTable";
import Pagination from "../shared/Table/Pagination";
import { useTableSearch } from "../shared/Table/useTableSearch";
import SearchInput from "../shared/Table/SearchInput";
import { useInvoices } from "../hooks/useInvoices";
import type Invoice from "../models/InvoiceModel";
import CreateInvoiceDrawer from "../components/invoices/CreateInvoiceDrawer";
import ConfirmModal from "../shared/ConfirmModal";
import Toast from "../shared/Toast";
import ShowDetailsInvoiceDrawer from "../components/invoices/ShowDetailsInvoiceDrawer";
import RegisterPaymentDrawer from "../components/invoices/RegisterPaymentDrawer";
import { useCancelPaymentPlan } from "../hooks/usePaymentPlanOrchestrator";

const InvoicesPage: React.FC = () => {
    const {
        data: invoices = []
    } = useInvoices();


    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const [isCreateDrawerOpen, setIsCreateDrawerOpen] =
        useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isRegisterPaymentOpen, setIsRegisterPaymentOpen] =
        useState(false);
    const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] =
        useState(false);

    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const {
        mutate: cancelPaymentPlan,
        isPending: isCanceling
    } = useCancelPaymentPlan(selectedInvoice?.id);

    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const showToast = (
        type: "success" | "error",
        message: string
    ) => {
        setToast({
            type,
            message,
        });
    };

    const searchFields: (keyof Invoice)[] = [
        "patientFullName",
        "invoiceNumber",
        "totalAmount",
        "pendingAmount",
        "status",
    ];

    const {
        search,
        setSearch,
        filteredData,
    } = useTableSearch<Invoice>({
        data: invoices,
        fields: searchFields,
        delay: 800,
    });

    const totalItems = filteredData.length; //obtenemos la cantidad total de items 

    const totalPages = Math.max(
        1,
        Math.ceil(totalItems / ITEMS_PER_PAGE)
    );

    const validPage = Math.min(
        currentPage,
        totalPages
    );

    //para obtener solo los lotes que queremos por pagina, los visibles
    const startIndex = (validPage - 1) * ITEMS_PER_PAGE;

    const endIndex = startIndex + ITEMS_PER_PAGE;

    const currentInvoices = useMemo(
        () =>
            filteredData.slice(
                startIndex,
                endIndex
            ),
        [startIndex, endIndex, filteredData]
    );

    const columns: TableColumn<typeof invoices[number]>[] = [
        {
            key: "invoiceNumber",
            header: "Número de factura",
            render: (invoice: Invoice) => (
                <span className="text-sm text-slate-500">
                    {invoice.invoiceNumber}
                </span>
            ),
        },
        {
            key: "patientFullName",
            header: "Paciente",
            className: "pl-2 w-80",
            render: (invoice: Invoice) => (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-800">
                        {invoice.patientFullName}
                    </span>

                </div>
            ),
        },
        {
            key: "totalAmount",
            header: "Monto total",
            render: (invoice: Invoice) => (
                <span className="text-sm text-slate-500">
                    {`C$ ${invoice.totalAmount}`}
                </span>
            ),
        },
        {
            key: "paidAmount",
            header: "Pagado",
            render: (invoice: Invoice) => (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-800">
                        {`C$ ${invoice.paidAmount}`}
                    </span>

                </div>
            ),
        },
        {
            key: "pendingAmount",
            header: "Por Pagar",
            render: (invoice: Invoice) => (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-800">
                        {`C$ ${invoice.pendingAmount}`}
                    </span>

                </div>
            ),
        },
        {
            key: "status",
            header: "Estado",
            render: (invoice: Invoice) => (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-800">
                        {invoice.status}
                    </span>

                </div>
            ),
        },
    ];

    const actions: TableAction<typeof invoices[number]>[] = [
        {
            label: "Ver Factura",
            icon: <Eye className="w-4 h-4" />,
            onClick: (invoice) => {
                setSelectedInvoice(invoice);
                setIsDetailsDrawerOpen(true);
            },
        },
        {
            label: "Cancelar Factura",
            hidden: (invoice) =>
                invoice.status == "PAID" ||
                invoice.status == "CANCELLED",
            icon: <Ban className="w-4 h-4" />,
            onClick: (invoice) => {
                setSelectedInvoice(invoice);
                setIsCancelModalOpen(true);
            },
        },
        {
            label: "Editar inventario",
            icon: <Pencil className="w-4 h-4" />,
            onClick: (invoice) => {
                setSelectedInvoice(invoice);
                setIsRegisterPaymentOpen(true);
            },
        },
    ];

    const handleSearch = (value: string) => {
        setSearch(value);

        /*
         * Cuando el usuario empieza una nueva búsqueda,
         * volvemos a la primera página.
         */
        setCurrentPage(1);
    };

    const handleCancelInvoiceConfirm = () => {
        if (!selectedInvoice) return;

        cancelPaymentPlan(undefined, {
            onSuccess: () => {
                setSelectedInvoice(null);
                setIsCancelModalOpen(false);

                showToast(
                    "success",
                    "El plan de pago, sus cuotas y la factura fueron cancelados correctamente."
                );
            },

            onError: (error) => {
                showToast(
                    "error",
                    error.message || "No se pudo cancelar el plan de pago."
                );
            },
        });
    };

    return (
        <div className="h-full w-full bg-[#f8fafc] p-8 flex flex-col justify-between select-none">
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                {/* Encabezado */}
                <div className="flex items-center justify-between pb-6 mb-2">
                    {/* <h1 className="text-xl font-bold text-[#001D4A]">Productos</h1> */}
                    <SearchInput
                        value={search}
                        onChange={handleSearch}
                        placeholder="Buscar Factura..."
                    />
                    <button onClick={() => setIsCreateDrawerOpen(true)} className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-500/20 cursor-pointer">
                        <Plus className="w-4 h-4" />
                        <span>Nueva Factura</span>
                    </button>
                </div>

                {/* Tabla de Facturas */}
                <div className="overflow-x-auto">
                    <DataTable
                        data={currentInvoices}
                        columns={columns}
                        actions={actions}
                        getRowId={(invoice) => invoice.id}
                        emptyMessage="No hay Facturas registradas."
                    />
                </div>
            </div>

            {/* Paginación de la Tabla */}
            <div className="flex items-center justify-between pt-4 px-2 text-xs text-slate-500">
                <Pagination
                    currentPage={validPage}
                    totalItems={totalItems}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                    label="Facturas"
                />
            </div>
            <CreateInvoiceDrawer isOpen={isCreateDrawerOpen} onHide={() => setIsCreateDrawerOpen(false)} />
            <ConfirmModal
                isOpen={isCancelModalOpen}
                title={`¿Estás seguro de cancelar a esta factura?`}
                description="Esta acción no se puede deshacer. Todos los datos asociados a este paciente se perderán permanentemente."
                confirmText={isCanceling ? "Ejecutando..." : "Confirmar"}
                cancelText="Cancelar"
                onConfirm={handleCancelInvoiceConfirm}
                onCancel={() => {
                    setIsCancelModalOpen(false);
                    setSelectedInvoice(null);
                }}
            />
            <ShowDetailsInvoiceDrawer isOpen={isDetailsDrawerOpen} onHide={() => setIsDetailsDrawerOpen(false)} invoice={selectedInvoice} />
            <RegisterPaymentDrawer isOpen={isRegisterPaymentOpen} onHide={() => setIsRegisterPaymentOpen(false)} invoice={selectedInvoice} />
        </div>
    );
}

export default InvoicesPage;