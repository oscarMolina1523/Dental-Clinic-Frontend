import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import { useProducts } from "../../hooks/useProducts";
import { useInventoryLotes } from "../../hooks/useInventorylotes";
import type InventoryLoteModel from "../../models/InventoryLote";
import { useCreateInventoryLote } from "../../hooks/useInventoryOrchestrator";
import type { CreateInventoryOrchestratorRequest } from "../../models/InventoryOrchestratorModel";
import { useAddSupplier, useDeleteSupplier, useSuppliers } from "../../hooks/useSupplier";
import type ProductModel from "../../models/ProductModel";
import SearchableSelect from "../../shared/searchableSelect/SearchableSelect";
import type SupplierModel from "../../models/SupplierModel";
import type { SupplierDTO } from "../../models/SupplierModel";
import { Check, Plus, Trash2, X } from "lucide-react";
import ConfirmModal from "../../shared/ConfirmModal";
import { generateLoteNumber } from "../../utils/generateLoteNumber";

interface CreateInventoryLoteProps {
    isOpen: boolean;
    onHide: () => void;
}

const CreateInventoryLoteDrawer: React.FC<CreateInventoryLoteProps> = ({ isOpen, onHide }) => {
    const {
        mutate: addSupplier,
        isPending: isAddingSupplier,
    } = useAddSupplier();

    const {
        mutate: deleteSupplier,
        isPending: isDeletingSupplier,
    } = useDeleteSupplier();

    const [isCreatingSupplier, setIsCreatingSupplier] = useState(false);

    const [newSupplier, setNewSupplier] = useState<SupplierDTO>({
        name: "",
        contact: "",
        phone: "",
        email: "",
    });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { mutate: addLote, isPending } = useCreateInventoryLote();
    const {
        data: inventoryLotes = []
    } = useInventoryLotes();
    const {
        data: suppliers = [],
        isLoading: isLoadingSuppliers
    } = useSuppliers();
    const {
        data: products = [],
        isLoading: isLoadingProducts
    } = useProducts(1, 10);

    const [form, setForm] = useState({
        productId: "",
        productName: "",
        supplierId: "",
        loteNumber: "",
        quantity: 0,
        dueDate: "",
        observation: ""
    });

    const selectedProduct = products.find(
        (product) => String(product.id) === form.productId
    );

    const requiresExpiration = Boolean(
        Number(selectedProduct?.hasExpiration)
    );

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

    const cleanForm = () => {
        setForm({
            productId: "",
            productName: "",
            supplierId: "",
            loteNumber: "",
            quantity: 0,
            dueDate: "",
            observation: ""
        });

        onHide();
    };

    //esta funcion es especificamente para meter el product id y el product name
    const handleProductChange = (selectedProduct: ProductModel) => {
        const selectedId = String(selectedProduct.id);

        setForm((prev) => ({
            ...prev,
            productId: selectedId,
            productName: selectedProduct ? selectedProduct.name : "",
        }));
    };

    const handleSupplierChange = (selectedSupplier: SupplierModel) => {
        const selectedId = String(selectedSupplier.id);

        setForm((prev) => ({
            ...prev,
            supplierId: selectedId,
        }));
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreateSupplier = () => {
        const supplierData: SupplierDTO = {
            name: newSupplier.name.trim(),
            contact: newSupplier.email.trim(),
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
                showToast(
                    "success",
                    "El proveedor se creó correctamente."
                );

                setNewSupplier({
                    name: "",
                    contact: "",
                    phone: "",
                    email: "",
                });

                setIsCreatingSupplier(false);

                // Seleccionar automáticamente el proveedor creado.
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

    const handleDeleteSupplier = () => {
        if (!form.supplierId) {
            showToast(
                "error",
                "Debe seleccionar un proveedor para eliminar."
            );
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

    const handleDeleteSupplierConfirm = () => {
        const supplierId = form.supplierId;

        if (!supplierId) return;

        deleteSupplier(supplierId, {
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

    const handleSubmit = () => {
        const productId = form.productId.trim();
        const productName = form.productName.trim();
        const supplierId = form.supplierId.trim();
        const loteNumber = generateLoteNumber(inventoryLotes);
        const quantity = Number(form.quantity);
        const dueDate = form.dueDate ? new Date(form.dueDate) : undefined;
        const entryDate = new Date();
        const userId = "system"; //este siempre sera cero al crear
        const observation = form.observation.trim();

        if (requiresExpiration && !form.dueDate) {
            showToast(
                "error",
                "La fecha de vencimiento es obligatoria para este producto."
            );
            return;
        }

        // Validaciones
        if (!productName) {
            showToast(
                "error",
                "Debe seleccionar un producto."
            );
            return;
        }

        if (!supplierId) {
            showToast(
                "error",
                "Debe seleccionar un proveedor."
            );
            return;
        }

        if (!loteNumber) {
            showToast(
                "error",
                "Debe ingresar un número de lote."
            );
            return;
        }

        if (!quantity || quantity <= 0) {
            showToast(
                "error",
                "Debe ingresar una cantidad válida."
            );
            return;
        }

        const existsInLote = inventoryLotes.some(
            (item: InventoryLoteModel) => String(item.loteNumber) === loteNumber
        );

        if (existsInLote) {
            showToast(
                "error",
                "Este lote ya existe en el inventario."
            );
            return;
        }

        const data: CreateInventoryOrchestratorRequest = { productId, productName, supplierId, loteNumber, quantity, entryDate, userId, observation };
        // SOLO agregamos dueDate si el usuario seleccionó una fecha 
        if (form.dueDate) { data.dueDate = dueDate; }

        addLote(
            data,
            {
                onSuccess: () => {
                    showToast(
                        "success",
                        "El lote se creó correctamente."
                    );

                    cleanForm();

                },

                onError: (error) => {
                    showToast(
                        "error",
                        error.message ||
                        "No se pudo crear el lote."
                    );
                },
            }
        );
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
                    fixed inset-0 z-40
                    bg-black/30
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
                description="Registra un nuevo lote de inventario"
                width="w-80 md:w-112.5"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={onHide}
                            disabled={isPending}
                            className="
                                px-4 py-2.5
                                text-sm font-medium
                                text-slate-600
                                hover:bg-slate-100
                                rounded-lg
                                transition-colors
                                cursor-pointer
                                disabled:opacity-50
                            "
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isPending}
                            className="
                                px-4 py-2.5
                                text-sm font-medium
                                text-white
                                bg-[#001D4A]
                                rounded-lg
                                transition-colors
                                cursor-pointer
                                disabled:opacity-50
                            "
                        >
                            {isPending
                                ? "Creando..."
                                : "Crear Lote"}
                        </button>
                    </>
                }
            >
                {/* BODY DEL CREATE */}
                <div className="space-y-5">
                    <div>
                        <SearchableSelect<ProductModel>
                            label="Productos *"
                            value={form.productId}
                            items={products}
                            getOptionValue={(product) => product.id}
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
                            disabled={isLoadingProducts}
                            onChange={handleProductChange} />
                    </div>

                    {/* <div>
                        <SearchableSelect<SupplierModel>
                            label="Proveedores"
                            value={form.supplierId}
                            items={suppliers}
                            getOptionValue={(supplier) => supplier.id}
                            getOptionLabel={(supplier) =>
                                supplier.name
                            }
                            placeholder={
                                isLoadingSuppliers
                                    ? "Cargando proveedores..."
                                    : "Seleccione un proveedor"
                            }
                            searchPlaceholder="Buscar proveedor por nombre..."
                            noResultsMessage="No se encontraron proveedores."
                            disabled={isLoadingSuppliers}
                            onChange={handleSupplierChange} />
                    </div> */}

                    <div>
                        <SearchableSelect<SupplierModel>
                            label="Proveedores *"
                            value={form.supplierId}
                            items={suppliers}
                            getOptionValue={(supplier) => String(supplier.id)}
                            getOptionLabel={(supplier) => supplier.name}
                            placeholder={
                                isLoadingSuppliers
                                    ? "Cargando proveedores..."
                                    : "Seleccione un proveedor"
                            }
                            searchPlaceholder="Buscar proveedor por nombre..."
                            noResultsMessage="No se encontraron proveedores."
                            disabled={isLoadingSuppliers}
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
                                        disabled={isAddingSupplier || isDeletingSupplier}
                                        className="
                        p-1.5 rounded-md text-blue-600
                        hover:bg-blue-50 transition-colors
                        cursor-pointer disabled:opacity-50
                    "
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
                                            isAddingSupplier
                                        }
                                        className="
                        p-1.5 rounded-md text-red-600
                        hover:bg-red-50 transition-colors
                        cursor-pointer disabled:opacity-40
                        disabled:cursor-not-allowed
                    "
                                        title="Eliminar proveedor"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            }
                        />

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
                                    className="
                    w-full px-3 py-2 border border-slate-200
                    rounded-lg text-sm outline-none
                    focus:border-blue-500 focus:ring-2
                    focus:ring-blue-500/10 disabled:bg-slate-50
                "
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
                                    className="
                                        w-full px-3 py-2 border border-slate-200
                                        rounded-lg text-sm outline-none
                                        focus:border-blue-500 focus:ring-2
                                        focus:ring-blue-500/10 disabled:bg-slate-50
                                    "
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
                                    className="
                                        w-full px-3 py-2 border border-slate-200
                                        rounded-lg text-sm outline-none
                                        focus:border-blue-500 focus:ring-2
                                        focus:ring-blue-500/10 disabled:bg-slate-50
                                    "
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
                                        className="
                                            flex items-center gap-2 px-3 py-2
                                            rounded-lg bg-[#001D4A] text-white
                                            hover:bg-[#00285f] transition-colors
                                            cursor-pointer disabled:opacity-50
                                            disabled:cursor-not-allowed
                                        "
                                        title="Guardar proveedor"
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

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Número de Lote
                        </label>

                        <input
                            type="text"
                            name="loteNumber"
                            readOnly
                            disabled
                            value={generateLoteNumber(inventoryLotes)}
                            // onChange={handleChange}
                            placeholder="Ingrese el número de lote"
                            className="
                                w-full
                                px-3 py-2.5
                                border border-slate-200
                                rounded-lg
                                text-sm
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/10
                            "
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Cantidad *
                        </label>

                        <input
                            type="text"
                            name="quantity"
                            value={form.quantity}
                            onChange={handleChange}
                            placeholder="Ingrese la cantidad"
                            className="
                                w-full
                                px-3 py-2.5
                                border border-slate-200
                                rounded-lg
                                text-sm
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/10
                            "
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Fecha de venciminento
                            {requiresExpiration ? (
                                <span className="text-red-500"> *</span>
                            ) : (
                                <span className="text-slate-400"> (opcional)</span>
                            )}
                        </label>

                        <input
                            key={isOpen ? "dueDate-open" : "dueDate-closed"}
                            type="date"
                            name="dueDate"
                            value={form.dueDate}
                            onChange={handleChange}
                            required={requiresExpiration}
                            min={new Date().toISOString().split("T")[0]} // Fecha mínima de vencimiento es hoy
                            className="
                                w-full
                                px-3 py-2.5
                                border border-slate-200
                                rounded-lg
                                text-sm
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/10
                            "
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Observaciones (opcional)
                        </label>

                        <textarea
                            name="observation"
                            value={form.observation}
                            onChange={handleChange}
                            placeholder="Ingrese una descripción"
                            className="
                                w-full
                                min-h-50
                                px-3 py-2.5
                                border border-slate-200
                                rounded-lg
                                text-sm
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/10
                            "
                        />
                    </div>
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
}

export default CreateInventoryLoteDrawer;