
import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import { useProducts } from "../../hooks/useProducts";
import { useInventoryLotes } from "../../hooks/useInventorylotes";
import { useCreateInventoryLote } from "../../hooks/useInventoryOrchestrator";
import type { CreateInventoryOrchestratorRequest } from "../../models/InventoryOrchestratorModel";
import {
    useAddSupplier,
    useDeleteSupplier,
    useSuppliers,
} from "../../hooks/useSupplier";
import type ProductModel from "../../models/ProductModel";
import SearchableSelect from "../../shared/searchableSelect/SearchableSelect";
import type SupplierModel from "../../models/SupplierModel";
import type { SupplierDTO } from "../../models/SupplierModel";
import { Check, Plus, Trash2, X } from "lucide-react";
import ConfirmModal from "../../shared/ConfirmModal";
import { generateLoteNumber } from "../../utils/generateLoteNumber";

interface InventoryLoteDraft {
    rowId: string;
    productId: string;
    productName: string;
    quantity: number;
    dueDate: string;
    observation: string;
}

const createEmptyLote = (): InventoryLoteDraft => ({
    rowId: crypto.randomUUID(),
    productId: "",
    productName: "",
    quantity: 0,
    dueDate: "",
    observation: "",
});

interface CreateInventoryLoteProps {
    isOpen: boolean;
    onHide: () => void;
}

