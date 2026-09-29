import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import { useAddProduct } from "../../hooks/useProducts";
import { useAddCategory, useCategories, useDeleteCategory } from "../../hooks/useCategories";
import { useAddMeasurementUnit, useDeleteMeasurementUnit, useMeasurementUnites } from "../../hooks/useMeasurementUnit";
import { Check, Plus, Trash2, X } from "lucide-react";

interface CreateProductProps {
    isOpen: boolean;
    onHide: () => void;
}

const CreateProductDrawer: React.FC<CreateProductProps> = ({ isOpen, onHide }) => {
    const { mutate: addProduct, isPending } = useAddProduct();
    const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
    const { data: measurementUnites = [], isLoading: isLoadingMeasurementUnites } = useMeasurementUnites();

    const { mutate: addCategory, isPending: isAddingCategory } = useAddCategory();
    const { mutate: deleteCategory, isPending: isDeletingCategory } = useDeleteCategory();
    const {
        mutate: addMeasurementUnit,
        isPending: isAddingMeasurementUnit,
    } = useAddMeasurementUnit();

    const {
        mutate: deleteMeasurementUnit,
        isPending: isDeletingMeasurementUnit,
    } = useDeleteMeasurementUnit();

    const [isCreatingMeasurementUnit, setIsCreatingMeasurementUnit] = useState(false);
    const [newMeasurementUnitName, setNewMeasurementUnitName] = useState("");
    const [newMeasurementUnitAbbreviation, setNewMeasurementUnitAbbreviation] = useState("");

    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

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

    const handleCreateCategory = () => {
        const name = newCategoryName.trim();

        if (!name) {
            showToast("error", "El nombre de la categoría es obligatorio.");
            return;
        }

        addCategory(
            {
                name,
            },
            {
                onSuccess: (category) => {
                    showToast(
                        "success",
                        "La categoría se creó correctamente."
                    );

                    setNewCategoryName("");
                    setIsCreatingCategory(false);

                    // Si el backend devuelve la categoría creada,
                    // la seleccionamos automáticamente.
                    if (category?.id) {
                        setForm((prev) => ({
                            ...prev,
                            category_id: category.id,
                        }));
                    }
                },
                onError: (error) => {
                    showToast(
                        "error",
                        error.message || "No se pudo crear la categoría."
                    );
                },
            }
        );
    };

    const handleDeleteCategory = () => {
        const categoryId = form.category_id;

        if (!categoryId) {
            showToast(
                "error",
                "Debe seleccionar una categoría para eliminar."
            );
            return;
        }

        const selectedCategory = categories.find(
            (category) => String(category.id) === categoryId
        );

        if (!selectedCategory) {
            return;
        }

        const confirmed = window.confirm(
            `¿Está seguro de eliminar la categoría "${selectedCategory.name}"?`
        );

        if (!confirmed) {
            return;
        }

        deleteCategory(categoryId, {
            onSuccess: () => {
                showToast(
                    "success",
                    "La categoría se eliminó correctamente."
                );

                setForm((prev) => ({
                    ...prev,
                    category_id: "",
                }));
            },
            onError: (error) => {
                showToast(
                    "error",
                    error.message || "No se pudo eliminar la categoría."
                );
            },
        });
    };

    const handleCreateMeasurementUnit = () => {
        const name = newMeasurementUnitName.trim();
        const abreviation = newMeasurementUnitAbbreviation.trim();

        if (!name) {
            showToast(
                "error",
                "El nombre de la unidad de medida es obligatorio."
            );
            return;
        }

        if (!abreviation) {
            showToast(
                "error",
                "La abreviación de la unidad de medida es obligatoria."
            );
            return;
        }

        addMeasurementUnit(
            {
                name,
                abreviation,
            },
            {
                onSuccess: (measurementUnit) => {
                    showToast(
                        "success",
                        "La unidad de medida se creó correctamente."
                    );

                    setNewMeasurementUnitName("");
                    setNewMeasurementUnitAbbreviation("");
                    setIsCreatingMeasurementUnit(false);

                    if (measurementUnit?.id) {
                        setForm((prev) => ({
                            ...prev,
                            measurement_unit_id: measurementUnit.id,
                        }));
                    }
                },
                onError: (error) => {
                    showToast(
                        "error",
                        error.message ||
                        "No se pudo crear la unidad de medida."
                    );
                },
            }
        );
    };

    const handleDeleteMeasurementUnit = () => {
        const measurementUnitId = form.measurement_unit_id;

        if (!measurementUnitId) {
            showToast(
                "error",
                "Debe seleccionar una unidad de medida para eliminar."
            );
            return;
        }

        const selectedMeasurementUnit = measurementUnites.find(
            (measurementUnit) =>
                String(measurementUnit.id) === measurementUnitId
        );

        if (!selectedMeasurementUnit) {
            return;
        }

        const confirmed = window.confirm(
            `¿Está seguro de eliminar la unidad de medida "${selectedMeasurementUnit.name}"?`
        );

        if (!confirmed) {
            return;
        }

        deleteMeasurementUnit(measurementUnitId, {
            onSuccess: () => {
                showToast(
                    "success",
                    "La unidad de medida se eliminó correctamente."
                );

                setForm((prev) => ({
                    ...prev,
                    measurement_unit_id: "",
                }));
            },
            onError: (error) => {
                showToast(
                    "error",
                    error.message ||
                    "No se pudo eliminar la unidad de medida."
                );
            },
        });
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

                    {/* <div>
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
                            </option> */}
                    {/* 3. Mapeo dinámico de los categories devueltos por la API */}
                    {/* {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div> */}

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Categoría
                            </label>

                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreatingCategory((prev) => !prev);
                                        setNewCategoryName("");
                                    }}
                                    disabled={isAddingCategory || isDeletingCategory}
                                    className="
                    p-1.5
                    rounded-md
                    text-blue-600
                    hover:bg-blue-50
                    transition-colors
                    cursor-pointer
                    disabled:opacity-50
                "
                                    title="Nueva categoría"
                                >
                                    {isCreatingCategory ? (
                                        <X className="h-4 w-4" />
                                    ) : (
                                        <Plus className="h-4 w-4" />
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDeleteCategory}
                                    disabled={
                                        !form.category_id ||
                                        isDeletingCategory ||
                                        isAddingCategory
                                    }
                                    className="
                    p-1.5
                    rounded-md
                    text-red-600
                    hover:bg-red-50
                    transition-colors
                    cursor-pointer
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                "
                                    title="Eliminar categoría"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {isCreatingCategory && (
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) =>
                                        setNewCategoryName(e.target.value)
                                    }
                                    placeholder="Nombre de la categoría"
                                    disabled={isAddingCategory}
                                    className="
                    flex-1
                    px-3 py-2
                    border border-slate-200
                    rounded-lg
                    text-sm
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/10
                    disabled:bg-slate-50
                "
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleCreateCategory();
                                        }
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={handleCreateCategory}
                                    disabled={
                                        isAddingCategory ||
                                        !newCategoryName.trim()
                                    }
                                    className="
                                        px-3
                                        rounded-lg
                                        bg-[#001D4A]
                                        text-white
                                        hover:bg-[#00285f]
                                        transition-colors
                                        cursor-pointer
                                        disabled:opacity-50
                                        disabled:cursor-not-allowed
                                    "
                                    title="Guardar categoría"
                                >
                                    <Check className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        <select
                            name="category_id"
                            value={form.category_id}
                            onChange={handleChange}
                            disabled={
                                isLoadingCategories ||
                                isAddingCategory ||
                                isDeletingCategory
                            }
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
            disabled:bg-slate-50
            disabled:cursor-not-allowed
        "
                        >
                            <option value="">
                                {isLoadingCategories
                                    ? "Cargando categorías..."
                                    : "Seleccione una categoría"}
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Unidad de medida
                            </label>

                            <div className="flex items-center gap-1">
                                {/* Crear unidad */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreatingMeasurementUnit((prev) => !prev);
                                        setNewMeasurementUnitName("");
                                    }}
                                    disabled={
                                        isAddingMeasurementUnit ||
                                        isDeletingMeasurementUnit
                                    }
                                    className="
                    p-1.5
                    rounded-md
                    text-blue-600
                    hover:bg-blue-50
                    transition-colors
                    cursor-pointer
                    disabled:opacity-50
                "
                                    title="Nueva unidad de medida"
                                >
                                    {isCreatingMeasurementUnit ? (
                                        <X className="h-4 w-4" />
                                    ) : (
                                        <Plus className="h-4 w-4" />
                                    )}
                                </button>

                                {/* Eliminar unidad */}
                                <button
                                    type="button"
                                    onClick={handleDeleteMeasurementUnit}
                                    disabled={
                                        !form.measurement_unit_id ||
                                        isDeletingMeasurementUnit ||
                                        isAddingMeasurementUnit
                                    }
                                    className="
                    p-1.5
                    rounded-md
                    text-red-600
                    hover:bg-red-50
                    transition-colors
                    cursor-pointer
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                "
                                    title="Eliminar unidad de medida"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Crear nueva unidad */}
                        {isCreatingMeasurementUnit && (
                            <div className="space-y-2 mb-2">
                                <input
                                    type="text"
                                    value={newMeasurementUnitName}
                                    onChange={(e) =>
                                        setNewMeasurementUnitName(e.target.value)
                                    }
                                    placeholder="Nombre de la unidad"
                                    disabled={isAddingMeasurementUnit}
                                    className="
                w-full
                px-3 py-2
                border border-slate-200
                rounded-lg
                text-sm
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/10
                disabled:bg-slate-50
            "
                                />

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMeasurementUnitAbbreviation}
                                        onChange={(e) =>
                                            setNewMeasurementUnitAbbreviation(e.target.value)
                                        }
                                        placeholder="Abreviación (ej. kg, und, ml)"
                                        disabled={isAddingMeasurementUnit}
                                        className="
                    flex-1
                    px-3 py-2
                    border border-slate-200
                    rounded-lg
                    text-sm
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/10
                    disabled:bg-slate-50
                "
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleCreateMeasurementUnit();
                                            }
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={handleCreateMeasurementUnit}
                                        disabled={
                                            isAddingMeasurementUnit ||
                                            !newMeasurementUnitName.trim() ||
                                            !newMeasurementUnitAbbreviation.trim()
                                        }
                                        className="
                    px-3
                    rounded-lg
                    bg-[#001D4A]
                    text-white
                    hover:bg-[#00285f]
                    transition-colors
                    cursor-pointer
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                "
                                        title="Guardar unidad de medida"
                                    >
                                        <Check className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Select */}
                        <select
                            name="measurement_unit_id"
                            value={form.measurement_unit_id}
                            onChange={handleChange}
                            disabled={
                                isLoadingMeasurementUnites ||
                                isAddingMeasurementUnit ||
                                isDeletingMeasurementUnit
                            }
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
            disabled:bg-slate-50
            disabled:cursor-not-allowed
        "
                        >
                            <option value="">
                                {isLoadingMeasurementUnites
                                    ? "Cargando unidades de medida..."
                                    : "Seleccione una unidad de medida"}
                            </option>

                            {measurementUnites.map((measurementUnit) => (
                                <option
                                    key={measurementUnit.id}
                                    value={measurementUnit.id}
                                >
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