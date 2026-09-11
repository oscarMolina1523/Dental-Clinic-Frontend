import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import type Appointment from "../../models/AppointmentModel";
import { useUpdateAppointment } from "../../hooks/useAppointment";
import type { UpdateAppointmentDTO } from "../../models/AppointmentModel";
import { usePatients } from "../../hooks/usePatients";
import { useUsers } from "../../hooks/useUsers";

interface EditAppointmentDrawerProps {
    isOpen: boolean;
    onHide: () => void;
    appointment: Appointment | null;
}

const EditAppointmentDrawer: React.FC<EditAppointmentDrawerProps> = ({
    isOpen,
    onHide,
    appointment,
}) => {
    const {
        mutate: updateAppointment,
        isPending,
    } = useUpdateAppointment();
    const {
        data: patients = [],
        isLoading: isLoadingPatients,
    } = usePatients();

    const {
        data: users = [],
        isLoading: isLoadingUsers,
    } = useUsers();

    const [prevAppointment, setPrevAppointment] = useState<Appointment | null>(appointment);
    const [form, setForm] = useState<UpdateAppointmentDTO | null>();

    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    if (appointment !== prevAppointment) {
        setPrevAppointment(appointment);
        setForm(appointment);
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

    const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const selectedPatient = patients.find(
            (p) => String(p.id) === selectedId
        );

        setForm((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                patientId: selectedId,
                patientFullName: selectedPatient
                    ? `${selectedPatient.name} ${selectedPatient.lastName}`
                    : "",
            };
        });
    };

    const formatDateTimeForInput = (
        date: Date | string | null | undefined
    ): string => {
        if (!date) return "";

        const parsedDate = date instanceof Date ? date : new Date(date);

        if (isNaN(parsedDate.getTime())) return "";

        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const day = String(parsedDate.getDate()).padStart(2, "0");
        const hours = String(parsedDate.getHours()).padStart(2, "0");
        const minutes = String(parsedDate.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleDentistChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const selectedDentist = users.find(
            (u) => String(u.id) === selectedId
        );

        setForm((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                dentistId: selectedId,
                dentistFullName: selectedDentist
                    ? selectedDentist.fullName
                    : "",
            };
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

    const handleSubmit = () => {
        if (!appointment || !form) {
            return;
        }

        if (!form.patientId.trim()) {
            showToast(
                "error",
                "El nombre del paciente es obligatorio."
            );
            return;
        }

        if (!form.dentistId.trim()) {
            showToast(
                "error",
                "El nombre del dentista es obligatorio."
            );
            return;
        }

        if (!form.startAppointmentTime) {
            showToast(
                "error",
                "Debe seleccionar una fecha de inicio."
            );
            return;
        }

        if (!form.endAppointmentTime) {
            showToast(
                "error",
                "Debe seleccionar una fecha de finalización."
            );
            return;
        }

        updateAppointment(
            {
                id: appointment.id,
                appointment: {
                    patientId: form.patientId.trim(),
                    patientFullName: form.patientFullName.trim(),
                    dentistId: form.dentistId.trim(),
                    dentistFullName: form.dentistFullName.trim(),
                    startAppointmentTime: new Date(form.startAppointmentTime),
                    endAppointmentTime: new Date(form.endAppointmentTime),
                    reason: form.reason.trim(),
                }
            },
            {
                onSuccess: () => {
                    showToast(
                        "success",
                        "La cita se actualizó correctamente."
                    );

                    onHide();
                },

                onError: (error) => {
                    showToast(
                        "error",
                        error.message ||
                        "No se pudo actualizar la cita."
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
                title="Editar Cita"
                description="Modifica la información de la cita"
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
                            Pacientes
                        </label>

                        <select
                            name="patientId"
                            value={form?.patientId || ""}
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
                            value={form?.dentistId || ""}
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
                            value={formatDateTimeForInput(form?.startAppointmentTime)}
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
                            value={formatDateTimeForInput(form?.endAppointmentTime)}
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
                            value={form?.reason || ""}
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
};

export default EditAppointmentDrawer;