const CreateInventoryLoteDrawer: React.FC<CreateInventoryLoteProps> = ({
    isOpen,
    onHide,
}) => {
    const { mutate: addSupplier, isPending: isAddingSupplier } =
        useAddSupplier();

    const { mutate: deleteSupplier, isPending: isDeletingSupplier } =
        useDeleteSupplier();

    const { mutateAsync: addLote, isPending } =
        useCreateInventoryLote();

    const { data: inventoryLotes = [] } = useInventoryLotes();

    const {
        data: suppliers = [],
        isLoading: isLoadingSuppliers,
    } = useSuppliers();

    const {
        data: products = [],
        isLoading: isLoadingProducts,
    } = useProducts(1, 10);

    // Un solo proveedor para todos los lotes.
    const [form, setForm] = useState({
        supplierId: "",
    });

    // Cada fila contiene su propio producto, cantidad,
    // vencimiento y observaciones.
    const [lotes, setLotes] = useState<InventoryLoteDraft[]>([
        createEmptyLote(),
    ]);

    const [isCreatingSupplier, setIsCreatingSupplier] = useState(false);

    const [newSupplier, setNewSupplier] = useState<SupplierDTO>({
        name: "",
        contact: "",
        phone: "",
        email: "",
    });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const showToast = (
        type: "success" | "error",
        message: string
    ) => {
        setToast({ type, message });
    };

    const cleanForm = () => {
        setForm({ supplierId: "" });
        setLotes([createEmptyLote()]);
        setIsCreatingSupplier(false);
        onHide();
    };

    // Agregar una fila.
    const handleAddLote = () => {
        setLotes((prev) => [...prev, createEmptyLote()]);
    };

    // Eliminar una fila. Siempre debe quedar al menos una.
    const handleRemoveLote = (rowId: string) => {
        setLotes((prev) =>
            prev.length === 1
                ? [createEmptyLote()]
                : prev.filter((lote) => lote.rowId !== rowId)
        );
    };

    // Actualizar un campo de una fila.
    const handleLoteChange = (
        rowId: string,
        field: keyof InventoryLoteDraft,
        value: string | number
    ) => {
        setLotes((prev) =>
            prev.map((lote) =>
                lote.rowId === rowId
                    ? { ...lote, [field]: value }
                    : lote
            )
        );
    };

    // Guardar ID y nombre del producto seleccionado.
    const handleLoteProductChange = (
        rowId: string,
        product: ProductModel
    ) => {
        setLotes((prev) =>
            prev.map((lote) =>
                lote.rowId === rowId
                    ? {
                        ...lote,
                        productId: String(product.id),
                        productName: product.name,
                        dueDate: "",
                    }
                    : lote
            )
        );
    };

    // Generar identificadores consecutivos.
    const firstLoteNumber = generateLoteNumber(inventoryLotes);

    const getLoteNumber = (index: number) => {
        const match = firstLoteNumber.match(/^LOTE-(\d+)$/i);

        if (!match) {
            return index === 0
                ? firstLoteNumber
                : `${firstLoteNumber}-${index + 1}`;
        }

        const nextNumber = Number(match[1]) + index;

        return `LOTE-${String(nextNumber).padStart(3, "0")}`;
    };

    // Seleccionar el proveedor compartido.
    const handleSupplierChange = (supplier: SupplierModel) => {
        setForm((prev) => ({
            ...prev,
            supplierId: String(supplier.id),
        }));
    };

    // Crear proveedor.
    const handleCreateSupplier = () => {
        const supplierData: SupplierDTO = {
            name: newSupplier.name.trim(),
            contact: newSupplier.contact.trim(),
            phone: newSupplier.phone.trim(),
            email: newSupplier.email.trim(),
        };

        if (!supplierData.name) {
            showToast("error", "El nombre del proveedor es obligatorio.");
            return;
        }

        if (!supplierData.phone) {
            showToast("error", "El teléfono del proveedor es obligatorio.");
            return;
        }

        if (!supplierData.email) {
            showToast("error", "El correo electrónico es obligatorio.");
            return;
        }

        addSupplier(supplierData, {
            onSuccess: (supplier) => {
                showToast("success", "El proveedor se creó correctamente.");

                setNewSupplier({
                    name: "",
                    contact: "",
                    phone: "",
                    email: "",
                });

                setIsCreatingSupplier(false);

                if (supplier?.id) {
                    setForm((prev) => ({
                        ...prev,
                        supplierId: String(supplier.id),
                    }));
                }
            },
            onError: (error) => {
                showToast(
                    "error",
                    error.message || "No se pudo crear el proveedor."
                );
            },
        });
    };

    // Abrir confirmación de eliminación.
    const handleDeleteSupplier = () => {
        if (!form.supplierId) {
            showToast("error", "Debe seleccionar un proveedor.");
            return;
        }

        const selectedSupplier = suppliers.find(
            (supplier) => String(supplier.id) === form.supplierId
        );

        if (!selectedSupplier) {
            showToast("error", "No se encontró el proveedor seleccionado.");
            return;
        }

        setIsDeleteModalOpen(true);
    };

    // Confirmar eliminación del proveedor.
    const handleDeleteSupplierConfirm = () => {
        const selectedSupplierId = form.supplierId;

        if (!selectedSupplierId) return;

        deleteSupplier(selectedSupplierId, {
            onSuccess: () => {
                showToast(
                    "success",
                    "El proveedor se eliminó correctamente."
                );

                setForm((prev) => ({
                    ...prev,
                    supplierId: "",
                }));

                setIsDeleteModalOpen(false);
            },
            onError: (error) => {
                showToast(
                    "error",
                    error.message || "No se pudo eliminar el proveedor."
                );

                setIsDeleteModalOpen(false);
            },
        });
    };

    // Validar y registrar todos los lotes.
    const handleSubmit = async () => {
        const selectedSupplierId = form.supplierId.trim();

        if (!selectedSupplierId) {
            showToast("error", "Debe seleccionar un proveedor.");
            return;
        }

        if (isCreatingSupplier || isAddingSupplier) {
            showToast(
                "error",
                "Termine de registrar el proveedor antes de continuar."
            );
            return;
        }

        if (lotes.length === 0) {
            showToast("error", "Debe agregar al menos un lote.");
            return;
        }

        // Validar producto y cantidad de todas las filas.
        for (let index = 0; index < lotes.length; index++) {
            const lote = lotes[index];

            if (!lote.productId || !lote.productName.trim()) {
                showToast(
                    "error",
                    `Seleccione un producto para el lote ${index + 1}.`
                );
                return;
            }

            if (
                !Number.isInteger(Number(lote.quantity)) ||
                Number(lote.quantity) <= 0
            ) {
                showToast(
                    "error",
                    `Ingrese una cantidad entera mayor que cero para el lote ${index + 1}.`
                );
                return;
            }

            const product = products.find(
                (item) => String(item.id) === lote.productId
            );

            if (!product) {
                showToast(
                    "error",
                    `No se encontró el producto ${lote.productName}.`
                );
                return;
            }

            if (Number(product.hasExpiration) && !lote.dueDate) {
                showToast(
                    "error",
                    `Debe indicar el vencimiento de ${lote.productName}.`
                );
                return;
            }

            if (
                lote.dueDate &&
                lote.dueDate < new Date().toISOString().split("T")[0]
            ) {
                showToast(
                    "error",
                    `La fecha de vencimiento de ${lote.productName} no puede ser anterior a hoy.`
                );
                return;
            }
        }

        try {
            // Registrar cada fila usando el proveedor seleccionado.
            for (let index = 0; index < lotes.length; index++) {
                const lote = lotes[index];

                const data: CreateInventoryOrchestratorRequest = {
                    productId: lote.productId,
                    productName: lote.productName,
                    supplierId: selectedSupplierId,
                    loteNumber: getLoteNumber(index),
                    quantity: Number(lote.quantity),
                    entryDate: new Date(),
                    userId: "system",
                    observation: lote.observation.trim(),
                };

                if (lote.dueDate) {
                    data.dueDate = new Date(
                        `${lote.dueDate}T00:00:00`
                    );
                }

                await addLote(data);
            }

            cleanForm();

            showToast(
                "success",
                "Todos los lotes se registraron correctamente."
            );
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? `Error al registrar los lotes: ${error.message}. Verifique cuáles se guardaron antes de reintentar.`
                    : "No se pudieron registrar todos los lotes. Verifique cuáles se guardaron antes de reintentar."
            );
        }
    };

    return (
        <>
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Overlay */}
            <div
                onClick={onHide}
                className={`
                    fixed inset-0 z-40 bg-black/30
                    transition-opacity duration-300
                    ${isOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }
                `}
            />

            <GenericDrawer
                isOpen={isOpen}
                onHide={onHide}
                title="Nuevo Lote de Inventario"
                description="Registra uno o varios lotes de inventario"
                width="w-80 md:w-200"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={onHide}
                            disabled={isPending}
                            className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={
                                isPending ||
                                isAddingSupplier ||
                                isDeletingSupplier
                            }
                            className="px-4 py-2.5 text-sm font-medium text-white bg-[#001D4A] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {isPending
                                ? "Registrando lotes..."
                                : "Registrar lotes"}
                        </button>
                    </>
                }
            >
                <div className="space-y-5">
                    {/* PROVEEDOR COMPARTIDO */}
                    <div>
                        <SearchableSelect<SupplierModel>
                            label="Proveedor *"
                            value={form.supplierId}
                            items={suppliers}
                            getOptionValue={(supplier) =>
                                String(supplier.id)
                            }
                            getOptionLabel={(supplier) => supplier.name}
                            placeholder={
                                isLoadingSuppliers
                                    ? "Cargando proveedores..."
                                    : "Seleccione un proveedor"
                            }
                            searchPlaceholder="Buscar proveedor por nombre..."
                            noResultsMessage="No se encontraron proveedores."
                            disabled={isLoadingSuppliers || isPending}
                            onChange={handleSupplierChange}
                            labelActions={
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCreatingSupplier((prev) => !prev);
                                            setNewSupplier({
                                                name: "",
                                                contact: "",
                                                phone: "",
                                                email: "",
                                            });
                                        }}
                                        disabled={
                                            isAddingSupplier ||
                                            isDeletingSupplier ||
                                            isPending
                                        }
                                        className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50"
                                        title="Nuevo proveedor"
                                    >
                                        {isCreatingSupplier ? (
                                            <X className="h-4 w-4" />
                                        ) : (
                                            <Plus className="h-4 w-4" />
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleDeleteSupplier}
                                        disabled={
                                            !form.supplierId ||
                                            isDeletingSupplier ||
                                            isAddingSupplier ||
                                            isPending
                                        }
                                        className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-40"
                                        title="Eliminar proveedor"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            }
                        />

                        {/* FORMULARIO PARA CREAR PROVEEDOR */}
                        {isCreatingSupplier && (
                            <div className="space-y-2 mt-3 p-3 border border-slate-200 rounded-lg">
                                <p className="text-sm font-medium text-slate-700">
                                    Nuevo proveedor
                                </p>

                                <input
                                    type="text"
                                    value={newSupplier.name}
                                    onChange={(e) =>
                                        setNewSupplier((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    placeholder="Nombre del proveedor"
                                    disabled={isAddingSupplier}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                                />

                                <input
                                    type="tel"
                                    value={newSupplier.phone}
                                    onChange={(e) =>
                                        setNewSupplier((prev) => ({
                                            ...prev,
                                            phone: e.target.value,
                                        }))
                                    }
                                    placeholder="Teléfono"
                                    disabled={isAddingSupplier}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                                />

                                <input
                                    type="email"
                                    value={newSupplier.email}
                                    onChange={(e) =>
                                        setNewSupplier((prev) => ({
                                            ...prev,
                                            email: e.target.value,
                                        }))
                                    }
                                    placeholder="Correo electrónico"
                                    disabled={isAddingSupplier}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleCreateSupplier();
                                        }
                                    }}
                                />

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleCreateSupplier}
                                        disabled={
                                            isAddingSupplier ||
                                            !newSupplier.name.trim() ||
                                            !newSupplier.phone.trim() ||
                                            !newSupplier.email.trim()
                                        }
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#001D4A] text-white hover:bg-[#00285f] cursor-pointer disabled:opacity-50"
                                    >
                                        <Check className="h-4 w-4" />
                                        <span className="text-sm">
                                            {isAddingSupplier
                                                ? "Guardando..."
                                                : "Guardar proveedor"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ENCABEZADO */}
                    <div className="flex items-center justify-between gap-3 pt-2">
                        <div>
                            <h3 className="text-base font-semibold text-slate-800">
                                Productos y lotes
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Todos los lotes usarán el proveedor seleccionado.
                            </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                            {lotes.length}{" "}
                            {lotes.length === 1 ? "lote" : "lotes"}
                        </span>
                    </div>

                    {/* FILAS DINÁMICAS */}
                    {lotes.map((lote, index) => {
                        const selectedProduct = products.find(
                            (product) =>
                                String(product.id) === lote.productId
                        );

                        const requiresExpiration = Boolean(
                            Number(selectedProduct?.hasExpiration)
                        );

                        return (
                            <div
                                key={lote.rowId}
                                className="space-y-4 rounded-xl border border-slate-200 bg-white p-4"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-800">
                                            Lote {index + 1}
                                        </h4>
                                        <p className="text-xs text-slate-500">
                                            Identificador: {getLoteNumber(index)}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveLote(lote.rowId)
                                        }
                                        disabled={isPending}
                                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                                        title="Eliminar lote"
                                        aria-label={`Eliminar lote ${index + 1}`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="flex flex-col md:flex-row gap-2 w-full">
                                    {/* IDENTIFICADOR */}
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-slate-700 mb-4">
                                            Identificador
                                        </label>

                                        <input
                                            type="text"
                                            value={getLoteNumber(index)}
                                            readOnly
                                            disabled
                                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-600"
                                        />
                                    </div>

                                    {/* PRODUCTO */}
                                    <div className="flex-1">
                                        <SearchableSelect<ProductModel>
                                            label="Producto *"
                                            value={lote.productId}
                                            items={products}
                                            getOptionValue={(product) =>
                                                String(product.id)
                                            }
                                            getOptionLabel={(product) =>
                                                product.name
                                            }
                                            placeholder={
                                                isLoadingProducts
                                                    ? "Cargando productos..."
                                                    : "Seleccione un producto"
                                            }
                                            searchPlaceholder="Buscar producto por nombre..."
                                            noResultsMessage="No se encontraron productos."
                                            disabled={
                                                isLoadingProducts || isPending
                                            }
                                            onChange={(product) =>
                                                handleLoteProductChange(
                                                    lote.rowId,
                                                    product
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-2 w-full">
                                    {/* CANTIDAD */}
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Cantidad *
                                        </label>

                                        <input
                                            type="number"
                                            min="1"
                                            step="1"
                                            value={
                                                lote.quantity === 0
                                                    ? ""
                                                    : lote.quantity
                                            }
                                            onChange={(e) =>
                                                handleLoteChange(
                                                    lote.rowId,
                                                    "quantity",
                                                    e.target.value === ""
                                                        ? 0
                                                        : Number(e.target.value)
                                                )
                                            }
                                            placeholder="Ingrese la cantidad"
                                            disabled={isPending}
                                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                                        />
                                    </div>

                                    {/* VENCIMIENTO */}
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Fecha de vencimiento
                                            {requiresExpiration ? (
                                                <span className="text-red-500"> *</span>
                                            ) : (
                                                <span className="text-slate-400">
                                                    {" "} (opcional)
                                                </span>
                                            )}
                                        </label>

                                        <input
                                            type="date"
                                            value={lote.dueDate}
                                            onChange={(e) =>
                                                handleLoteChange(
                                                    lote.rowId,
                                                    "dueDate",
                                                    e.target.value
                                                )
                                            }
                                            required={requiresExpiration}
                                            min={new Date()
                                                .toISOString()
                                                .split("T")[0]}
                                            disabled={isPending}
                                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                                        />
                                    </div>
                                </div>

                                {/* OBSERVACIONES */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Observaciones
                                        <span className="text-slate-400">
                                            {" "} (opcional)
                                        </span>
                                    </label>

                                    <textarea
                                        value={lote.observation}
                                        onChange={(e) =>
                                            handleLoteChange(
                                                lote.rowId,
                                                "observation",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Ingrese una descripción"
                                        rows={3}
                                        disabled={isPending}
                                        className="w-full resize-y px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                                    />
                                </div>
                            </div>
                        );
                    })}

                    {/* AGREGAR LOTE */}
                    <button
                        type="button"
                        onClick={handleAddLote}
                        disabled={isPending || isLoadingProducts}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-blue-300 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                    >
                        <Plus className="h-4 w-4" />
                        Agregar otro lote
                    </button>
                </div>
            </GenericDrawer>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title={`¿Estás seguro de eliminar el proveedor "${suppliers.find(
                    (supplier) =>
                        String(supplier.id) === form.supplierId
                )?.name ?? ""
                    }"?`}
                description="Esta acción no se puede deshacer. Si el proveedor está asociado a lotes de inventario, el backend podría impedir su eliminación."
                confirmText={
                    isDeletingSupplier ? "Eliminando..." : "Eliminar"
                }
                cancelText="Cancelar"
                onConfirm={handleDeleteSupplierConfirm}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </>
    );
};

export default CreateInventoryLoteDrawer;
