import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import { useAddPatient } from "../../hooks/usePatients";
import { maritalStatuses } from "../../data/maritalStatusData";
import { genderData } from "../../data/genderData";
interface CreatePatientProps {
    isOpen: boolean;
    onHide: () => void;
}

const CreatePatientDrawer: React.FC<CreatePatientProps> = ({ isOpen, onHide }) => {
    const { mutate: addPatient, isPending } = useAddPatient();

    const [form, setForm] = useState({
        name: "",
        lastName: "",
        idCard: "",
        birthdate: "",
        gender: "",
        phoneNumber: "",
        email: "",
        address: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        maritalStatus: ""
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
            lastName: "",
            idCard: "",
            birthdate: "",
            gender: "",
            phoneNumber: "",
            email: "",
            address: "",
            emergencyContactName: "",
            emergencyContactPhone: "",
            maritalStatus: ""
        });

        onHide();
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement  | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        const name = form.name.trim();
        const lastName = form.lastName.trim();
        const idCard = form.idCard.trim();
        const birthdate = form.birthdate;
        const gender = form.gender.trim();
        const phone = form.phoneNumber.trim();
        const email = form.email.trim();
        const address = form.address.trim();
        const emergencyContactName = form.emergencyContactName.trim();
        const emergencyContactPhone = form.emergencyContactPhone.trim();
        const maritalStatus = form.maritalStatus.trim();

        // Validaciones
        if (!name) {
            showToast(
                "error",
                "Debe escribir al menos uno de los nombres."
            );
            return;
        }
        if (!lastName) {
            showToast(
                "error",
                "Debe escribir al menos uno de los apellidos."
            );
            return;
        }

        if (!idCard) {
            showToast(
                "error",
                "Debe tener un documento de identidad."
            );
            return;
        }

        if (!birthdate) {
            showToast(
                "error",
                "Debe seleccionar la fecha de nacimiento."
            );
            return;
        }

        const birthdateDate = new Date(`${birthdate}T00:00:00`);

        if (!gender) {
            showToast(
                "error",
                "Debe seleccionar un género."
            );
            return;
        }

        if (!address) {
            showToast(
                "error",
                "Debe proporcionar dirección."
            );
            return;
        }

        if (!email) {
            showToast(
                "error",
                "El email es obligatorio."
            );
            return;
        }

        if (!emergencyContactName) {
            showToast(
                "error",
                "Debe proporcionar el nombre del contacto de emergencia."
            );
            return;
        }

        if (!emergencyContactPhone) {
            showToast(
                "error",
                "Debe proporcionar el número del contacto de emergencia."
            );
            return;
        }

        if (!maritalStatus) {
            showToast(
                "error",
                "Debe proporcionar su estado civil."
            );
            return;
        }

        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            showToast(
                "error",
                "Ingrese un email válido."
            );
            return;
        }


        addPatient(
            {
                name,
                lastName,
                idCard,
                birthdate: birthdateDate,
                gender,
                phoneNumber: phone,
                email,
                address,
                emergencyContactName,
                emergencyContactPhone,
                maritalStatus
            },
            {
                onSuccess: () => {
                    showToast(
                        "success",
                        "El paciente se creó correctamente."
                    );

                    cleanForm();

                },

                onError: (error) => {
                    showToast(
                        "error",
                        error.message ||
                        "No se pudo crear el paciente."
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
                onClick={cleanForm}
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
                title="Nuevo Paciente"
                description="Registra un nuevo paciente"
                width="w-112.5"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={cleanForm}
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
                                : "Crear Paciente"}
                        </button>
                    </>
                }
            >
                {/* BODY DEL CREATE */}
                <div className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nombres
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Ingrese el sus nombres"
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
                            value={form.lastName}
                            onChange={handleChange}
                            placeholder="Ingrese el sus apellidos"
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
                            Documento de identidad
                        </label>

                        <input
                            type="text"
                            name="idCard"
                            value={form.idCard}
                            onChange={handleChange}
                            placeholder="Ingrese el su documento de identidad"
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
                            Fecha de nacimiento
                        </label>

                        <input
                            key={isOpen ? "birthdate-open" : "birthdate-closed"}
                            type="date"
                            name="birthdate"
                            value={form.birthdate}
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
                            value={form.gender}
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
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="correo@ejemplo.com"
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
                            Número de teléfono
                        </label>

                        <input
                            type="text"
                            name="phoneNumber"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            placeholder="Ingrese su número de teléfono"
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
                            Dirección
                        </label>

                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Ingrese su dirección"
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
                            Nombre del contacto de emergencia
                        </label>

                        <input
                            type="text"
                            name="emergencyContactName"
                            value={form.emergencyContactName}
                            onChange={handleChange}
                            placeholder="Ingrese el nombre del contacto de emergencia"
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
                            Número del contacto de emergencia
                        </label>

                        <input
                            type="text"
                            name="emergencyContactPhone"
                            value={form.emergencyContactPhone}
                            onChange={handleChange}
                            placeholder="Ingrese el número del contacto de emergencia"
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
                            Estado Civil
                        </label>
                        <select
                            name="maritalStatus"
                            value={form.maritalStatus}
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
                                Seleccione un estado civil
                            </option>

                            {maritalStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
            </GenericDrawer>
        </>
    );
}

export default CreatePatientDrawer;