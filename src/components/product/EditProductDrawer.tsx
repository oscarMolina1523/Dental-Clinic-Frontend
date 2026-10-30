import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import type ProductModel from "../../models/ProductModel";
import { useUpdateProduct } from "../../hooks/useProducts";
import { useAddCategory, useCategories, useDeleteCategory } from "../../hooks/useCategories";
import { useAddMeasurementUnit, useDeleteMeasurementUnit, useMeasurementUnites } from "../../hooks/useMeasurementUnit";
import SearchableSelect from "../../shared/searchableSelect/SearchableSelect";
import type CategoryModel from "../../models/CategoryModel";
import type MeasurementUnitModel from "../../models/MeasurementUnitModel";
import { Check, Plus, Trash2, X } from "lucide-react";
import ConfirmModal from "../../shared/ConfirmModal";

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

    const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
    const { data: measurementUnites = [], isLoading: isLoadingMeasurementUnites } = useMeasurementUnites();
    const [hasExpiration, setHasExpiration] = useState(
        Boolean(Number(product?.hasExpiration))
    );

    const [prevProduct, setPrevProduct] = useState<ProductModel | null>(product);
    const [form, setForm] = useState<ProductModel | null>(product);

    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const [isCreatingMeasurementUnit, setIsCreatingMeasurementUnit] = useState(false);
    const [newMeasurementUnitName, setNewMeasurementUnitName] = useState("");
    const [newMeasurementUnitAbbreviation, setNewMeasurementUnitAbbreviation] = useState("");

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [deleteType, setDeleteType] = useState<
        "category" | "measurementUnit" | null
    >(null);

    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    if (product !== prevProduct) {
        setPrevProduct(product);
        setForm(product);
        setHasExpiration(Boolean(Number(product?.hasExpiration)));
    }

    const handleCreateCategory = () => {
        const name = newCategoryName.trim();

        if (!name) {
            showToast("error", "El nombre de la categoría es obligatorio.");
            return;
        }

        addCategory(
            { name },
            {
                onSuccess: (category) => {
                    showToast("success", "La categoría se creó correctamente.");

                    setNewCategoryName("");
                    setIsCreatingCategory(false);

                    if (category?.id) {
                        setForm((prev) => {
                            if (!prev) return prev;

                            return {
                                ...prev,
                                category_id: String(category.id),
                            };
                        });
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

    const handleCreateMeasurementUnit = () => {
        const name = newMeasurementUnitName.trim();
        const abreviation = newMeasurementUnitAbbreviation.trim();

        if (!name) {
            showToast("error", "El nombre de la unidad de medida es obligatorio.");
            return;
        }

        if (!abreviation) {
            showToast("error", "La abreviación de la unidad de medida es obligatoria.");
            return;
        }

        addMeasurementUnit(
            { name, abreviation },
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
                        setForm((prev) => {
                            if (!prev) return prev;

                            return {
                                ...prev,
                                measurement_unit_id: String(measurementUnit.id),
                            };
                        });
                    }
                },
                onError: (error) => {
                    showToast(
                        "error",
                        error.message || "No se pudo crear la unidad de medida."
                    );
                },
            }
        );
    };

    const handleDeleteCategory = () => {
        if (!form?.category_id) {
            showToast("error", "Debe seleccionar una categoría para eliminar.");
            return;
        }

        const selectedCategory = categories.find(
            (category) => String(category.id) === String(form.category_id)
        );

        if (!selectedCategory) return;

        setDeleteType("category");
        setIsDeleteModalOpen(true);
    };

    const handleDeleteMeasurementUnit = () => {
        if (!form?.measurement_unit_id) {
            showToast("error", "Debe seleccionar una unidad de medida para eliminar.");
            return;
        }

        const selectedMeasurementUnit = measurementUnites.find(
            (unit) => String(unit.id) === String(form.measurement_unit_id)
        );

        if (!selectedMeasurementUnit) return;

        setDeleteType("measurementUnit");
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!deleteType || !form) return;

        if (deleteType === "category") {
            const categoryId = form.category_id;

            if (!categoryId) return;

            deleteCategory(categoryId, {
                onSuccess: () => {
                    showToast("success", "La categoría se eliminó correctamente.");

                    setForm((prev) => {
                        if (!prev) return prev;

                        return {
                            ...prev,
                            category_id: "",
                        };
                    });

                    setIsDeleteModalOpen(false);
                    setDeleteType(null);
                },
                onError: (error) => {
                    showToast(
                        "error",
                        error.message || "No se pudo eliminar la categoría."
                    );

                    setIsDeleteModalOpen(false);
                    setDeleteType(null);
                },
            });

            return;
        }

        if (deleteType === "measurementUnit") {
            const measurementUnitId = form.measurement_unit_id;

            if (!measurementUnitId) return;

            deleteMeasurementUnit(measurementUnitId, {
                onSuccess: () => {
                    showToast(
                        "success",
                        "La unidad de medida se eliminó correctamente."
                    );

                    setForm((prev) => {
                        if (!prev) return prev;

                        return {
                            ...prev,
                            measurement_unit_id: "",
                        };
                    });

                    setIsDeleteModalOpen(false);
                    setDeleteType(null);
                },
                onError: (error) => {
                    showToast(
                        "error",
                        error.message || "No se pudo eliminar la unidad de medida."
                    );

                    setIsDeleteModalOpen(false);
                    setDeleteType(null);
                },
            });
        }
    };

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

    const handleHasExpirationChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const checked = e.target.checked;

        setHasExpiration(checked);
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
                    measurement_unit_id: form.measurement_unit_id,
                    hasExpiration: hasExpiration
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
                width="w-80 md:w-200"
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
                    <div className="flex flex-col md:flex-row gap-2 w-full">
                        {/* nombre del producto */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nombre *
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
                        {/* codigo de barra */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Código de barra (opcional)
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
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={hasExpiration}
                            onChange={handleHasExpirationChange}
                            className="
                                    h-4
                                    w-4
                                    rounded
                                    border-slate-300
                                    text-blue-600
                                    focus:ring-blue-500
                                    cursor-pointer
                                "
                        />

                        <span className="text-sm font-medium text-slate-700">
                            ¿Tiene fecha de caducidad?
                        </span>
                    </label>

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
                        <SearchableSelect<CategoryModel>
                            label="Categorías *"
                            value={form?.category_id || ""}
                            items={categories}
                            getOptionValue={(category) => category.id}
                            getOptionLabel={(category) => category.name}
                            placeholder={
                                isLoadingCategories
                                    ? "Cargando categorías..."
                                    : "Seleccione una categoría"
                            }
                            searchPlaceholder="Buscar categoría por nombre..."
                            noResultsMessage="No se encontraron categorías."
                            disabled={isLoadingCategories}
                            onChange={(category) => {
                                setForm((prev) => {
                                    if (!prev) return prev;

                                    return {
                                        ...prev,
                                        category_id: String(category.id),
                                    };
                                });
                            }}
                            labelActions={
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCreatingCategory((prev) => !prev);
                                            setNewCategoryName("");
                                        }}
                                        disabled={isAddingCategory || isDeletingCategory}
                                        className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50"
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
                                            !form?.category_id ||
                                            isDeletingCategory ||
                                            isAddingCategory
                                        }
                                        className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                        title="Eliminar categoría"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            }
                        />

                        {isCreatingCategory && (
                            <div className="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Nombre de la nueva categoría"
                                    disabled={isAddingCategory}
                                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50"
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
                                    disabled={isAddingCategory || !newCategoryName.trim()}
                                    className="px-3 rounded-lg bg-[#001D4A] text-white hover:bg-[#00285f] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Guardar categoría"
                                >
                                    <Check className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <SearchableSelect<MeasurementUnitModel>
                            label="Unidades de Medida *"
                            value={form?.measurement_unit_id || ""}
                            items={measurementUnites}
                            getOptionValue={(unit) => unit.id}
                            getOptionLabel={(unit) =>
                                `${unit.name} - ${unit.abreviation}`
                            }
                            placeholder={
                                isLoadingMeasurementUnites
                                    ? "Cargando unidades de medida..."
                                    : "Seleccione una unidad de medida"
                            }
                            searchPlaceholder="Buscar unidad de medida por nombre..."
                            noResultsMessage="No se encontraron unidades de medida."
                            disabled={isLoadingMeasurementUnites}
                            onChange={(unit) => {
                                setForm((prev) => {
                                    if (!prev) return prev;

                                    return {
                                        ...prev,
                                        measurement_unit_id: String(unit.id),
                                    };
                                });
                            }}
                            labelActions={
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCreatingMeasurementUnit((prev) => !prev);
                                            setNewMeasurementUnitName("");
                                            setNewMeasurementUnitAbbreviation("");
                                        }}
                                        disabled={
                                            isAddingMeasurementUnit ||
                                            isDeletingMeasurementUnit
                                        }
                                        className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50"
                                        title="Nueva unidad de medida"
                                    >
                                        {isCreatingMeasurementUnit ? (
                                            <X className="h-4 w-4" />
                                        ) : (
                                            <Plus className="h-4 w-4" />
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleDeleteMeasurementUnit}
                                        disabled={
                                            !form?.measurement_unit_id ||
                                            isDeletingMeasurementUnit ||
                                            isAddingMeasurementUnit
                                        }
                                        className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                        title="Eliminar unidad de medida"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            }
                        />

                        {isCreatingMeasurementUnit && (
                            <div className="space-y-2 mt-2">
                                <input
                                    type="text"
                                    value={newMeasurementUnitName}
                                    onChange={(e) => setNewMeasurementUnitName(e.target.value)}
                                    placeholder="Nombre de la unidad"
                                    disabled={isAddingMeasurementUnit}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50"
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
                                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50"
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
                                        className="px-3 rounded-lg bg-[#001D4A] text-white hover:bg-[#00285f] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Guardar unidad de medida"
                                    >
                                        <Check className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <ConfirmModal
                    isOpen={isDeleteModalOpen}
                    title={
                        deleteType === "category"
                            ? `¿Estás seguro de eliminar la categoría "${categories.find(
                                (category) =>
                                    String(category.id) === String(form?.category_id)
                            )?.name ?? ""
                            }"?`
                            : `¿Estás seguro de eliminar la unidad de medida "${measurementUnites.find(
                                (unit) =>
                                    String(unit.id) === String(form?.measurement_unit_id)
                            )?.name ?? ""
                            }"?`
                    }
                    description="Esta acción no se puede deshacer. Los datos asociados se perderán permanentemente."
                    confirmText={
                        deleteType === "category"
                            ? isDeletingCategory
                                ? "Eliminando..."
                                : "Eliminar"
                            : isDeletingMeasurementUnit
                                ? "Eliminando..."
                                : "Eliminar"
                    }
                    cancelText="Cancelar"
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => {
                        setIsDeleteModalOpen(false);
                        setDeleteType(null);
                    }}
                />
            </GenericDrawer>
        </>
    );
};

export default EditProductDrawer;