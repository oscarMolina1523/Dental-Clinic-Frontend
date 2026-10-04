import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import type PatientModel from "../../models/PatientModel";
import { useUpdatePatient } from "../../hooks/usePatients";
import { genderData } from "../../data/genderData";
import { usePatientAgeValidation } from "../../utils/usePatientAgeValidation";
import { validatePhoneNumber } from "../../utils/validatePhoneNumber";
import { validateIdentityDocument } from "../../utils/validatIdentityDocument";

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
    const {
        minAge,
        maxAge,
        minBirthdate,
        maxBirthdate,
        validateBirthdate,
    } = usePatientAgeValidation();

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

    const handleSelfPayerChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const checked = e.target.checked;

        setForm((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                isSelfPayer: checked,
                payerName: checked ? "" : prev.payerName,
                payerIdCard: checked ? "" : prev.payerIdCard,
                payerPhoneNumber: checked ? "" : prev.payerPhoneNumber,
            };
        });
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

        const birthdateString = formatDateForInput(form.birthdate);

        if (!validateBirthdate(birthdateString)) {
            showToast(
                "error",
                `La edad del paciente debe estar entre ${minAge} y ${maxAge} años.`
            );
            return;
        }

        if (!form.isSelfPayer) {
            if (!form.payerName.trim()) {
                showToast(
                    "error",
                    "Debe proporcionar el nombre del responsable de pago."
                );
                return;
            }

            if (!form.payerIdCard.trim()) {
                showToast(
                    "error",
                    "Debe proporcionar el documento de identidad del responsable de pago."
                );
                return;
            }

            if (!validateIdentityDocument(form.payerIdCard)) {
                showToast(
                    "error",
                    "El documento del responsable debe ser una cédula o un pasaporte válido."
                );
                return;
            }

            if (!form.payerPhoneNumber.trim()) {
                showToast(
                    "error",
                    "Debe proporcionar el teléfono del responsable de pago."
                );
                return;
            }

            if (!validatePhoneNumber(form.payerPhoneNumber)) {
                showToast(
                    "error",
                    "Ingrese un número de teléfono válido de 8 dígitos del responsable."
                );
                return;
            }
        }

        updatePatient(
            {
                id: patient.id,
                patient: {
                    name: form.name.trim(),
                    lastName: form.lastName.trim(),
                    gender: form.gender,
                    birthdate: form.birthdate,
                    isSelfPayer: form.isSelfPayer,
                    payerName: form.payerName.trim(),
                    payerIdCard: form.payerIdCard.trim(),
                    payerPhoneNumber: form.payerPhoneNumber.trim(),
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
                width="w-80 md:w-150"
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
                    <div className="flex flex-col md:flex-row gap-2 w-full">
                        <div className="flex-1">
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
                        <div className="flex-1">
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
                    </div>

                    <div className="flex flex-col md:flex-row gap-2 w-full">
                        <div className="flex-1">
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
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Fecha de nacimiento
                            </label>

                            <input
                                key={isOpen ? "birthdate-open" : "birthdate-closed"}
                                type="date"
                                name="birthdate"
                                value={formatDateForInput(form?.birthdate)}
                                onChange={handleChange}
                                min={minBirthdate}
                                max={maxBirthdate}
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
                    <div className="mt-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form?.isSelfPayer ?? true}
                                onChange={handleSelfPayerChange}
                                className="
                                    w-4 h-4
                                    rounded
                                    border-slate-300
                                    text-blue-600
                                    focus:ring-blue-500
                                    cursor-pointer
                                "
                            />

                            <span className="text-sm font-medium text-slate-700">
                                El paciente es quien realiza el pago
                            </span>
                        </label>
                    </div>
                    {!form?.isSelfPayer && (
                        <>
                            <div className="flex items-center gap-4 my-6">
                                <div className="flex-1 h-px bg-slate-200" />

                                <h2 className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                                    Datos del Responsable de Pago
                                </h2>

                                <div className="flex-1 h-px bg-slate-200" />
                            </div>

                            <div className="flex flex-col md:flex-row gap-2 w-full">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Nombre del responsable
                                    </label>

                                    <input
                                        type="text"
                                        name="payerName"
                                        value={form?.payerName || ""}
                                        onChange={handleChange}
                                        placeholder="Ingrese el nombre del responsable"
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

                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Documento de identidad del responsable
                                    </label>

                                    <input
                                        type="text"
                                        name="payerIdCard"
                                        value={form?.payerIdCard || ""}
                                        onChange={handleChange}
                                        placeholder="Cédula o pasaporte"
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
                                    Teléfono del responsable
                                </label>

                                <input
                                    type="text"
                                    name="payerPhoneNumber"
                                    value={form?.payerPhoneNumber || ""}
                                    onChange={handleChange}
                                    placeholder="Ingrese el teléfono del responsable"
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
                        </>
                    )}
                </div>
            </GenericDrawer>
        </>
    );
};

export default EditPatientDrawer;