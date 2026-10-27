import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import type InventoryLoteModel from "../../models/InventoryLote";
import type { UpdateAmountInventoryOrchestratorRequest } from "../../models/InventoryOrchestratorModel";
import { useDecreaseInventoryLoteStock } from "../../hooks/useInventoryOrchestrator";

interface EditInventoryLoteDrawerProps {
    isOpen: boolean;
    onHide: () => void;
    lote: InventoryLoteModel | null;
}

const EditInventoryLoteDrawer: React.FC<EditInventoryLoteDrawerProps> = ({
    isOpen,
    onHide,
    lote,
}) => {
    const {
        mutateAsync: decreaseInventoryLote,
        isPending: isLoadingDecrease,
    } = useDecreaseInventoryLoteStock();

    const isPending = isLoadingDecrease;

    const [prevInventory, setPrevInventory] = useState<InventoryLoteModel | null>(lote);
    const [form, setForm] = useState<UpdateAmountInventoryOrchestratorRequest | null>();

    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    if (lote !== prevInventory) {
        setPrevInventory(lote);
        setForm({ quantity: lote?.quantity || 0, userId: "system", observation: "" });
    }

    const currentQuantity = Number(lote?.quantity ?? 0);
    const quantityToDecrease = Number(form?.quantity ?? 0);

    const remainingQuantity = currentQuantity - quantityToDecrease;

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
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
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

    const handleSubmit = async () => {
        if (!lote || !form) {
            return;
        }

        const quantityToDecrease = Number(form.quantity);
        const currentQuantity = Number(lote.quantity);

        if (!Number.isFinite(quantityToDecrease) || quantityToDecrease <= 0) {
            showToast(
                "error",
                "La cantidad a disminuir debe ser mayor que cero."
            );
            return;
        }

        if (quantityToDecrease > currentQuantity) {
            showToast(
                "error",
                "La cantidad a disminuir no puede superar el inventario actual."
            );
            return;
        }

        try {
            await decreaseInventoryLote({
                id: lote.id,
                data: {
                    quantity: quantityToDecrease,
                    userId: form.userId,
                    observation: form.observation,
                },
            });

            showToast(
                "success",
                "Inventario disminuido correctamente."
            );

            onHide();
        } catch {
            showToast(
                "error",
                "Ocurrió un error al actualizar el inventario."
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
                title="Editar Lote de Inventario"
                description="Modifica la información del inventario"
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
                                cursor-pointer
                                disabled:opacity-50
                            "
                        >
                            {isPending
                                ? "Guardando..."
                                : "Guardar Cambios"}
                        </button>
                    </>
                }
            >
                {/* TODO EL BODY ES EXCLUSIVO DE EDITAR */}
                <div className="space-y-4">
                    {/* Cantidad actual */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Cantidad actual del lote
                        </label>

                        <input
                            type="number"
                            value={currentQuantity}
                            readOnly
                            className="
                w-full px-3 py-2.5
                border border-slate-200 rounded-lg
                text-sm outline-none
                bg-slate-100 text-slate-600
                cursor-not-allowed
            "
                        />

                        <p className="mt-1 text-xs text-slate-500">
                            Unidades disponibles antes de la operación.
                        </p>
                    </div>

                    {/* Cantidad a disminuir */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Cantidad a disminuir
                            <span className="text-red-500"> *</span>
                        </label>

                        <input
                            type="number"
                            name="quantity"
                            min="1"
                            max={currentQuantity}
                            step="1"
                            value={form?.quantity ?? 0}
                            onChange={handleChange}
                            placeholder="Ingrese las unidades a retirar"
                            className="
                                w-full px-3 py-2.5
                                border border-slate-200 rounded-lg
                                text-sm outline-none
                                focus:border-blue-500
                                focus:ring-2 focus:ring-blue-500/10
                            "
                        />

                        <p className="mt-1 text-xs text-slate-500">
                            Indique cuántas unidades desea retirar del lote.
                        </p>
                    </div>

                    {/* Cantidad restante */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Cantidad restante después de disminuir
                        </label>

                        <input
                            type="number"
                            value={remainingQuantity}
                            readOnly
                            className={`
                                    w-full px-3 py-2.5
                                    border border-slate-200 rounded-lg
                                    text-sm outline-none
                                    bg-slate-100
                                    ${remainingQuantity < 0
                                    ? "text-red-600"
                                    : "text-slate-700"
                                }
                            `}
                        />
                    </div>
                </div>


                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Observaciones (opcional)
                    </label>

                    <textarea
                        name="observation"
                        value={form?.observation}
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
            </GenericDrawer>
        </>
    );
};

export default EditInventoryLoteDrawer;