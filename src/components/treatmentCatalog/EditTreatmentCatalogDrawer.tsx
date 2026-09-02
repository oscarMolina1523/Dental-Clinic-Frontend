import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import type TreatmentCatalogModel from "../../models/TreatmentCatalogModel";
import { useUpdateTreatment } from "../../hooks/useTreatmentsCatalog";

interface EditTreatmentCatalogProps {
    isOpen: boolean;
    onHide: () => void;
    treatment: TreatmentCatalogModel | null;
}

const EditTreatmentCatalogDrawer: React.FC<EditTreatmentCatalogProps> = ({
    isOpen,
    onHide,
    treatment,
}) => {
    const {
        mutate: updatetreatment,
        isPending: isLoadingtreatments,
    } = useUpdateTreatment();

    const [prevtreatment, setPrevtreatment] = useState<TreatmentCatalogModel | null>(treatment);
    const [form, setForm] = useState<TreatmentCatalogModel | null>(treatment);

    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    if (treatment !== prevtreatment) {
        setPrevtreatment(treatment);
        setForm(treatment);
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
        if (!treatment || !form) {
            return;
        }

        if (!form.name.trim()) {
            showToast(
                "error",
                "El nombre es obligatorio."
            );
            return;
        }

        updatetreatment(
            {
                id: treatment.id,
                treatment: {
                    name: form.name.trim(),
                    description: form.description?.trim() || "",
                }
            },
            {
                onSuccess: () => {
                    showToast(
                        "success",
                        "El tratamiento se actualizó correctamente."
                    );

                    onHide();
                },

                onError: (error) => {
                    showToast(
                        "error",
                        error.message ||
                        "No se pudo actualizar el tratamiento."
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
                title="Editar tratamiento"
                description="Modifica la información del tratamiento"
                width="w-112.5"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={onHide}
                            disabled={isLoadingtreatments}
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
                            disabled={isLoadingtreatments}
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
                            {isLoadingtreatments
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
                            Descripción
                        </label>

                        <textarea
                            name="description"
                            value={form?.description || ""}
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

export default EditTreatmentCatalogDrawer;