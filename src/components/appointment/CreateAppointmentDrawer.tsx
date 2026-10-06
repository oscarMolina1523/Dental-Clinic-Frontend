import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import type { AppointmentStatus } from "../../utils/appointmentStatus.enum";
import { usePatients } from "../../hooks/usePatients";
import { useUsers } from "../../hooks/useUsers";
import { roleNames, UserRole } from "../../hooks/useRolePermitions";
import { DateTimePicker } from "../../shared/DateTimePicker/DateTimePicker";
import SearchableSelect from "../../shared/searchableSelect/SearchableSelect";
import type PatientModel from "../../models/PatientModel";
import type UserModel from "../../models/UserModel";
import { useTreatments } from "../../hooks/useTreatmentsCatalog";
import { useAddAppointmentOrchestrator } from "../../hooks/useAppointmentOrchestrator";
import type TreatmentCatalogModel from "../../models/TreatmentCatalogModel";
import type { TreatmentPlanDetailDto } from "../../models/TreatmentPlanDetailsModel";

interface CreateAppointmentProps {
    isOpen: boolean;
    onHide: () => void;
}

const CreateAppointmentDrawer: React.FC<CreateAppointmentProps> = ({ isOpen, onHide }) => {
    const { mutate: addAppointment, isPending } = useAddAppointmentOrchestrator();
    const {
        data: treatments = [],
        isLoading: isLoadingTreatments,
    } = useTreatments();

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

    const [selectedTreatments, setSelectedTreatments] = useState<
        TreatmentCatalogModel[]
    >([]);
    const [dentistSpecialities, setDentistSpecialities] = useState<string[]>([]);

    const [treatmentDetails, setTreatmentDetails] = useState<TreatmentPlanDetailDto[]>([]);

    const [diagnoses, setDiagnoses] = useState<string[]>([]);
    const [allergies, setAllergies] = useState<string[]>([]);
    const [symptoms, setSymptoms] = useState<string[]>([]);
    const [clinicalNotes, setClinicalNotes] = useState<string[]>([]);

    const [form, setForm] = useState<{
        patientId: string;
        patientFullName: string;
        dentistId: string;
        dentistFullName: string;
        dentistSpeciality: string;

        treatmentPlanId?: string;
        treatmentId?: string;

        allergies?: string;
        symptoms?: string;
        diagnosis?: string;
        clinicalNotes?: string;

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
        dentistSpeciality: "",

        treatmentPlanId: "",
        treatmentId: "",
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
            dentistSpeciality: "",

            treatmentPlanId: "",
            treatmentId: "",
            startAppointmentTime: new Date().toISOString().slice(0, 16),
            endAppointmentTime: new Date().toISOString().slice(0, 16),
            reason: "",
            status: "SCHEDULED",
            cancelationNotes: "",
            reminderSent: false,
        });

        setSelectedTreatments([]);
        setTreatmentDetails([]);
        setDiagnoses([]);
        setAllergies([]);
        setSymptoms([]);
        setClinicalNotes([]);

        onHide();
    };

    const handlePatientChange = (selectedPatient: PatientModel) => {
        const selectedId = String(selectedPatient.id);

        setForm((prev) => ({
            ...prev,
            patientId: selectedId,
            patientFullName: selectedPatient
                ? `${selectedPatient.name} ${selectedPatient.lastName}`
                : "",
        }));
    };

    const handleDentistChange = (selectedDentist: UserModel) => {
        const selectedId = String(selectedDentist.id);

        const specialities =
            selectedDentist.specialties
                ?.split(",")
                .map((specialty) => specialty.trim())
                .filter(Boolean) ?? [];

        setDentistSpecialities(specialities);

        setForm((prev) => ({
            ...prev,
            dentistId: selectedId,
            dentistFullName: selectedDentist.fullName,
            dentistSpeciality: "",
        }));
    };

    const handleAddTreatment = (
        treatment: TreatmentCatalogModel
    ) => {
        const treatmentId = String(treatment.id);

        setSelectedTreatments((prev) => {
            const alreadyExists = prev.some(
                (item) => String(item.id) === treatmentId
            );

            if (alreadyExists) {
                return prev;
            }

            return [...prev, treatment];
        });

        setTreatmentDetails((prev) => {
            const alreadyExists = prev.some(
                (detail) => String(detail.treatmentId) === treatmentId
            );

            if (alreadyExists) {
                return prev;
            }

            return [
                ...prev,
                {
                    treatmentId,
                    treatmentName: treatment.name,
                    quantity: 1,
                    unitPrice: Number(treatment.basePrice),
                    subtotal: Number(treatment.basePrice),
                    status: "PENDING",
                },
            ];
        });
    };

    const handleRemoveTreatment = (treatmentId: string) => {
        setSelectedTreatments((prev) =>
            prev.filter(
                (treatment) =>
                    String(treatment.id) !== String(treatmentId)
            )
        );

        setTreatmentDetails((prev) =>
            prev.filter(
                (detail) =>
                    String(detail.treatmentId) !== String(treatmentId)
            )
        );
    };

    const handleTreatmentChange = (
        selectedTreatment: TreatmentCatalogModel
    ) => {
        handleAddTreatment(selectedTreatment);
    };

    const handleAddDiagnosis = () => {
        setDiagnoses((prev) => [
            ...prev,
            "",
        ]);
    };

    const handleDiagnosisChange = (
        index: number,
        value: string
    ) => {
        setDiagnoses((prev) =>
            prev.map((diagnosis, i) =>
                i === index
                    ? value
                    : diagnosis
            )
        );
    };

    const handleRemoveDiagnosis = (
        index: number
    ) => {
        setDiagnoses((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const handleAddAllergy = () => {
        setAllergies((prev) => [
            ...prev,
            "",
        ]);
    };

    const handleAllergyChange = (
        index: number,
        value: string
    ) => {
        setAllergies((prev) =>
            prev.map((allergy, i) =>
                i === index
                    ? value
                    : allergy
            )
        );
    };

    const handleRemoveAllergy = (
        index: number
    ) => {
        setAllergies((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const handleAddSymptom = () => {
        setSymptoms((prev) => [
            ...prev,
            "",
        ]);
    };

    const handleSymptomChange = (
        index: number,
        value: string
    ) => {
        setSymptoms((prev) =>
            prev.map((symptom, i) =>
                i === index
                    ? value
                    : symptom
            )
        );
    };

    const handleRemoveSymptom = (
        index: number
    ) => {
        setSymptoms((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const handleAddClinicalNote = () => {
        setClinicalNotes((prev) => [
            ...prev,
            "",
        ]);
    };

    const handleClinicalNoteChange = (
        index: number,
        value: string
    ) => {
        setClinicalNotes((prev) =>
            prev.map((note, i) =>
                i === index
                    ? value
                    : note
            )
        );
    };

    const handleRemoveClinicalNote = (
        index: number
    ) => {
        setClinicalNotes((prev) =>
            prev.filter((_, i) => i !== index)
        );
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

    const updateField = (name: keyof typeof form, value: string | boolean) => {
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
        const dentistSpeciality = form.dentistSpeciality.trim();

        const startAppointmentTime = form.startAppointmentTime;
        const endAppointmentTime = form.endAppointmentTime;

        const reason = form.reason.trim();
        const status = form.status;
        const cancelationNotes = form.cancelationNotes.trim();
        const reminderSent = form.reminderSent;

        // ============================================================
        // VALIDACIONES
        // ============================================================

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

        if (!dentistSpeciality) {
            showToast(
                "error",
                "El dentista seleccionado no tiene una especialidad registrada."
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

        // ============================================================
        // DIAGNÓSTICOS
        // ============================================================

        const cleanedDiagnoses = diagnoses
            .map((diagnosis) => diagnosis.trim())
            .filter(Boolean);

        const diagnosis = cleanedDiagnoses.join(", ");

        const cleanedAllergies = allergies
            .map((allergy) => allergy.trim())
            .filter(Boolean);

        const cleanedSymptoms = symptoms
            .map((symptom) => symptom.trim())
            .filter(Boolean);

        const cleanedClinicalNotes = clinicalNotes
            .map((note) => note.trim())
            .filter(Boolean);

        // ============================================================
        // APPOINTMENT BASE
        // ============================================================

        const appointmentData = {
            patientId,
            patientFullName,

            dentistId,
            dentistFullName,
            dentistSpeciality,

            startAppointmentTime: new Date(startAppointmentTime),
            endAppointmentTime: new Date(endAppointmentTime),

            reason,
            status,
            cancelationNotes,
            reminderSent,

            allergies: cleanedAllergies.join(", "),
            symptoms: cleanedSymptoms.join(", "),
            diagnosis: diagnosis || "",
            clinicalNotes: cleanedClinicalNotes.join(", "),
        };

        // ============================================================
        // 0 TRATAMIENTOS
        // ============================================================

        if (selectedTreatments.length === 0) {
            addAppointment(
                {
                    appointment: appointmentData,
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

            return;
        }

        // ============================================================
        // 1 TRATAMIENTO
        // ============================================================

        if (selectedTreatments.length === 1) {
            const treatment = selectedTreatments[0];

            addAppointment(
                {
                    appointment: {
                        ...appointmentData,

                        // El tratamiento YA existe en catálogo.
                        // Solo enviamos su ID.
                        treatmentId: String(treatment.id),
                    },
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

            return;
        }

        const treatmentPlanDetails: TreatmentPlanDetailDto[] =
            selectedTreatments.map((treatment) => {
                const treatmentId = String(treatment.id);
                const detail = treatmentDetails.find(
                    (detail) =>
                        String(detail.treatmentId) === treatmentId
                );

                const quantity = 1;
                const unitPrice = Number(
                    detail?.unitPrice ?? treatment.basePrice
                );

                return {
                    treatmentId,
                    treatmentName: treatment.name,
                    quantity,
                    unitPrice,
                    subtotal: quantity * unitPrice,
                    status: "PENDING",
                };
            });

        const totalAmount = treatmentPlanDetails.reduce(
            (total, detail) =>
                total + Number(detail.subtotal),
            0
        );

        addAppointment(
            {
                appointment: appointmentData,

                treatmentPlan: {
                    data: {
                        patientId,
                        patientFullName,
                        dentistId,
                        dentistFullName,
                        status: "DRAFT",
                        totalAmount,
                        discount: 0,
                    },

                    details: treatmentPlanDetails,
                },
            },
            {
                onSuccess: () => {
                    showToast(
                        "success",
                        "La cita y el plan de tratamiento se crearon correctamente."
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
                                : "Crear Cita"}
                        </button>
                    </>
                }
            >
                {/* BODY DEL CREATE */}
                <div className="space-y-5">
                    <div className="flex flex-col md:flex-row gap-2 w-full">
                        <div className="flex-1">
                            <SearchableSelect<PatientModel>
                                label="Pacientes"
                                value={form.patientId}
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
                        <div className="flex-1">
                            <SearchableSelect<UserModel>
                                label="Especialistas"
                                value={form.dentistId}
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
                                onChange={handleDentistChange}
                            />
                        </div>
                        <div className="flex-1">
                            <SearchableSelect<string>
                                label="Especialidad"
                                value={form.dentistSpeciality}
                                items={dentistSpecialities}
                                getOptionValue={(speciality) => speciality}
                                getOptionLabel={(speciality) => speciality}
                                placeholder={
                                    !form.dentistId
                                        ? "Seleccione primero un especialista"
                                        : dentistSpecialities.length === 0
                                            ? "Sin especialidades registradas"
                                            : "Seleccione una especialidad"
                                }
                                searchPlaceholder="Buscar especialidad..."
                                noResultsMessage="No se encontraron especialidades."
                                disabled={
                                    !form.dentistId ||
                                    dentistSpecialities.length === 0
                                }
                                onChange={(speciality) => {
                                    setForm((prev) => ({
                                        ...prev,
                                        dentistSpeciality: speciality,
                                    }));
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 w-full">
                        <div className="flex-1">
                            <DateTimePicker
                                label="Fecha y hora de inicio"
                                value={form.startAppointmentTime}
                                onChange={(newValue) => updateField("startAppointmentTime", newValue)}
                            />
                        </div>
                        <div className="flex-1">
                            <DateTimePicker
                                label="Fecha y hora de finalización"
                                value={form.endAppointmentTime}
                                onChange={(newValue) => updateField("endAppointmentTime", newValue)}
                            />
                        </div>
                    </div>
                    <div>
                        <SearchableSelect<TreatmentCatalogModel>
                            label="servicios"
                            value={""}
                            items={treatments}
                            getOptionValue={(treatment) => treatment.id}
                            getOptionLabel={(treatment) =>
                                `${treatment.name} - ${treatment.description}`
                            }
                            placeholder={
                                isLoadingTreatments
                                    ? "Cargando servicios..."
                                    : "Seleccione un servicio"
                            }
                            searchPlaceholder="Buscar servicio por nombre..."
                            noResultsMessage="No se encontraron servicios."
                            disabled={isLoadingTreatments}
                            onChange={handleTreatmentChange}
                        />
                    </div>

                    {/* Mostramos cada servicio seleccionado */}
                    {selectedTreatments.length > 0 && (
                        <div className="mt-3 space-y-2">
                            {selectedTreatments.map((treatment) => (
                                <div
                                    key={String(treatment.id)}
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                        px-3
                                        py-2
                                        bg-slate-50
                                        border
                                        border-slate-200
                                        rounded-lg
                                    "
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-700">
                                            {treatment.name}
                                        </p>

                                        {treatment.description && (
                                            <p className="text-xs text-slate-400 truncate">
                                                {treatment.description}
                                            </p>
                                        )}

                                        <p className="text-xs text-slate-500 mt-1">
                                            C$ {Number(treatment.basePrice).toFixed(2)}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveTreatment(String(treatment.id))
                                        }
                                        className="
                                            shrink-0
                                            px-2.5
                                            py-1.5
                                            text-xs
                                            text-red-500
                                            border
                                            border-red-200
                                            rounded-lg
                                            hover:bg-red-50
                                            cursor-pointer
                                        "
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Mostramos el total */}
                    {selectedTreatments.length > 0 && (
                        <div className="mt-3 flex justify-end">
                            <div
                                className="
                                w-full
                                md:w-auto
                                min-w-64
                                px-4
                                py-3
                                rounded-lg
                                text-right
                            "
                            >
                                <p className="text-xs text-slate-400">
                                    Total
                                </p>

                                <p className="text-lg font-semibold text-slate-700">
                                    C${" "}
                                    {selectedTreatments
                                        .reduce(
                                            (total, treatment) =>
                                                total + Number(treatment.basePrice),
                                            0
                                        )
                                        .toFixed(2)}
                                </p>
                            </div>
                        </div>
                    )}

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Diagnósticos
                            </label>

                            <button
                                type="button"
                                onClick={handleAddDiagnosis}
                                className="
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-medium
                                    text-blue-600
                                    border
                                    border-blue-200
                                    rounded-lg
                                    hover:bg-blue-50
                                    transition-colors
                                    cursor-pointer
                                "
                            >
                                + Agregar diagnóstico
                            </button>
                        </div>

                        <div className="space-y-3">
                            {diagnoses.map((diagnosis, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-2"
                                >
                                    <textarea
                                        value={diagnosis}
                                        onChange={(e) =>
                                            handleDiagnosisChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        placeholder={`Diagnóstico ${index + 1}`}
                                        className="
                                            flex-1
                                            min-h-24
                                            px-3
                                            py-2.5
                                            border
                                            border-slate-200
                                            rounded-lg
                                            text-sm
                                            outline-none
                                            focus:border-blue-500
                                            focus:ring-2
                                            focus:ring-blue-500/10
                                        "
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveDiagnosis(index)
                                        }
                                        className="
                                            px-3
                                            py-2
                                            text-xs
                                            text-red-500
                                            border
                                            border-red-200
                                            rounded-lg
                                            hover:bg-red-50
                                            cursor-pointer
                                        "
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Alergias
                            </label>

                            <button
                                type="button"
                                onClick={handleAddAllergy}
                                className="
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-medium
                                    text-blue-600
                                    border
                                    border-blue-200
                                    rounded-lg
                                    hover:bg-blue-50
                                    transition-colors
                                    cursor-pointer
                                "
                            >
                                + Agregar alergia
                            </button>
                        </div>

                        {allergies.length > 0 && (
                            <div className="space-y-3">
                                {allergies.map((allergy, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-2"
                                    >
                                        <textarea
                                            value={allergy}
                                            onChange={(e) =>
                                                handleAllergyChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            placeholder={`Alergia ${index + 1}`}
                                            className="
                                                flex-1
                                                min-h-20
                                                px-3
                                                py-2.5
                                                border
                                                border-slate-200
                                                rounded-lg
                                                text-sm
                                                outline-none
                                                focus:border-blue-500
                                                focus:ring-2
                                                focus:ring-blue-500/10
                                            "
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveAllergy(index)
                                            }
                                            className="
                            px-3
                            py-2
                            text-xs
                            text-red-500
                            border
                            border-red-200
                            rounded-lg
                            hover:bg-red-50
                            cursor-pointer
                        "
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Síntomas
                            </label>

                            <button
                                type="button"
                                onClick={handleAddSymptom}
                                className="
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-medium
                                    text-blue-600
                                    border
                                    border-blue-200
                                    rounded-lg
                                    hover:bg-blue-50
                                    transition-colors
                                    cursor-pointer
                                "
                            >
                                + Agregar síntoma
                            </button>
                        </div>

                        {symptoms.length > 0 && (
                            <div className="space-y-3">
                                {symptoms.map((symptom, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-2"
                                    >
                                        <textarea
                                            value={symptom}
                                            onChange={(e) =>
                                                handleSymptomChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            placeholder={`Síntoma ${index + 1}`}
                                            className="
                                                flex-1
                                                min-h-20
                                                px-3
                                                py-2.5
                                                border
                                                border-slate-200
                                                rounded-lg
                                                text-sm
                                                outline-none
                                                focus:border-blue-500
                                                focus:ring-2
                                                focus:ring-blue-500/10
                                            "
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveSymptom(index)
                                            }
                                            className="
                                                px-3
                                                py-2
                                                text-xs
                                                text-red-500
                                                border
                                                border-red-200
                                                rounded-lg
                                                hover:bg-red-50
                                                cursor-pointer
                                            "
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Notas clínicas
                            </label>

                            <button
                                type="button"
                                onClick={handleAddClinicalNote}
                                className="
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-medium
                                    text-blue-600
                                    border
                                    border-blue-200
                                    rounded-lg
                                    hover:bg-blue-50
                                    transition-colors
                                    cursor-pointer
                                "
                            >
                                + Agregar nota
                            </button>
                        </div>

                        {clinicalNotes.length > 0 && (
                            <div className="space-y-3">
                                {clinicalNotes.map((note, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-2"
                                    >
                                        <textarea
                                            value={note}
                                            onChange={(e) =>
                                                handleClinicalNoteChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            placeholder={`Nota clínica ${index + 1}`}
                                            className="
                                                flex-1
                                                min-h-24
                                                px-3
                                                py-2.5
                                                border
                                                border-slate-200
                                                rounded-lg
                                                text-sm
                                                outline-none
                                                focus:border-blue-500
                                                focus:ring-2
                                                focus:ring-blue-500/10
                                            "
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveClinicalNote(index)
                                            }
                                            className="
                                                px-3
                                                py-2
                                                text-xs
                                                text-red-500
                                                border
                                                border-red-200
                                                rounded-lg
                                                hover:bg-red-50
                                                cursor-pointer
                                            "
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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