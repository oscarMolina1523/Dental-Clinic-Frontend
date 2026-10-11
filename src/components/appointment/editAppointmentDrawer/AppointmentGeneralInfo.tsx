import React from "react";
import SearchableSelect from "../../../shared/searchableSelect/SearchableSelect";
import type PatientModel from "../../../models/PatientModel";
import type UserModel from "../../../models/UserModel";
import { DateTimePicker } from "../../../shared/DateTimePicker/DateTimePicker";
import type { UpdateAppointmentDTO } from "../../../models/AppointmentModel";

interface AppointmentGeneralInfoProps {
    form: UpdateAppointmentDTO | null | undefined;
    patients: PatientModel[];
    isLoadingPatients: boolean;
    dentists: UserModel[];
    isLoadingUsers: boolean;
    dentistSpecialities: string[];
    onPatientChange: (patient: PatientModel | null) => void;
    onDentistChange: (dentist: UserModel | null) => void;
    onSpecialityChange: (speciality: string) => void;
    onUpdateField: (name: keyof UpdateAppointmentDTO, value: string | boolean | Date) => void;
}

const formatDateTimeForInput = (date: Date | string | null | undefined): string => {
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

export const AppointmentGeneralInfo: React.FC<AppointmentGeneralInfoProps> = ({
    form,
    patients,
    isLoadingPatients,
    dentists,
    isLoadingUsers,
    dentistSpecialities,
    onPatientChange,
    onDentistChange,
    onSpecialityChange,
    onUpdateField,
}) => {
    return (
        <>
            <div className="flex flex-col md:flex-row gap-2 w-full">
                <div className="flex-1">
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
                        onChange={onPatientChange}
                    />
                </div>
                <div className="flex-1">
                    <SearchableSelect<UserModel>
                        label="Especialistas"
                        value={form?.dentistId || ""}
                        items={dentists}
                        getOptionValue={(dentist) => dentist.id}
                        getOptionLabel={(dentist) => {
                            const firstSpecialty = dentist.specialties
                                ?.split(",")
                                .map((specialty) => specialty.trim())
                                .filter(Boolean)[0];

                            return `${dentist.fullName} - ${firstSpecialty ?? "Sin especialidad"}`;
                        }}
                        placeholder={
                            isLoadingUsers
                                ? "Cargando especialistas..."
                                : "Seleccione un especialista"
                        }
                        searchPlaceholder="Buscar especialista por nombre..."
                        noResultsMessage="No se encontraron especialistas."
                        disabled={isLoadingUsers}
                        onChange={onDentistChange}
                    />
                </div>
                <div className="flex-1">
                    <SearchableSelect<string>
                        label="Especialidad"
                        value={form?.dentistSpeciality || ""}
                        items={dentistSpecialities}
                        getOptionValue={(speciality) => speciality}
                        getOptionLabel={(speciality) => speciality}
                        placeholder={
                            !form?.dentistId
                                ? "Seleccione primero un especialista"
                                : dentistSpecialities.length === 0
                                    ? "Sin especialidades registradas"
                                    : "Seleccione una especialidad"
                        }
                        searchPlaceholder="Buscar especialidad..."
                        noResultsMessage="No se encontraron especialidades."
                        disabled={
                            !form?.dentistId ||
                            dentistSpecialities.length === 0
                        }
                        onChange={onSpecialityChange}
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2 w-full">
                <div className="flex-1">
                    <DateTimePicker
                        label="Fecha y hora de inicio"
                        value={formatDateTimeForInput(form?.startAppointmentTime)}
                        onChange={(newValue) => onUpdateField("startAppointmentTime", newValue)}
                    />
                </div>
                <div className="flex-1">
                    <DateTimePicker
                        label="Fecha y hora de finalización"
                        value={formatDateTimeForInput(form?.endAppointmentTime)}
                        onChange={(newValue) => onUpdateField("endAppointmentTime", newValue)}
                    />
                </div>
            </div>
        </>
    );
};