import { useState } from "react";
import type { TreatmentPlanDetailDto } from "../../../models/TreatmentPlanDetailsModel";
import type Appointment from "../../../models/AppointmentModel";
import { useTreatments } from "../../../hooks/useTreatmentsCatalog";
import { useMarkAsInvoiced } from "../../../hooks/useAppointment";
import { useAppointmentOrchestratorById, useUpdateAppointmentOrchestrator } from "../../../hooks/useAppointmentOrchestrator";
import { useCancelTreatmentPlanDetail, useCompleteTreatmentPlanDetail, useStartTreatmentPlanDetail } from "../../../hooks/useTreatmentPlanDetails";
import { usePatients } from "../../../hooks/usePatients";
import { useUsers } from "../../../hooks/useUsers";
import { roleNames, UserRole } from "../../../hooks/useRolePermitions";
import type { UpdateAppointmentDTO } from "../../../models/AppointmentModel";
import type TreatmentCatalogModel from "../../../models/TreatmentCatalogModel";
import type PatientModel from "../../../models/PatientModel";
import type UserModel from "../../../models/UserModel";

export interface TreatmentPlanDetailState extends TreatmentPlanDetailDto {
    id?: string;
    planId?: string;
}

export const useEditAppointmentDrawer = (
    appointment: Appointment | null,
    onHide: () => void
) => {
    const {
        data: treatments = [],
        isLoading: isLoadingTreatments,
    } = useTreatments();

    const {
        mutate: markAsInvoiced,
        isPending: isMarkingAsInvoiced,
    } = useMarkAsInvoiced();

    const {
        mutate: updateAppointment,
        isPending,
    } = useUpdateAppointmentOrchestrator();

    const {
        mutate: startTreatmentPlanDetail,
        isPending: isStartingTreatment,
    } = useStartTreatmentPlanDetail();

    const {
        mutate: completeTreatmentPlanDetail,
        isPending: isCompletingTreatment,
    } = useCompleteTreatmentPlanDetail();

    const {
        mutate: cancelTreatmentPlanDetail,
        isPending: isCancelingTreatment,
    } = useCancelTreatmentPlanDetail();

    const {
        data: appointmentDetails,
        isLoading: isLoadingAppointmentDetails,
    } = useAppointmentOrchestratorById(
        appointment?.id || ""
    );

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
    const [prevAppointmentDetails, setPrevAppointmentDetails] =
        useState<typeof appointmentDetails | null>(null);
    const [form, setForm] = useState<UpdateAppointmentDTO | null>();
    const [dentistSpecialities, setDentistSpecialities] = useState<string[]>([]);

    const [selectedTreatments, setSelectedTreatments] = useState<
        TreatmentCatalogModel[]
    >([]);
    const [treatmentDetails, setTreatmentDetails] = useState<TreatmentPlanDetailState[]>([]);

    const [diagnoses, setDiagnoses] = useState<string[]>([]);
    const [allergies, setAllergies] = useState<string[]>([]);
    const [symptoms, setSymptoms] = useState<string[]>([]);
    const [clinicalNotes, setClinicalNotes] = useState<string[]>([]);

    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    if (appointment !== prevAppointment) {
        setPrevAppointment(appointment);

        if (!appointment) {
            setForm(null);
            setDentistSpecialities([]);
            // setSelectedTreatments([]);
            // setTreatmentDetails([]);
            setDiagnoses([]);
            setAllergies([]);
            setSymptoms([]);
            setClinicalNotes([]);
            // ELIMINADO: return; (Esto causaba que el hook retornara undefined)
        } else {
            setForm(appointment);

            const dentist = users.find(
                (user) =>
                    String(user.id) ===
                    String(appointment.dentistId)
            );

            const specialities =
                dentist?.specialties
                    ?.split(",")
                    .map((specialty) => specialty.trim())
                    .filter(Boolean) ?? [];

            setDentistSpecialities(specialities);

            setDiagnoses(
                appointment?.diagnosis?.trim()
                    ? [appointment.diagnosis]
                    : []
            );

            setAllergies(
                appointment?.allergies?.trim()
                    ? [appointment.allergies]
                    : []
            );

            setSymptoms(
                appointment?.symptoms?.trim()
                    ? [appointment.symptoms]
                    : []
            );

            setClinicalNotes(
                appointment?.clinicalNotes?.trim()
                    ? [appointment.clinicalNotes]
                    : []
            );
        }
    }

    if (
        appointmentDetails &&
        appointmentDetails !== prevAppointmentDetails
    ) {
        setPrevAppointmentDetails(appointmentDetails);

        const appointmentData = appointmentDetails.appointment;

        // ============================================================
        // TRATAMIENTO INDIVIDUAL
        // ============================================================
        if (appointmentData.treatmentId) {
            const treatmentIdStr = String(appointmentData.treatmentId);

            // Intentamos obtener el objeto del orquestador o del catálogo general
            const catalogTreatment =
                appointmentDetails.treatment ??
                treatments.find((t) => String(t.id) === treatmentIdStr);

            // Si aún no ha cargado el objeto completo del catálogo, construimos un objeto fallback con la info disponible
            const treatmentToUse: TreatmentCatalogModel = catalogTreatment ?? {
                id: treatmentIdStr,
                name: appointmentDetails.appointment.reason || "Tratamiento individual",
                description: "",
                basePrice: 0,
                estimatedDurationMinutes: 0,
                active: true,
            };

            // SIEMPRE poblamos los estados sin importar si el catálogo ya terminó de cargar o no
            setSelectedTreatments([treatmentToUse]);

            setTreatmentDetails((prevDetails) => {
                const existingVirtual = prevDetails.find(
                    (d) => String(d.treatmentId) === treatmentIdStr
                );

                return [
                    {
                        id: `virtual-${treatmentIdStr}`,
                        treatmentId: treatmentIdStr,
                        treatmentName: treatmentToUse.name,
                        quantity: 1,
                        unitPrice: Number(treatmentToUse.basePrice),
                        subtotal: Number(treatmentToUse.basePrice),
                        status: existingVirtual?.status ?? "PENDING",
                    },
                ];
            });
        }
        else if (appointmentData.treatmentPlanId) {
            const details =
                appointmentDetails.treatmentPlanDetails ?? [];

            setTreatmentDetails(
                details.map((detail) => ({
                    id: detail.id,
                    planId: detail.planId,
                    treatmentId: String(detail.treatmentId),
                    treatmentName: detail.treatmentName,
                    quantity: detail.quantity,
                    unitPrice: Number(detail.unitPrice),
                    subtotal: Number(detail.subtotal),
                    status: detail.status,
                }))
            );

            setSelectedTreatments(
                details.map((detail) => {
                    const catalogTreatment = treatments.find(
                        (treatment) =>
                            String(treatment.id) ===
                            String(detail.treatmentId)
                    );

                    if (catalogTreatment) {
                        return catalogTreatment;
                    }

                    return {
                        id: String(detail.treatmentId),
                        name: detail.treatmentName,
                        description: "",
                        basePrice: Number(detail.unitPrice),
                        estimatedDurationMinutes: 0,
                        active: true,
                    } as TreatmentCatalogModel;
                })
            );
        } else {
            setSelectedTreatments([]);
            setTreatmentDetails([]);
        }
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

    const handleDentistChange = (selectedDentist: UserModel | null) => {
        if (!selectedDentist) return;

        const selectedId = String(selectedDentist.id);

        const specialities =
            selectedDentist.specialties
                ?.split(",")
                .map((specialty) => specialty.trim())
                .filter(Boolean) ?? [];

        setDentistSpecialities(specialities);

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

    const handleAddTreatment = (
        treatment: TreatmentCatalogModel
    ) => {
        const treatmentId = String(treatment.id);

        // No permitir duplicados
        if (
            selectedTreatments.some(
                (item) => String(item.id) === treatmentId
            )
        ) {
            return;
        }

        /*
         * Si la cita originalmente tenía un solo tratamiento,
         * ese tratamiento no tenía TreatmentPlanDetail porque
         * era un tratamiento individual.
         *
         * Al agregar un segundo tratamiento, la cita pasa a ser
         * un PLAN DE TRATAMIENTO, por lo que debemos convertir
         * también el tratamiento original en un detail.
         */
        if (
            selectedTreatments.length === 1 &&
            treatmentDetails.length === 0
        ) {
            const originalTreatment = selectedTreatments[0];

            setTreatmentDetails([
                {
                    treatmentId: String(originalTreatment.id),
                    treatmentName: originalTreatment.name,
                    quantity: 1,
                    unitPrice: Number(originalTreatment.basePrice),
                    subtotal: Number(originalTreatment.basePrice),
                    status: "PENDING",
                },
                {
                    treatmentId,
                    treatmentName: treatment.name,
                    quantity: 1,
                    unitPrice: Number(treatment.basePrice),
                    subtotal: Number(treatment.basePrice),
                    status: "PENDING",
                },
            ]);

            setSelectedTreatments((prev) => [
                ...prev,
                treatment,
            ]);

            return;
        }

        /*
         * Caso normal:
         * ya estamos trabajando con un plan de tratamiento.
         */
        setSelectedTreatments((prev) => [
            ...prev,
            treatment,
        ]);

        setTreatmentDetails((prev) => [
            ...prev,
            {
                treatmentId,
                treatmentName: treatment.name,
                quantity: 1,
                unitPrice: Number(treatment.basePrice),
                subtotal: Number(treatment.basePrice),
                status: "PENDING",
            },
        ]);
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

    const restoreOriginalTreatments = () => {
        if (!appointmentDetails) return;

        const appointmentData = appointmentDetails.appointment;

        // ============================================================
        // TRATAMIENTO INDIVIDUAL
        // ============================================================

        if (
            appointmentData.treatmentId &&
            appointmentDetails.treatment
        ) {
            const treatment = appointmentDetails.treatment;

            setSelectedTreatments([
                treatment,
            ]);

            setTreatmentDetails([
                {
                    id: `virtual-${treatment.id}`,
                    treatmentId: String(treatment.id),
                    treatmentName: treatment.name,
                    quantity: 1,
                    unitPrice: Number(treatment.basePrice),
                    subtotal: Number(treatment.basePrice),
                    status: "PENDING",
                },
            ]);

            return;
        }

        // ============================================================
        // PLAN DE TRATAMIENTO
        // ============================================================

        if (appointmentData.treatmentPlanId) {
            const details =
                appointmentDetails.treatmentPlanDetails ?? [];

            setTreatmentDetails(
                details.map((detail) => ({
                    id: detail.id,
                    planId: detail.planId,
                    treatmentId: String(detail.treatmentId),
                    treatmentName: detail.treatmentName,
                    quantity: detail.quantity,
                    unitPrice: Number(detail.unitPrice),
                    subtotal: Number(detail.subtotal),
                    status: detail.status,
                }))
            );

            setSelectedTreatments(
                details.map((detail) => {
                    const catalogTreatment = treatments.find(
                        (treatment) =>
                            String(treatment.id) ===
                            String(detail.treatmentId)
                    );

                    if (catalogTreatment) {
                        return catalogTreatment;
                    }

                    return {
                        id: String(detail.treatmentId),
                        name: detail.treatmentName,
                        description: "",
                        basePrice: Number(detail.unitPrice),
                        estimatedDurationMinutes: 0,
                        active: true,
                    } as TreatmentCatalogModel;
                })
            );

            return;
        }

        // ============================================================
        // SIN TRATAMIENTO
        // ============================================================

        setSelectedTreatments([]);
        setTreatmentDetails([]);
    };

    const handleCancel = () => {
        restoreOriginalTreatments();

        // Fuerza a que los servicios se vuelvan a cargar
        // cuando se abra nuevamente el drawer.
        setPrevAppointmentDetails(null);
        onHide();
    };

    const handleTreatmentChange = (
        selectedTreatment: TreatmentCatalogModel
    ) => {
        handleAddTreatment(selectedTreatment);
    };

    const handleAddDiagnosis = () => {
        setDiagnoses([""]);
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

    const handleRemoveDiagnosis = () => {
        setDiagnoses([]);
    };

    const handleAddAllergy = () => {
        setAllergies([""]);
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

    const handleRemoveAllergy = () => {
        setAllergies([]);
    };

    const handleAddSymptom = () => {
        setSymptoms([""]);
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

    const handleRemoveSymptom = () => {
        setSymptoms([]);
    };

    const handleAddClinicalNote = () => {
        setClinicalNotes([""]);
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

    const handleRemoveClinicalNote = () => {
        setClinicalNotes([]);
    };

    const handleStartTreatment = (detailId?: string) => {
        if (!detailId) return;

        if (appointment?.status !== "IN_PROGRESS") {
            showToast(
                "error",
                "Para empezar el tratamiento, la cita debe estar marcada en progreso."
            );
            return;
        }

        // Tratamiento individual: solo cambia el estado local
        if (!appointment?.treatmentPlanId) {
            setTreatmentDetails((prev) =>
                prev.map((detail) =>
                    String(detail.id) === String(detailId)
                        ? {
                            ...detail,
                            status: "IN_PROGRESS",
                        }
                        : detail
                )
            );

            return;
        }

        // Treatment Plan real
        startTreatmentPlanDetail(detailId, {
            onSuccess: () => {
                showToast(
                    "success",
                    "El tratamiento se inició correctamente."
                );
            },

            onError: (error) => {
                showToast(
                    "error",
                    error.message ||
                    "No se pudo iniciar el tratamiento."
                );
            },
        });
    };

    const handleCompleteTreatment = (detailId?: string) => {
        if (!detailId) return;

        // Tratamiento individual: solo cambia el estado local
        if (!appointment?.treatmentPlanId) {
            setTreatmentDetails((prev) =>
                prev.map((detail) =>
                    String(detail.id) === String(detailId)
                        ? {
                            ...detail,
                            status: "COMPLETED",
                        }
                        : detail
                )
            );

            return;
        }

        // Treatment Plan real
        completeTreatmentPlanDetail(detailId, {
            onSuccess: () => {
                showToast(
                    "success",
                    "El tratamiento se completó correctamente."
                );
            },

            onError: (error) => {
                showToast(
                    "error",
                    error.message ||
                    "No se pudo completar el tratamiento."
                );
            },
        });
    };

    const handleCancelTreatment = (detailId?: string) => {
        if (!detailId) return;

        // Tratamiento individual: solo cambia el estado local
        if (!appointment?.treatmentPlanId) {
            setTreatmentDetails((prev) =>
                prev.map((detail) =>
                    String(detail.id) === String(detailId)
                        ? {
                            ...detail,
                            status: "CANCELLED",
                        }
                        : detail
                )
            );

            return;
        }

        // Treatment Plan real
        cancelTreatmentPlanDetail(detailId, {
            onSuccess: () => {
                showToast(
                    "success",
                    "El tratamiento fue cancelado correctamente."
                );
            },

            onError: (error) => {
                showToast(
                    "error",
                    error.message ||
                    "No se pudo cancelar el tratamiento."
                );
            },
        });
    };

    const canMarkAsInvoiced = () => {
        if (!appointment) {
            return false;
        }

        if (appointment.isInvoiced) {
            return false;
        }

        if (
            !treatmentDetails ||
            treatmentDetails.length === 0
        ) {
            return false;
        }

        return treatmentDetails.every(
            (detail) =>
                detail.status === "COMPLETED" ||
                detail.status === "CANCELLED"
        );
    };

    const handleMarkAsInvoiced = () => {
        if (!appointment) {
            return;
        }

        if (!canMarkAsInvoiced()) {
            showToast(
                "error",
                "Todos los servicios deben estar completados o cancelados para marcar la cita como facturada."
            );
            return;
        }

        markAsInvoiced(appointment.id, {
            onSuccess: () => {
                showToast(
                    "success",
                    "La cita fue marcada como facturada correctamente."
                );

                onHide();
            },

            onError: (error) => {
                showToast(
                    "error",
                    error.message ||
                    "No se pudo marcar la cita como facturada."
                );
            },
        });
    };

    const handleSubmit = () => {
        if (!appointment || !form) {
            return;
        }

        if (selectedTreatments.length === 0) {
            showToast(
                "error",
                "La cita debe tener al menos un servicio."
            );
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

        const cleanedDiagnoses = diagnoses
            .map((item) => item.trim())
            .filter(Boolean);

        const cleanedAllergies = allergies
            .map((item) => item.trim())
            .filter(Boolean);

        const cleanedSymptoms = symptoms
            .map((item) => item.trim())
            .filter(Boolean);

        const cleanedClinicalNotes = clinicalNotes
            .map((item) => item.trim())
            .filter(Boolean);

        const baseAppointment = {
            patientId: form.patientId.trim(),
            patientFullName: form.patientFullName.trim(),
            dentistId: form.dentistId.trim(),
            dentistFullName: form.dentistFullName.trim(),
            dentistSpeciality: form.dentistSpeciality.trim(),

            startAppointmentTime: startDate,
            endAppointmentTime: endDate,

            reason: form.reason.trim(),

            allergies: cleanedAllergies.join(", "),
            symptoms: cleanedSymptoms.join(", "),
            diagnosis: cleanedDiagnoses.join(", "),
            clinicalNotes: cleanedClinicalNotes.join(", "),

            isInvoiced: form.isInvoiced,
            isClinicalProgressRegistered: form.isClinicalProgressRegistered
        };

        // ============================================================
        // 1 TRATAMIENTO = TREATMENT ID
        // ============================================================

        if (selectedTreatments.length === 1) {
            const treatment = selectedTreatments[0];

            updateAppointment(
                {
                    id: appointment.id,
                    data: {
                        appointment: {
                            ...baseAppointment,
                            status: appointment.status,
                            treatmentId: String(treatment.id),
                            treatmentPlanId: undefined,
                            cancelationNotes: appointment.cancelationNotes,
                            reminderSent: appointment.reminderSent,
                        },
                        treatment: {
                            ...treatment
                        }
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

            return;
        }

        // ============================================================
        // MÁS DE 1 TRATAMIENTO = TREATMENT PLAN
        // ============================================================

        const totalAmount = treatmentDetails.reduce(
            (total, detail) => {
                if (detail.status === "CANCELLED") {
                    return total;
                }

                return total + Number(detail.subtotal);
            },
            0
        );

        updateAppointment(
            {
                id: appointment.id,
                data: {
                    appointment: {
                        ...baseAppointment,
                        status: appointment.status,
                        cancelationNotes: appointment.cancelationNotes,
                        reminderSent: appointment.reminderSent,
                        treatmentId: undefined,
                        treatmentPlanId:
                            appointmentDetails?.appointment.treatmentPlanId,
                    },
                    treatmentPlan: {
                        data: {
                            patientId: form.patientId.trim(),
                            patientFullName: form.patientFullName.trim(),
                            dentistId: form.dentistId.trim(),
                            dentistFullName: form.dentistFullName.trim(),
                            status:
                                appointmentDetails?.treatmentPlan?.status ||
                                "DRAFT",
                            totalAmount,
                            discount:
                                Number(
                                    appointmentDetails?.treatmentPlan?.discount
                                ) || 0,
                        },

                        details: treatmentDetails.map((detail) => ({
                            ...detail,
                            treatmentId: String(detail.treatmentId),
                            quantity: Number(detail.quantity),
                            unitPrice: Number(detail.unitPrice),
                            subtotal: Number(detail.subtotal),
                        })),
                    },
                }
            },
            {
                onSuccess: () => {
                    showToast(
                        "success",
                        "La cita y el plan de tratamiento se actualizaron correctamente."
                    );

                    handleCancel();
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
    return {
        // Estado local
        form,
        dentistSpecialities,
        selectedTreatments,
        treatmentDetails,
        diagnoses,
        allergies,
        symptoms,
        clinicalNotes,
        toast,
        setToast,
        // Datos reactivos de queries
        patients,
        isLoadingPatients,
        dentists,
        isLoadingUsers,
        treatments,
        isLoadingTreatments,
        appointmentDetails,
        isLoadingAppointmentDetails,
        // Estados de carga de mutaciones
        isPending,
        isStartingTreatment,
        isCompletingTreatment,
        isCancelingTreatment,
        isMarkingAsInvoiced,
        canMarkAsInvoiced,
        // Handlers de acción
        handlePatientChange,
        handleDentistChange,
        handleChange,
        updateField,
        handleTreatmentChange,
        handleRemoveTreatment,
        handleStartTreatment,
        handleCompleteTreatment,
        handleCancelTreatment,
        handleMarkAsInvoiced,
        handleCancel,
        handleSubmit,
        // Handlers de listas clínicas
        handleAddDiagnosis,
        handleDiagnosisChange,
        handleRemoveDiagnosis,
        handleAddAllergy,
        handleAllergyChange,
        handleRemoveAllergy,
        handleAddSymptom,
        handleSymptomChange,
        handleRemoveSymptom,
        handleAddClinicalNote,
        handleClinicalNoteChange,
        handleRemoveClinicalNote,
    };
};