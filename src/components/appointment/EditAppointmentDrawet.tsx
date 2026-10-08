import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import type Appointment from "../../models/AppointmentModel";
import type { UpdateAppointmentDTO } from "../../models/AppointmentModel";
import { usePatients } from "../../hooks/usePatients";
import { useUsers } from "../../hooks/useUsers";
import { roleNames, UserRole } from "../../hooks/useRolePermitions";
import { DateTimePicker } from "../../shared/DateTimePicker/DateTimePicker";
import SearchableSelect from "../../shared/searchableSelect/SearchableSelect";
import type PatientModel from "../../models/PatientModel";
import type UserModel from "../../models/UserModel";
import type TreatmentCatalogModel from "../../models/TreatmentCatalogModel";
import { useTreatments } from "../../hooks/useTreatmentsCatalog";
import type { TreatmentPlanDetailDto } from "../../models/TreatmentPlanDetailsModel";
import { useAppointmentOrchestratorById, useUpdateAppointmentOrchestrator } from "../../hooks/useAppointmentOrchestrator";
import { useCancelTreatmentPlanDetail, useCompleteTreatmentPlanDetail, useStartTreatmentPlanDetail } from "../../hooks/useTreatmentPlanDetails";
import { useMarkAsInvoiced } from "../../hooks/useAppointment";

