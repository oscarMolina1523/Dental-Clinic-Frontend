import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import { useAddAppointment } from "../../hooks/useAppointment";
import type { AppointmentStatus } from "../../utils/appointmentStatus.enum";
import { usePatients } from "../../hooks/usePatients";
import { useUsers } from "../../hooks/useUsers";

interface CreateAppointmentProps {
    isOpen: boolean;
    onHide: () => void;
}

const CreateAppointmentDrawer: React.FC<CreateAppointmentProps> = ({ isOpen, onHide }) => {
    const { mutate: addAppointment, isPending } = useAddAppointment();
    const {
        data: patients = [],
        isLoading: isLoadingPatients,
    } = usePatients();

    const {
        data: users = [],
        isLoading: isLoadingUsers,
    } = useUsers();

    const [form, setForm] = useState<{
        patientId: string;
        patientFullName: string;
        dentistId: string;
        dentistFullName: string;
        startAppointmentTime: string;
        endAppointmentTime: string;
        reason: string;
        status: AppointmentStatus;
        cancelationNotes: string;
        reminderSent: boolean;
    }>({
        patientId: "",
        patientFullName: "",
        dentistId: "",
        dentistFullName: "",
        startAppointmentTime: new Date().toISOString().slice(0, 16),
        endAppointmentTime: new Date().toISOString().slice(0, 16),
        reason: "",
        status: "SCHEDULED",
        cancelationNotes: "",
        reminderSent: false,
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
            patientId: "",
            patientFullName: "",
            dentistId: "",
            dentistFullName: "",
            startAppointmentTime: new Date().toISOString().slice(0, 16),
            endAppointmentTime: new Date().toISOString().slice(0, 16),
            reason: "",
            status: "SCHEDULED",
            cancelationNotes: "",
            reminderSent: false,
        });

        onHide();
    };

    const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const selectedPatient = patients.find((p) => String(p.id) === selectedId);

        setForm((prev) => ({
            ...prev,
            patientId: selectedId,
             patientFullName: selectedPatient
            ? `${selectedPatient.name} ${selectedPatient.lastName}`
            : "",
        }));
    };

    const handleDentistChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const selectedDentist = users.find((u) => String(u.id) === selectedId);

        setForm((prev) => ({
            ...prev,
            dentistId: selectedId,
            dentistFullName: selectedDentist ? selectedDentist.fullName : "",
        }));
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        const patientId = form.patientId.trim();
        const patientFullName = form.patientFullName.trim();
        const dentistId = form.dentistId.trim();
        const dentistFullName = form.dentistFullName.trim();
        const startAppointmentTime = form.startAppointmentTime;
        const endAppointmentTime = form.endAppointmentTime;
        const reason = form.reason.trim();
        const status = form.status;
        const cancelationNotes = form.cancelationNotes.trim();
        const reminderSent = form.reminderSent;

        // Validaciones
        if (!patientId) {
            showToast(
                "error",
                "Debe seleccionar un paciente."
            );
            return;
        }
        if (!dentistId) {
            showToast(
                "error",
                "Debe seleccionar un dentista."
            );
            return;
        }

        if (!startAppointmentTime) {
            showToast(
                "error",
                "Debe seleccionar una fecha y hora de inicio."
            );
            return;
        }

        if (!endAppointmentTime) {
            showToast(
                "error",
                "Debe seleccionar una fecha y hora de finalización."
            );
            return;
        }

        addAppointment(
            {
                patientId,
                patientFullName,
                dentistId,
                dentistFullName,
                startAppointmentTime: new Date(startAppointmentTime),
                endAppointmentTime: new Date(endAppointmentTime),
                reason,
                status,
                cancelationNotes,
                reminderSent,
            },
            {
                onSuccess: () => {
                    showToast(
                        "success",
                        "La cita se creó correctamente."
                    );

                    cleanForm();

                },

                onError: (error) => {
                    showToast(
                        "error",
                        error.message ||
                        "No se pudo crear la cita."
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
                title="Nueva Cita"
                description="Registra una nueva cita"
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
                                : "Crear Cita"}
                        </button>
                    </>
                }
            >
                {/* BODY DEL CREATE */}
                <div className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Pacientes
                        </label>

                        <select
                            name="patientId"
                            value={form.patientId}
                            onChange={handlePatientChange}
                            disabled={isLoadingPatients}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50 disabled:cursor-not-allowed"
                        >
                            <option value="">
                                {isLoadingPatients ? "Cargando pacientes..." : "Seleccione un paciente"}
                            </option>
                            {/* 3. Mapeo dinámico de los patients devueltos por la API */}
                            {patients.map((patient) => (
                                <option key={patient.id} value={patient.id}>
                                    {patient.name} {patient.lastName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Dentistas
                        </label>

                        <select
                            name="dentistId"
                            value={form.dentistId}
                            onChange={handleDentistChange}
                            disabled={isLoadingUsers}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50 disabled:cursor-not-allowed"
                        >
                            <option value="">
                                {isLoadingUsers ? "Cargando dentistas..." : "Seleccione un dentista"}
                            </option>
                            {/* 3. Mapeo dinámico de los dentistas devueltos por la API */}
                            {users.map((dentist) => (
                                <option key={dentist.id} value={dentist.id}>
                                    {dentist.fullName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Fecha y hora de inicio
                        </label>

                        <input
                            key={isOpen ? "startAppointmentTime-open" : "startAppointmentTime-closed"}
                            type="datetime-local"
                            name="startAppointmentTime"
                            value={form.startAppointmentTime}
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
                            Fecha y hora de finalización
                        </label>

                        <input
                            key={isOpen ? "endAppointmentTime-open" : "endAppointmentTime-closed"}
                            type="datetime-local"
                            name="endAppointmentTime"
                            value={form.endAppointmentTime}
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
                            Razón
                        </label>

                        <textarea
                            name="reason"
                            value={form.reason}
                            onChange={handleChange}
                            placeholder="Ingrese una razón de la cita"
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
                </div>
            </GenericDrawer>
        </>
    );
}

export default CreateAppointmentDrawer;