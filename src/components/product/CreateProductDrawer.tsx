import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import { useAddProduct } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useMeasurementUnites } from "../../hooks/useMeasurementUnit";

interface CreateProductProps {
    isOpen: boolean;
    onHide: () => void;
}

const CreateProductDrawer: React.FC<CreateProductProps> = ({ isOpen, onHide }) => {
    const { mutate: addProduct, isPending } = useAddProduct();
    const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
    const { data: measurementUnites = [], isLoading: isLoadingMeasurementUnites } = useMeasurementUnites();

    const [form, setForm] = useState({
        name: "",
        barcode: "",
        description: "",
        category_id: "",
        measurement_unit_id: "",
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
            name: "",
            barcode: "",
            description: "",
            category_id: "",
            measurement_unit_id: "",
        });

        onHide();
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        const name = form.name.trim();
        const barcode = form.barcode.trim();
        const description = form.description.trim();
        const category_id = form.category_id.trim();
        const measurement_unit_id = form.measurement_unit_id.trim();

        // Validaciones
        if (!name) {
            showToast(
                "error",
                "El nombre del producto es obligatorio."
            );
            return;
        }

        if (!category_id) {
            showToast(
                "error",
                "La categoria es obligatoria."
            );
            return;
        }

        if (!measurement_unit_id) {
            showToast(
                "error",
                "La unidad de medida es obligatoria."
            );
            return;
        }

        addProduct(
            {
                name,
                barcode,
                description,
                category_id,
                measurement_unit_id
            },
            {
                onSuccess: () => {
                    showToast(
                        "success",
                        "El producto se creó correctamente."
                    );

                    cleanForm();

                },

                onError: (error) => {
                    showToast(
                        "error",
                        error.message ||
                        "No se pudo crear el producto."
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
                title="Nuevo Producto"
                description="Registra un nuevo producto"
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
                                : "Crear Producto"}
                        </button>
                    </>
                }
            >
                {/* BODY DEL CREATE */}
                <div className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nombre
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Ingrese el nombre completo"
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
                            Codigo de barra
                        </label>

                        <input
                            type="text"
                            name="barcode"
                            value={form.barcode}
                            onChange={handleChange}
                            placeholder="123456789"
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
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Ingrese una descripción"
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
                            value={form.category_id}
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
                            value={form.measurement_unit_id}
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
}

export default CreateProductDrawer;