import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import { useAddTreatment } from "../../hooks/useTreatmentsCatalog";

interface CreateTreatmentCatalogProps {
    isOpen: boolean;
    onHide: () => void;
}

const CreateTreatmentCatalogDrawer: React.FC<CreateTreatmentCatalogProps> = ({ isOpen, onHide }) => {
    const { mutate: addTreatment, isPending } = useAddTreatment();

    const [form, setForm] = useState({
        name: "",
        description: "",
        basePrice: 0,
        estimatedDurationMinutes: 0,
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
            description: "",
            basePrice: 0,
            estimatedDurationMinutes: 0,
        });

        onHide();
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
        const name = form.name.trim();
        const description = form.description.trim();
        const basePrice = form.basePrice;
        const estimatedDurationMinutes = form.estimatedDurationMinutes;

        // Validaciones
        if (!name) {
            showToast(
                "error",
                "El nombre del tratamiento es obligatorio."
            );
            return;
        }

        if (!basePrice) {
            showToast(
                "error",
                "El precio base es obligatorio."
            );
            return;
        }

        if (!estimatedDurationMinutes) {
            showToast(
                "error",
                "La duración estimada es obligatoria."
            );
            return;
        }

        addTreatment(
            {
                name,
                description,
                basePrice,
                estimatedDurationMinutes
            },
            {
                onSuccess: () => {
                    showToast(
                        "success",
                        "El tratamiento se creó correctamente."
                    );

                    cleanForm();

                },

                onError: (error) => {
                    showToast(
                        "error",
                        error.message ||
                        "No se pudo crear el tratamiento."
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
                title="Nuevo Tratamiento"
                description="Registra un nuevo tratamiento"
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
                                : "Crear Tratamiento"}
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
                            Precio Base
                        </label>

                        <input
                            type="number"
                            name="basePrice"
                            value={form.basePrice}
                            onChange={handleChange}
                            placeholder="0.00"
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
                            Duración Estimada (minutos)
                        </label>
                        <input
                            type="number"
                            name="estimatedDurationMinutes"
                            value={form.estimatedDurationMinutes}
                            onChange={handleChange}
                            placeholder="0.00"
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

export default CreateTreatmentCatalogDrawer;