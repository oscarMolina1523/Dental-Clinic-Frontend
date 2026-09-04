import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import type InventoryLoteModel from "../../models/InventoryLote";
import { useExpireInventoryLote } from "../../hooks/useInventoryOrchestrator";
import type { ExpireInventoryOrchestratorLoteRequest } from "../../models/InventoryOrchestratorModel";

interface ExpiredLoteDrawerProps {
    isOpen: boolean;
    onHide: () => void;
    lote: InventoryLoteModel | null;
}

const ExpiredLoteDrawer: React.FC<ExpiredLoteDrawerProps> = ({
    isOpen,
    onHide,
    lote,
}) => {
    const {
        mutate: expireLote,
        isPending: isLoadinglotes,
    } = useExpireInventoryLote();

    const [prevLote, setPrevLote] = useState<InventoryLoteModel | null>(lote);
    const [form, setForm] = useState<ExpireInventoryOrchestratorLoteRequest | null>();

    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    if (lote !== prevLote) {
        setPrevLote(lote);
        setForm({ userId: "system", observation: "" });
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
            HTMLInputElement | HTMLTextAreaElement
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
        if (!lote || !form) {
            return;
        }

        expireLote(
            {
                id: lote.id,
                data: {
                    userId: form.userId,
                    observation: form.observation,
                }
            },
            {
                onSuccess: () => {
                    showToast(
                        "success",
                        "El inventario se marco como expirado correctamente."
                    );

                    onHide();
                },

                onError: (error) => {
                    showToast(
                        "error",
                        error.message ||
                        "No se pudo marcar el inventario como expirado."
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
                title="Marcar como expirado"
                description="Marca el inventario como expirado"
                width="w-112.5"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={onHide}
                            disabled={isLoadinglotes}
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
                            disabled={isLoadinglotes}
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
                            {isLoadinglotes
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
                            Observación
                        </label>

                        <textarea
                            name="observation"
                            value={form?.observation || ""}
                            onChange={handleChange}
                            className="
                                w-full
                                min-h-full
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

export default ExpiredLoteDrawer;