interface TreatmentPlanDetailState extends TreatmentPlanDetailDto {
    id?: string;
    planId?: string;
}
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
            setSelectedTreatments([]);
            setTreatmentDetails([]);
            setDiagnoses([]);
            setAllergies([]);
            setSymptoms([]);
            setClinicalNotes([]);
            return;
        }

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

    if (
        appointmentDetails &&
        appointmentDetails !== prevAppointmentDetails
    ) {
        setPrevAppointmentDetails(appointmentDetails);

        const appointmentData = appointmentDetails.appointment;

        // ============================================================
        // TRATAMIENTO INDIVIDUAL
        // ============================================================

        // if (
        //     appointmentData.treatmentId &&
        //     appointmentDetails.treatment
        // ) {
        //     const treatment = appointmentDetails.treatment;

        //     setSelectedTreatments([
        //         treatment,
        //     ]);

        //     setTreatmentDetails([]);
        // }

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
        }

        // ============================================================
        // PLAN DE TRATAMIENTO
        // ============================================================

        else if (appointmentData.treatmentPlanId) {
            const details =
                appointmentDetails.treatmentPlanDetails ?? [];

            // Los detalles reales del plan
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

            // Convertimos cada detail al mismo modelo
            // que usa CreateAppointmentDrawer
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
        }

        // ============================================================
        // SIN TRATAMIENTO
        // ============================================================

        else {
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

    // const handleStartTreatment = (detailId?: string) => {
    //     if (!detailId) return;

    //     if (appointment?.status !== "IN_PROGRESS") {
    //         showToast(
    //             "error",
    //             "Para empezar el tratamiento , la cita debe estar marcada en progreso."
    //         );
    //         return;
    //     }

    //     startTreatmentPlanDetail(detailId, {
    //         onSuccess: () => {

    //             showToast(
    //                 "success",
    //                 "El tratamiento se inició correctamente."
    //             );
    //         },

    //         onError: (error) => {
    //             showToast(
    //                 "error",
    //                 error.message ||
    //                 "No se pudo iniciar el tratamiento."
    //             );
    //         },
    //     });
    // };

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

    // const handleCompleteTreatment = (detailId?: string) => {
    //     if (!detailId) return;

    //     completeTreatmentPlanDetail(detailId, {
    //         onSuccess: () => {

    //             showToast(
    //                 "success",
    //                 "El tratamiento se completó correctamente."
    //             );
    //         },

    //         onError: (error) => {
    //             showToast(
    //                 "error",
    //                 error.message ||
    //                 "No se pudo completar el tratamiento."
    //             );
    //         },
    //     });
    // };

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

    // const handleCancelTreatment = (detailId?: string) => {
    //     if (!detailId) return;

    //     cancelTreatmentPlanDetail(detailId, {
    //         onSuccess: () => {
    //             showToast(
    //                 "success",
    //                 "El tratamiento fue cancelado correctamente."
    //             );
    //         },

    //         onError: (error) => {
    //             showToast(
    //                 "error",
    //                 error.message ||
    //                 "No se pudo cancelar el tratamiento."
    //             );
    //         },
    //     });
    // };

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

    // const canMarkAsInvoiced = () => {
    //     if (!appointment) {
    //         return false;
    //     }

    //     // Ya está facturada
    //     if (appointment.isInvoiced) {
    //         return false;
    //     }

    //     // ============================================================
    //     // CITA SIN PLAN / TRATAMIENTO INDIVIDUAL
    //     // ============================================================

    //     if (!appointment.treatmentPlanId) {
    //         return (
    //             appointment.status === "COMPLETED" ||
    //             appointment.status === "CANCELLED"
    //         );
    //     }

    //     // ============================================================
    //     // PLAN DE TRATAMIENTO
    //     // ============================================================

    //     if (
    //         !treatmentDetails ||
    //         treatmentDetails.length === 0
    //     ) {
    //         return false;
    //     }

    //     // Todos los servicios deben estar COMPLETED o CANCELLED
    //     return treatmentDetails.every(
    //         (detail) =>
    //             detail.status === "COMPLETED" ||
    //             detail.status === "CANCELLED"
    //     );
    // };


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

    // const handleMarkAsInvoiced = () => {
    //     if (!appointment) {
    //         return;
    //     }

    //     if (!canMarkAsInvoiced()) {
    //         showToast(
    //             "error",
    //             "Todos los servicios deben estar completados o cancelados para marcar la cita como facturada."
    //         );
    //         return;
    //     }

    //     markAsInvoiced(appointment.id, {
    //         onSuccess: () => {
    //             showToast(
    //                 "success",
    //                 "La cita fue marcada como facturada correctamente."
    //             );

    //             onHide();
    //         },

    //         onError: (error) => {
    //             showToast(
    //                 "error",
    //                 error.message ||
    //                 "No se pudo marcar la cita como facturada."
    //             );
    //         },
    //     });
    // };


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
                onClick={handleCancel}
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
                onHide={handleCancel}
                title="Editar Cita"
                description="Modifica la información de la cita"
                width="w-80 md:w-200"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={handleCancel}
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
                                onChange={handleDentistChange}
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
                                onChange={(speciality) => {
                                    setForm((prev) => {
                                        if (!prev) return prev;

                                        return {
                                            ...prev,
                                            dentistSpeciality: speciality,
                                        };
                                    });
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2 w-full">
                        <div className="flex-1">
                            <DateTimePicker
                                label="Fecha y hora de inicio"
                                value={formatDateTimeForInput(form?.startAppointmentTime)}
                                onChange={(newValue) => updateField("startAppointmentTime", newValue)}
                            />
                        </div>
                        <div className="flex-1">
                            <DateTimePicker
                                label="Fecha y hora de finalización"
                                value={formatDateTimeForInput(form?.endAppointmentTime)}
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

                    {selectedTreatments.length > 0 && (
                        <div className="mt-3 space-y-2">

                            {selectedTreatments.map((treatment) => {
                                const detail = treatmentDetails.find(
                                    (item) =>
                                        String(item.treatmentId) ===
                                        String(treatment.id)
                                );

                                const status = detail?.status;

                                const isStarting =
                                    isStartingTreatment;

                                const isCompleting =
                                    isCompletingTreatment;

                                const isCanceling =
                                    isCancelingTreatment;

                                return (
                                    <div
                                        key={String(treatment.id)}
                                        className="
                                            flex
                                            flex-col
                                            md:flex-row
                                            md:items-center
                                            md:justify-between
                                            gap-3
                                            px-3
                                            py-3
                                            bg-slate-50
                                            border
                                            border-slate-200
                                            rounded-lg
                                        "
                                    >
                                        {/* INFORMACIÓN DEL TRATAMIENTO */}
                                        <div className="min-w-0 flex-1">

                                            <p className="text-sm font-medium text-slate-700">
                                                {treatment.name}
                                            </p>

                                            {treatment.description && (
                                                <p className="text-xs text-slate-400 truncate">
                                                    {treatment.description}
                                                </p>
                                            )}

                                            <div className="flex flex-wrap items-center gap-3 mt-1">

                                                <p className="text-xs text-slate-500">
                                                    C$ {Number(
                                                        detail?.unitPrice ??
                                                        treatment.basePrice
                                                    ).toFixed(2)}
                                                </p>

                                                {detail?.status && (
                                                    <span
                                                        className={`
                                                            px-2
                                                            py-0.5
                                                            rounded-full
                                                            text-xs
                                                            font-medium
                                                            ${detail.status === "PENDING"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : detail.status === "IN_PROGRESS"
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : detail.status === "COMPLETED"
                                                                        ? "bg-emerald-100 text-emerald-700"
                                                                        : "bg-red-100 text-red-700"
                                                            }
                                                        `}
                                                    >
                                                        {detail.status === "PENDING"
                                                            ? "Pendiente"
                                                            : detail.status === "IN_PROGRESS"
                                                                ? "En progreso"
                                                                : detail.status === "COMPLETED"
                                                                    ? "Completado"
                                                                    : "Abortado"}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* ACCIONES */}
                                        <div className="flex flex-wrap items-center gap-2">

                                            {/* PENDING -> IN_PROGRESS */}
                                            {status === "PENDING" && detail?.id && (
                                                <button
                                                    type="button"
                                                    disabled={
                                                        isStarting ||
                                                        isCompleting ||
                                                        isCanceling
                                                    }
                                                    onClick={() =>
                                                        handleStartTreatment(
                                                            detail.id
                                                        )
                                                    }
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
                                                        cursor-pointer
                                                        disabled:opacity-50
                                                        disabled:cursor-not-allowed
                                                    "
                                                >
                                                    {isStarting
                                                        ? "Iniciando..."
                                                        : "Comenzar servicio"}
                                                </button>
                                            )}

                                            {/* IN_PROGRESS -> COMPLETED */}
                                            {status === "IN_PROGRESS" && detail?.id && (
                                                <>
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isStarting ||
                                                            isCompleting ||
                                                            isCanceling
                                                        }
                                                        onClick={() =>
                                                            handleCompleteTreatment(
                                                                detail.id
                                                            )
                                                        }
                                                        className="
                                                            px-3
                                                            py-1.5
                                                            text-xs
                                                            font-medium
                                                            text-emerald-600
                                                            border
                                                            border-emerald-200
                                                            rounded-lg
                                                            hover:bg-emerald-50
                                                            cursor-pointer
                                                            disabled:opacity-50
                                                            disabled:cursor-not-allowed
                                                        "
                                                    >
                                                        {isCompleting
                                                            ? "Completando..."
                                                            : "Finalizar"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isStarting ||
                                                            isCompleting ||
                                                            isCanceling
                                                        }
                                                        onClick={() =>
                                                            handleCancelTreatment(
                                                                detail.id
                                                            )
                                                        }
                                                        className="
                                                            px-3
                                                            py-1.5
                                                            text-xs
                                                            font-medium
                                                            text-red-600
                                                            border
                                                            border-red-200
                                                            rounded-lg
                                                            hover:bg-red-50
                                                            cursor-pointer
                                                            disabled:opacity-50
                                                            disabled:cursor-not-allowed
                                                        "
                                                    >
                                                        {isCanceling
                                                            ? "Cancelando..."
                                                            : "Abortar"}
                                                    </button>
                                                </>
                                            )}

                                            {/* ELIMINAR DEL PLAN */}
                                            {!detail?.id &&
                                                status !== "COMPLETED" &&
                                                status !== "CANCELLED" && (
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isStarting ||
                                                            isCompleting ||
                                                            isCanceling
                                                        }
                                                        onClick={() =>
                                                            handleRemoveTreatment(
                                                                String(treatment.id)
                                                            )
                                                        }
                                                        className="
                        px-2.5
                        py-1.5
                        text-xs
                        text-red-500
                        border
                        border-red-200
                        rounded-lg
                        hover:bg-red-50
                        cursor-pointer
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "
                                                    >
                                                        Eliminar
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Mostramos el total */}
                    {selectedTreatments.length > 0 && (
                        <div className="mt-3 flex flex-col justify-end">
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
                                    <p className="text-lg font-semibold text-slate-700">
                                        C${" "}
                                        {selectedTreatments
                                            .reduce((total, treatment) => {
                                                const detail = treatmentDetails.find(
                                                    (item) =>
                                                        String(item.treatmentId) ===
                                                        String(treatment.id)
                                                );

                                                // Si el servicio está cancelado/abortado,
                                                // no se incluye en el total.
                                                if (detail?.status === "CANCELLED") {
                                                    return total;
                                                }

                                                return total + Number(
                                                    detail?.subtotal ?? treatment.basePrice
                                                );
                                            }, 0)
                                            .toFixed(2)}
                                    </p>
                                </p>
                            </div>
                            {canMarkAsInvoiced() && (
                                <button
                                    type="button"
                                    onClick={handleMarkAsInvoiced}
                                    disabled={
                                        isPending ||
                                        isMarkingAsInvoiced
                                    }
                                    className="
                                        px-4 py-2.5
                                        text-sm font-medium
                                        text-white
                                        bg-emerald-600
                                        hover:bg-emerald-700
                                        rounded-lg
                                        cursor-pointer
                                        disabled:opacity-50
                                        disabled:cursor-not-allowed
                                    "
                                >
                                    {isMarkingAsInvoiced
                                        ? "Generando..."
                                        : "Generar factura"}
                                </button>
                            )}
                        </div>
                    )}

                    {isLoadingAppointmentDetails && (
                        <div className="mt-3 flex justify-end  bg-gray-200 h-18
                                w-full
                                md:w-auto
                                min-w-64
                                px-4
                                py-3
                                rounded-lg
                                text-right">
                        </div>
                    )}

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Diagnósticos
                            </label>

                            {diagnoses.length === 0 && (
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
                            )}

                            {diagnoses.length === 1 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveDiagnosis()
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
                            )}
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
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Alergias
                            </label>

                            {allergies.length === 0 && (
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
                            )}

                            {allergies.length === 1 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveAllergy()
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
                            )}
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
                            {symptoms.length === 0 && (
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
                            )}

                            {symptoms.length === 1 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveSymptom()
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
                            )}

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

                            {clinicalNotes.length === 0 && (
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
                            )}

                            {clinicalNotes.length === 1 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveClinicalNote()
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
                            )}
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