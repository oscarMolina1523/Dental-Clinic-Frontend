import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import { useProducts } from "../../hooks/useProducts";
import { useInventoryLotes } from "../../hooks/useInventorylotes";
import type InventoryLoteModel from "../../models/InventoryLote";
import { useCreateInventoryLote } from "../../hooks/useInventoryOrchestrator";
import type { CreateInventoryOrchestratorRequest } from "../../models/InventoryOrchestratorModel";

interface CreateInventoryLoteProps {
    isOpen: boolean;
    onHide: () => void;
}

const CreateInventoryLoteDrawer: React.FC<CreateInventoryLoteProps> = ({ isOpen, onHide }) => {
    const { mutate: addLote, isPending } = useCreateInventoryLote();
    const {
        data: inventoryLotes = []
    } = useInventoryLotes();
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
    const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const selectedProduct = products.find((p) => String(p.id) === selectedId);

        setForm((prev) => ({
            ...prev,
            productId: selectedId,
            productName: selectedProduct ? selectedProduct.name : "",
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

    const handleSubmit = () => {
        const productId = form.productId.trim();
        const productName = form.productName.trim();
        const supplierId = form.supplierId.trim();
        const loteNumber = form.loteNumber.trim();
        const quantity = Number(form.quantity);
        const dueDate = form.dueDate ? new Date(form.dueDate) : undefined;
        const entryDate = new Date();
        const userId = "system"; //este siempre sera cero al crear
        const observation = form.observation.trim();

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
                width="w-112.5"
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
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Productos
                        </label>

                        <select
                            name="productId"
                            value={form.productId}
                            onChange={handleProductChange}
                            disabled={isLoadingProducts}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50 disabled:cursor-not-allowed"
                        >
                            <option value="">
                                {isLoadingProducts ? "Cargando productos..." : "Seleccione un producto"}
                            </option>
                            {/* 3. Mapeo dinámico de los products devueltos por la API */}
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Proveedores
                        </label>

                        <input
                            type="text"
                            name="supplierId"
                            value={form.supplierId}
                            onChange={handleChange}
                            placeholder="Ingrese el ID del proveedor"
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
                            Número de Lote
                        </label>

                        <input
                            type="text"
                            name="loteNumber"
                            value={form.loteNumber}
                            onChange={handleChange}
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
                            Cantidad
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
                            Fecha de venciminento (opcional)
                        </label>

                        <input
                            key={isOpen ? "dueDate-open" : "dueDate-closed"}
                            type="date"
                            name="dueDate"
                            value={form.dueDate}
                            onChange={handleChange}
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
        </>
    );
}

export default CreateInventoryLoteDrawer;