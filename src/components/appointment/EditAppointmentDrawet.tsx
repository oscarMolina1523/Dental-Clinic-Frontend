import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import type Appointment from "../../models/AppointmentModel";
import { useUpdateAppointment } from "../../hooks/useAppointment";
import type { UpdateAppointmentDTO } from "../../models/AppointmentModel";
import { usePatients } from "../../hooks/usePatients";
import { useUsers } from "../../hooks/useUsers";
import { roleNames, UserRole } from "../../hooks/useRolePermitions";
import { DateTimePicker } from "../../shared/DateTimePicker/DateTimePicker";
import SearchableSelect from "../../shared/searchableSelect/SearchableSelect";
import type PatientModel from "../../models/PatientModel";
import type UserModel from "../../models/UserModel";

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

    const dentists = users.filter(
        (user) => roleNames[user.roleId] === UserRole.Dentist //hace referencia al rol de dentista
    );

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

    const handlePatientChange = (selectedPatient: PatientModel | null) => {
        if (!selectedPatient) return;

        const selectedId = String(selectedPatient.id);

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

    const handleDentistChange = (selectedDentist: UserModel | null) => {
        if (!selectedDentist) return;

        const selectedId = String(selectedDentist.id);
        
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

    const updateField = (
        name: keyof UpdateAppointmentDTO,
        value: string | boolean | Date
    ) => {
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

        const startDate = new Date(form.startAppointmentTime);
        const endDate = new Date(form.endAppointmentTime);

        if (endDate <= startDate) {
            showToast(
                "error",
                "La fecha y hora de finalización debe ser posterior a la fecha y hora de inicio."
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
                width="w-80 md:w-120"
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
                        <SearchableSelect<PatientModel>
                            label="Pacientes"
                            value={form?.patientId || ""}
                            items={patients}
                            getOptionValue={(patient) => patient.id}
                            getOptionLabel={(patient) =>
                                `${patient.name} ${patient.lastName}`
                            }
                            placeholder={
                                isLoadingPatients
                                    ? "Cargando pacientes..."
                                    : "Seleccione un paciente"
                            }
                            searchPlaceholder="Buscar paciente por nombre..."
                            noResultsMessage="No se encontraron pacientes."
                            disabled={isLoadingPatients}
                            onChange={handlePatientChange}
                        />
                    </div>
                    <div>
                        <SearchableSelect<UserModel>
                            label="Especialistas"
                            value={form?.dentistId || ""}
                            items={dentists}
                            getOptionValue={(dentist) => dentist.id}
                            getOptionLabel={(dentist) =>
                                `${dentist.fullName} - ${dentist.email}`
                            }
                            placeholder={
                                isLoadingUsers
                                    ? "Cargando especialistas..."
                                    : "Seleccione un especialista"
                            }
                            searchPlaceholder="Buscar especialista por nombre..."
                            noResultsMessage="No se encontraron especialistas."
                            disabled={isLoadingUsers}
                            onChange={handleDentistChange}
                        />
                    </div>
                    <div>
                        <DateTimePicker
                            label="Fecha y hora de inicio"
                            value={formatDateTimeForInput(form?.startAppointmentTime)}
                            onChange={(newValue) => updateField("startAppointmentTime", newValue)}
                        />
                    </div>
                    <div>
                        <DateTimePicker
                            label="Fecha y hora de finalización"
                            value={formatDateTimeForInput(form?.endAppointmentTime)}
                            onChange={(newValue) => updateField("endAppointmentTime", newValue)}
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