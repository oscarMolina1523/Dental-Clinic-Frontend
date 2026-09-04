import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import type InventoryLoteModel from "../../models/InventoryLote";
import type { UpdateAmountInventoryOrchestratorRequest } from "../../models/InventoryOrchestratorModel";
import { useDecreaseInventoryLoteStock, useIncreaseInventoryLoteStock } from "../../hooks/useInventoryOrchestrator";

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
        mutateAsync: increaseInventoryLote,
        isPending: isLoadingIncrease,
    } = useIncreaseInventoryLoteStock();
    const {
        mutateAsync: decreaseInventoryLote,
        isPending: isLoadingDecrease,
    } = useDecreaseInventoryLoteStock();

    const isPending =
        isLoadingIncrease ||
        isLoadingDecrease;

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

        if (!form.quantity || form.quantity < 0) {
            showToast(
                "error",
                "La cantidad es obligatoria y debe ser un número positivo o cero."
            );
            return;
        }

        try {
            const promises: Promise<unknown>[] = [];

            const currentQuantity = Number(lote.quantity);
            const newQuantity = Number(form.quantity);

            if (newQuantity !== currentQuantity) {
                const difference = Math.abs(newQuantity - currentQuantity);

                if (newQuantity > currentQuantity) {
                    promises.push(
                        increaseInventoryLote({
                            id: lote.id,
                            data: {
                                quantity: difference,
                                userId: form.userId,
                                observation: form.observation
                            }
                        })
                    );
                } else {
                    promises.push(
                        decreaseInventoryLote({
                            id: lote.id,
                            data: {
                                quantity: difference,
                                userId: form.userId,
                                observation: form.observation
                            }
                        })
                    );
                }
            }

            await Promise.all(promises);

            showToast("success", "Modificaciones realizadas correctamente.");
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

                <div className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Cantidad
                        </label>

                        <input
                            type="number"
                            name="quantity"
                            value={form?.quantity || ""}
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