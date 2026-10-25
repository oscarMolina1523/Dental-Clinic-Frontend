import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import { useAddPatient } from "../../hooks/usePatients";
import { maritalStatuses } from "../../data/maritalStatusData";
import { genderData } from "../../data/genderData";
import { validateIdentityDocument } from "../../utils/validatIdentityDocument";
import { usePatientAgeValidation } from "../../utils/usePatientAgeValidation";
import { validatePhoneNumber } from "../../utils/validatePhoneNumber";

interface CreatePatientProps {
    isOpen: boolean;
    onHide: () => void;
}

const CreatePatientDrawer: React.FC<CreatePatientProps> = ({ isOpen, onHide }) => {
    const { mutate: addPatient, isPending } = useAddPatient();
    const {
        minAge,
        maxAge,
        minBirthdate,
        maxBirthdate,
        validateBirthdate,
    } = usePatientAgeValidation();

    const [form, setForm] = useState({
        name: "",
        lastName: "",
        idCard: "",
        birthdate: "",
        gender: "",
        phoneNumber: "",
        bloodType: "",
        email: "",
        address: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        maritalStatus: "",
        payerName: "",
        payerIdCard: "",
        payerPhoneNumber: "",
    });

    const [isMinor, setIsMinor] = useState(false);

    const [isSelfPayer, setIsSelfPayer] = useState(true);

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

    const maxBirthdateForMinor = (() => {
        const today = new Date();
        const date = new Date(today);

        date.setFullYear(date.getFullYear() - 18);

        // Formatear como YYYY-MM-DD usando la fecha local
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    })();

    const handleMinorChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const checked = e.target.checked;

        setIsMinor(checked);

        if (checked) {
            // Un menor de edad debe tener un responsable de pago
            setIsSelfPayer(false);

            setForm((prev) => ({
                ...prev,
                maritalStatus: "Soltero/a",
            }));
        }
    };

    const handleSelfPayerChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const checked = e.target.checked;

        setIsSelfPayer(checked);

        if (checked) {
            setForm((prev) => ({
                ...prev,
                payerName: "",
                payerIdCard: "",
                payerPhoneNumber: "",
            }));
        }
    };

    const cleanForm = () => {
        setForm({
            name: "",
            lastName: "",
            idCard: "",
            birthdate: "",
            gender: "",
            bloodType: "",
            phoneNumber: "",
            email: "",
            address: "",
            emergencyContactName: "",
            emergencyContactPhone: "",
            maritalStatus: "",
            payerName: "",
            payerIdCard: "",
            payerPhoneNumber: "",
        });

        setIsMinor(false);
        setIsSelfPayer(true);

        onHide();
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
        const bloodType = form.bloodType.trim();
        const address = form.address.trim();
        const emergencyContactName = form.emergencyContactName.trim();
        const emergencyContactPhone = form.emergencyContactPhone.trim();
        const maritalStatus = form.maritalStatus.trim();
        const payerName = form.payerName.trim();
        const payerIdCard = form.payerIdCard.trim();
        const payerPhoneNumber = form.payerPhoneNumber.trim();

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
        if (!bloodType) {
            showToast(
                "error",
                "Debe seleccionar un tipo de sangre."
            );
            return;
        }

        if (!isMinor && !validatePhoneNumber(phone)) {
            showToast(
                "error",
                "Ingrese un número de teléfono válido de 8 dígitos del paciente."
            );
            return;
        }

        if (!validatePhoneNumber(emergencyContactPhone)) {
            showToast(
                "error",
                "Ingrese un número de teléfono válido de 8 dígitos del contacto de emergencia."
            );
            return;
        }

        if (!isMinor && !idCard) {
            showToast(
                "error",
                "Debe tener un documento de identidad."
            );
            return;
        }

        if (!validateBirthdate(birthdate)) {
            showToast(
                "error",
                `La edad del paciente debe estar entre ${minAge} y ${maxAge} años.`
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

        if (!isSelfPayer) {
            if (!payerName) {
                showToast(
                    "error",
                    "Debe proporcionar el nombre del responsable de pago."
                );
                return;
            }

            if (!payerIdCard) {
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

            if (!validatePhoneNumber(payerPhoneNumber)) {
                showToast(
                    "error",
                    "Ingrese un número de teléfono válido de 8 dígitos del responsable."
                );
                return;
            }
        }

        if (!isMinor) {
            if (!email) {
                showToast(
                    "error",
                    "El email es obligatorio."
                );
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                showToast(
                    "error",
                    "Ingrese un email válido."
                );
                return;
            }
        }

        if (!isMinor && !validateIdentityDocument(idCard)) {
            showToast(
                "error",
                "El documento de identidad debe ser una cédula o un pasaporte válido."
            );
            return;
        }

        addPatient(
            {
                name,
                lastName,
                idCard: isMinor ? "" : idCard,
                birthdate: birthdateDate,
                gender,
                phoneNumber: isMinor ? "" : phone,
                email: isMinor ? "" : email,
                address,
                emergencyContactName,
                emergencyContactPhone,
                maritalStatus,
                isSelfPayer,
                payerName: isSelfPayer
                    ? `${name} ${lastName}`
                    : payerName,

                payerIdCard: isSelfPayer
                    ? idCard
                    : payerIdCard,

                payerPhoneNumber: isSelfPayer
                    ? phone
                    : payerPhoneNumber,
                bloodType
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
                width="w-80 md:w-200"
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
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-slate-200" />

                        <h2 className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                            Datos del Paciente
                        </h2>

                        <div className="flex-1 h-px bg-slate-200" />
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 w-full">
                        <div className="flex-1">
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
                        <div className="flex-1">
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
                    </div>

                    <div className="mt-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isMinor}
                                onChange={handleMinorChange}
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
                                El paciente es menor de edad
                            </span>
                        </label>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 w-full">
                        {!isMinor && (
                            <>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Documento de identidad (cédula o pasaporte)
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

                                <div className="flex-1">
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
                            </>
                        )}

                    </div>
                    <div className="flex flex-col md:flex-row gap-2 w-full">
                        <div className="flex-1">
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

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Fecha de nacimiento
                            </label>

                            <input
                                key={isOpen ? "birthdate-open" : "birthdate-closed"}
                                type="date"
                                name="birthdate"
                                value={form.birthdate}
                                onChange={handleChange}
                                min={isMinor ? maxBirthdateForMinor : minBirthdate}
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
                    <div className="flex flex-col md:flex-row gap-2 w-full">
                        {!isMinor && (
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Número de teléfono del paciente
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
                        )}
                        <div className="flex-1">
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
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 w-full">
                        {/* estado civil */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Estado Civil del paciente
                            </label>
                            <select
                                disabled={isMinor}
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

                        {/* tipos de sangre */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Tipo de sangre del paciente
                            </label>

                            <select
                                name="bloodType"
                                value={form.bloodType}
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
                                    Seleccione un tipo de sangre
                                </option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                disabled={isMinor}
                                checked={isSelfPayer}
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
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-slate-200" />

                        <h2 className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                            Datos del Contacto de Emergencia
                        </h2>

                        <div className="flex-1 h-px bg-slate-200" />
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 w-full">
                        <div className="flex-1">
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
                        <div className="flex-1">
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
                    </div>

                    {!isSelfPayer && (
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
                                        value={form.payerName}
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
                                        value={form.payerIdCard}
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
                                    value={form.payerPhoneNumber}
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
}

export default CreatePatientDrawer;