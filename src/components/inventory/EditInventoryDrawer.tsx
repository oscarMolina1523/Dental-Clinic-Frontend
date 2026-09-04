import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import type InventoryModel from "../../models/InventoryModel";
import { useUpdateInventory } from "../../hooks/useInventory";
import type { UpdateInventoryDTO } from "../../models/InventoryModel";

interface EditInventoryDrawerProps {
    isOpen: boolean;
    onHide: () => void;
    inventory: InventoryModel | null;
}

const EditInventoryDrawer: React.FC<EditInventoryDrawerProps> = ({
    isOpen,
    onHide,
    inventory,
}) => {
    const {
        mutate: updateInventory,
        isPending: isLoadingInventories,
    } = useUpdateInventory();


    const [prevInventory, setPrevInventory] = useState<InventoryModel | null>(inventory);
    const [form, setForm] = useState<UpdateInventoryDTO | null>(inventory);

    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    if (inventory !== prevInventory) {
        setPrevInventory(inventory);
        setForm(inventory);
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
        if (!inventory || !form) {
            return;
        }

        if (!form.minimumStock || form.minimumStock < 0) {
            showToast(
                "error",
                "El stock mínimo es obligatorio y debe ser un número positivo."
            );
            return;
        }

        updateInventory(
            {
                id: inventory.id,
                inventory: {
                    minimumStock: form.minimumStock,
                }
            },
            {
                onSuccess: () => {
                    showToast(
                        "success",
                        "El inventario se actualizó correctamente."
                    );

                    onHide();
                },

                onError: (error) => {
                    showToast(
                        "error",
                        error.message ||
                        "No se pudo actualizar el inventario."
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
                title="Editar Inventario"
                description="Modifica la información del inventario"
                width="w-112.5"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={onHide}
                            disabled={isLoadingInventories}
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
                            disabled={isLoadingInventories}
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
                            {isLoadingInventories
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
                            Cantidad Minima
                        </label>

                        <input
                            type="number"
                            name="minimumStock"
                            value={form?.minimumStock || ""}
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
            </GenericDrawer>
        </>
    );
};

export default EditInventoryDrawer;