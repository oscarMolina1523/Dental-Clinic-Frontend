import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import type ProductModel from "../../models/ProductModel";
import { useUpdateProduct } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useMeasurementUnites } from "../../hooks/useMeasurementUnit";

interface EditProductDrawerProps {
    isOpen: boolean;
    onHide: () => void;
    product: ProductModel | null;
}

const EditProductDrawer: React.FC<EditProductDrawerProps> = ({
    isOpen,
    onHide,
    product,
}) => {
    const {
        mutate: updateProduct,
        isPending: isLoadingProducts,
    } = useUpdateProduct();

    const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
    const { data: measurementUnites = [], isLoading: isLoadingMeasurementUnites } = useMeasurementUnites();


    const [prevProduct, setPrevProduct] = useState<ProductModel | null>(product);
    const [form, setForm] = useState<ProductModel | null>(product);

    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    if (product !== prevProduct) {
        setPrevProduct(product);
        setForm(product);
    }

    const showToast = (
        type: "success" | "error",
        message: string
    ) => {
        setToast({
            type,
            message,
        });
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setForm((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [name]: value,
            };
        });
    };



    const handleSubmit = () => {
        if (!product || !form) {
            return;
        }

        if (!form.name.trim()) {
            showToast(
                "error",
                "El nombre es obligatorio."
            );
            return;
        }

        if (!form.category_id.trim()) {
            showToast(
                "error",
                "La categoria es obligatoria."
            );
            return;
        }

        if (!form.measurement_unit_id.trim()) {
            showToast(
                "error",
                "La unidad de medida es obligatoria."
            );
            return;
        }

        updateProduct(
            {
                id: product.id,
                product: {
                    name: form.name.trim(),
                    barcode: form.barcode,
                    description: form.description,
                    category_id: form.category_id,
                    measurement_unit_id: form.measurement_unit_id
                }
            },
            {
                onSuccess: () => {
                    showToast(
                        "success",
                        "El producto se actualizó correctamente."
                    );

                    onHide();
                },

                onError: (error) => {
                    showToast(
                        "error",
                        error.message ||
                        "No se pudo actualizar el producto."
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
                title="Editar Producto"
                description="Modifica la información del producto"
                width="w-112.5"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={onHide}
                            disabled={isLoadingProducts}
                            className="
                                px-4 py-2.5
                                text-sm font-medium
                                text-slate-600
                                hover:bg-slate-100
                                rounded-lg
                                cursor-pointer
                                disabled:opacity-50
                            "
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoadingProducts}
                            className="
                                px-4 py-2.5
                                text-sm font-medium
                                text-white
                                bg-[#001D4A]
                                rounded-lg
                                cursor-pointer
                                disabled:opacity-50
                            "
                        >
                            {isLoadingProducts
                                ? "Guardando..."
                                : "Guardar Cambios"}
                        </button>
                    </>
                }
            >
                {/* TODO EL BODY ES EXCLUSIVO DE EDITAR */}

                <div className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nombre
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form?.name || ""}
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
                            Código de barra
                        </label>

                        <input
                            type="text"
                            name="barcode"
                            value={form?.barcode || ""}
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
                            Descripción
                        </label>

                        <input
                            type="text"
                            name="description"
                            value={form?.description || ""}
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
                            Categoria
                        </label>

                        <select
                            name="category_id"
                            value={form?.category_id || ""}
                            onChange={handleChange}
                            disabled={isLoadingCategories}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50 disabled:cursor-not-allowed"
                        >
                            <option value="">
                                {isLoadingCategories ? "Cargando categorias..." : "Seleccione una categoria"}
                            </option>
                            {/* 3. Mapeo dinámico de los categories devueltos por la API */}
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Unidad de medida
                        </label>
                        <select
                            name="measurement_unit_id"
                            value={form?.measurement_unit_id || ""}
                            onChange={handleChange}
                            disabled={isLoadingMeasurementUnites}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50 disabled:cursor-not-allowed"
                        >
                            <option value="">
                                {isLoadingMeasurementUnites ? "Cargando unidades de medida..." : "Seleccione una Unidad de medida"}
                            </option>
                            {/* 3. Mapeo dinámico de los unidades de medidas devueltos por la API */}
                            {measurementUnites.map((measurementUnit) => (
                                <option key={measurementUnit.id} value={measurementUnit.id}>
                                    {measurementUnit.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </GenericDrawer>
        </>
    );
};

export default EditProductDrawer;