import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import { useAddInventory, useInventories } from "../../hooks/useInventory";
import { useProducts } from "../../hooks/useProducts";
import type InventoryModel from "../../models/InventoryModel";
import SearchableSelect from "../../shared/searchableSelect/SearchableSelect";
import type ProductModel from "../../models/ProductModel";

interface CreateInventoryProps {
    isOpen: boolean;
    onHide: () => void;
}

const CreateInventoryDrawer: React.FC<CreateInventoryProps> = ({ isOpen, onHide }) => {
    const { mutate: addInventory, isPending } = useAddInventory();
    const { data: inventories = [] } = useInventories();
    const {
        data: products = [],
        isLoading: isLoadingProducts
    } = useProducts(1, 10);

    const [form, setForm] = useState({
        productId: "",
        productName: "",
        currentStock: 0,
        minimumStock: 0
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
            currentStock: 0,
            minimumStock: 0
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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
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
        const currentStock = form.currentStock; //este siempre sera cero al crear
        const minimumStock = form.minimumStock; //este siempre sera cero al crear

        // Validaciones
        if (!productName) {
            showToast(
                "error",
                "Debe seleccionar un producto."
            );
            return;
        }

        const existsInInventory = inventories.some(
            (item: InventoryModel) => String(item.productId) === productId
        );

        if (existsInInventory) {
            showToast(
                "error",
                "Este producto ya cuenta con un registro en el inventario."
            );
            return;
        }

        addInventory(
            {
                productId,
                productName,
                currentStock,
                minimumStock
            },
            {
                onSuccess: () => {
                    showToast(
                        "success",
                        "El inventario se creó correctamente."
                    );

                    cleanForm();

                },

                onError: (error) => {
                    showToast(
                        "error",
                        error.message ||
                        "No se pudo crear el inventario."
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
                title="Nuevo Inventario"
                description="Registra un nuevo inventario para un producto"
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
                                : "Crear Inventario"}
                        </button>
                    </>
                }
            >
                {/* BODY DEL CREATE */}
                <div className="space-y-5">
                    <div>
                        <SearchableSelect<ProductModel>
                            label="Productos"
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

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Cantidad minima de stock
                        </label>

                        <input
                            type="number"
                            name="minimumStock"
                            value={form.minimumStock}
                            onChange={handleChange}
                            placeholder="Ingrese la cantidad mínima de stock"
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
                </div>
            </GenericDrawer>
        </>
    );
}

export default CreateInventoryDrawer;