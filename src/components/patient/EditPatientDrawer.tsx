import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import type PatientModel from "../../models/PatientModel";
import { useUpdatePatient } from "../../hooks/usePatients";
import { genderData } from "../../data/genderData";

interface EditPatientDrawerProps {
    isOpen: boolean;
    onHide: () => void;
    patient: PatientModel | null;
}

const EditPatientDrawer: React.FC<EditPatientDrawerProps> = ({
    isOpen,
    onHide,
    patient,
}) => {
    const {
        mutate: updatePatient,
        isPending,
    } = useUpdatePatient();

    const [prevPatient, setPrevPatient] = useState<PatientModel | null>(patient);
    const [form, setForm] = useState<PatientModel | null>(patient);

    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    if (patient !== prevPatient) {
        setPrevPatient(patient);
        setForm(patient);
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

    /*
     * Convierte Date -> YYYY-MM-DD
     * para poder utilizarlo en <input type="date">
     */
    const formatDateForInput = (
        date: Date | string | null | undefined
    ): string => {
        if (!date) return "";

        if (typeof date === "string") {
            return date.substring(0, 10);
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const handleSubmit = () => {
        if (!patient || !form) {
            return;
        }

        if (!form.name.trim()) {
            showToast(
                "error",
                "El nombre es obligatorio."
            );
            return;
        }

        if (!form.lastName.trim()) {
            showToast(
                "error",
                "El apellido es obligatorio."
            );
            return;
        }

        if (!form.gender.trim()) {
            showToast(
                "error",
                "Debe seleccionar un género."
            );
            return;
        }

        if (!form.birthdate) {
            showToast(
                "error",
                "Debe seleccionar la fecha de nacimiento."
            );
            return;
        }

        updatePatient(
            {
                id: patient.id,
                patient: {
                    name: form.name.trim(),
                    lastName: form.lastName.trim(),
                    gender: form.gender,
                    birthdate: form.birthdate
                }
            },
            {
                onSuccess: () => {
                    showToast(
                        "success",
                        "El paciente se actualizó correctamente."
                    );

                    onHide();
                },

                onError: (error) => {
                    showToast(
                        "error",
                        error.message ||
                        "No se pudo actualizar el paciente."
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
                title="Editar Paciente"
                description="Modifica la información del paciente"
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
                            Nombres
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
                            Apellidos
                        </label>

                        <input
                            type="text"
                            name="lastName"
                            value={form?.lastName || ""}
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
                            Género
                        </label>

                        <select
                            name="gender"
                            value={form?.gender || ""}
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
                        >
                            <option value="">
                                Seleccione un género
                            </option>

                            {genderData.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Fecha de nacimiento
                        </label>

                        <input
                            key={isOpen ? "birthdate-open" : "birthdate-closed"}
                            type="date"
                            name="birthdate"
                            value={formatDateForInput(form?.birthdate)}
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

export default EditPatientDrawer;