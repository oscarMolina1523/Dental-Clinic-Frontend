import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import PatientModel from "../../models/PatientModel";
import { useActivatePatient, useChangePatientAddress, useChangePatientEmail, useChangePatientImage, useChangePatientPhoneNumber, useDeactivatePatient, useUpdateEmergencyContact } from "../../hooks/usePatients";

interface SecurityPatientDrawerProps {
    isOpen: boolean;
    onHide: () => void;
    patient: PatientModel | null;
}

const SecurityPatientDrawer: React.FC<SecurityPatientDrawerProps> = ({
    isOpen,
    onHide,
    patient,
}) => {
    const [prevPatient, setPrevPatient] = useState<PatientModel | null>(patient);

    // Hooks de mutación
    const { mutateAsync: changeEmail, isPending: isPendingEmail } = useChangePatientEmail();
    const { mutateAsync: changePhone, isPending: isPendingPhone } = useChangePatientPhoneNumber();
    const { mutateAsync: changeAddress, isPending: isPendingAddress } = useChangePatientAddress();
    const { mutateAsync: changeEmergencyContact, isPending: isPendingEmergencyContact } = useUpdateEmergencyContact();
    const { mutateAsync: changeImage, isPending: isPendingImage } = useChangePatientImage();
    const { mutateAsync: activatePatient, isPending: isPendingActivate } = useActivatePatient();
    const { mutateAsync: deactivatePatient, isPending: isPendingDeactivate } = useDeactivatePatient();

    const isPending =
        isPendingEmail ||
        isPendingPhone ||
        isPendingAddress ||
        isPendingEmergencyContact ||
        isPendingImage ||
        isPendingActivate ||
        isPendingDeactivate;

    // Estados del formulario
    const [email, setEmail] = useState<string | null>("");
    const [phone, setPhone] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [emergencyContactName, setEmergencyContactName] = useState<string>("");
    const [emergencyContactPhone, setEmergencyContactPhone] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [isActive, setIsActive] = useState<boolean>(false);

    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);


    if (patient !== prevPatient) {
        setPrevPatient(patient);
        setEmail(patient?.email || "");
        setPhone(patient?.phoneNumber || "");
        setIsActive(patient?.active ?? false);
        setAddress(patient?.address ?? "");
        setEmergencyContactName(patient?.emergencyContactName ?? "");
        setEmergencyContactPhone(patient?.emergencyContactPhone ?? "");
        setImage(patient?.image ?? "");
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

    const handleSubmit = async () => {
        if (!patient) return;

        if (email !== patient.email && !email?.trim()) {
            showToast("error", "El correo electrónico no puede estar vacío.");
            return;
        }

        if (!phone.trim()) {
            showToast("error", "Debes tener un número de contacto.");
            return;
        }

        if (!address.trim()) {
            showToast("error", "Debes tener una dirección.");
            return;
        }

        if (!image.trim()) {
            showToast("error", "Debes tener una foto.");
            return;
        }

        if (!emergencyContactName.trim()) {
            showToast("error", "Debes tener un contacto de emergency.");
            return;
        }

        if (!emergencyContactPhone.trim()) {
            showToast("error", "Debes tener un número de contacto de emergency.");
            return;
        }

        try {
            // Se utiliza Promise<unknown>[] en lugar de Promise<any>[] para cumplir con las reglas de linting
            // (no-explicit-any) y mantener el tipo estricto. Como solo esperamos la resolución de Promise.all
            // y no consumimos el retorno individual de las mutaciones, unknown es el tipo seguro adecuado.
            const promises: Promise<unknown>[] = [];

            // Evaluar cambios y encolar peticiones específicas

            // Cambiar Email
            if (email !== patient.email) {
                promises.push(changeEmail({ id: patient.id, email: email.trim() }));
            }

            // Cambiar Numero de telefono
            if (phone !== patient.phoneNumber) {
                promises.push(changePhone({ id: patient.id, phoneNumber: phone }));
            }

            // Cambiar dirección
            if (address !== patient.address) {
                promises.push(changeAddress({ id: patient.id, address: address }));
            }

            // Cambiar foto
            if (image !== patient.image) {
                promises.push(changeImage({ id: patient.id, image }));
            }

            // Cambiar contacto de emergencia
            if (emergencyContactName !== patient.emergencyContactName && emergencyContactPhone !== patient.emergencyContactPhone) {
                promises.push(changeEmergencyContact({ id: patient.id, name: emergencyContactName, phone: emergencyContactPhone }));
            }

            // Activar / Desactivar Estado
            if (isActive !== patient.active) {
                if (isActive) {
                    promises.push(activatePatient(patient.id));
                } else {
                    promises.push(deactivatePatient(patient.id));
                }
            }

            // Si no hubo cambios
            if (promises.length === 0) {
                showToast("error", "No se detectó ningún cambio para guardar.");
                return;
            }

            // Ejecutar todas las peticiones necesarias
            await Promise.all(promises);

            showToast("success", "Ajustes de seguridad actualizados correctamente.");
            onHide();
        } catch {
            showToast(
                "error",
                "Ocurrió un error al actualizar los datos de seguridad."
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
                title="Seguridad del Paciente"
                description="Modifica la información sensible del paciente"
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
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            value={email || ""}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                        />
                    </div>

                    {/* numero de telefono */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Número de teléfono
                        </label>
                        <input
                            type="text"
                            value={phone || ""}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                        />
                    </div>

                    {/* Estado Activo/Inactivo */}
                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="userActive"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="userActive" className="text-sm font-medium text-slate-700 cursor-pointer">
                            Paciente activo en la plataforma
                        </label>
                    </div>

                    <hr className="border-slate-200 my-4" />
                    
                    {/* direccion */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Dirección
                        </label>
                        <input
                            type="text"
                            value={address || ""}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                        />
                    </div>

                    {/* nombre de contatco de emergencia */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nombre del contacto de emergencia
                        </label>
                        <input
                            type="text"
                            value={emergencyContactName || ""}
                            onChange={(e) => setEmergencyContactName(e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                        />
                    </div>

                    {/* numero de contatco de emergencia */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Número del contacto de emergencia
                        </label>
                        <input
                            type="text"
                            value={emergencyContactPhone || ""}
                            onChange={(e) => setEmergencyContactPhone(e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                        />
                    </div>

                </div>
            </GenericDrawer >
        </>
    );
};

export default SecurityPatientDrawer;