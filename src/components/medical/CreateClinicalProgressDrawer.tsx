import React, { useState } from "react";

import GenericDrawer from "../../shared/drawer/GenericDrawer";
import Toast from "../../shared/Toast";

import type Appointment from "../../models/AppointmentModel";

import type {
    ClinicalProgresDto,
} from "../../models/ClinicalProgressModel";

import type {
    CreateMedicalPrescriptionRequest,
} from "../../models/MedicalPrescriptionOrchestratorModel";

import type {
    CreateDentalChartRequest,
} from "../../models/DentalChartOrchestratorModel";

import type {
    PatientAttachmentDto,
} from "../../models/PatientAttachmentModel";

import MedicalPrescriptionSection from "./MedicalPrescriptionSection";
import DentalChartSection from "./DentalChartSection";
import PatientAttachmentSection from "./PatientAttachmentSection";
import { useAddClinicalProgressOrchestrator } from "../../hooks/useClinicalProgressOrchestrator";
import { useMarkAsClinicalProgressRegistered } from "../../hooks/useAppointment";

interface CreateClinicalProgressDrawerProps {
    isOpen: boolean;
    onHide: () => void;
    appointment: Appointment | null;
}

const CreateClinicalProgressDrawer: React.FC<
    CreateClinicalProgressDrawerProps
> = ({
    isOpen,
    onHide,
    appointment,
}) => {
        const {
            mutateAsync: addClinicalProgressOrchestrator,
            isPending,
        } = useAddClinicalProgressOrchestrator();

        const {
            mutateAsync: markAsClinicalRegistered
        } = useMarkAsClinicalProgressRegistered();

        const [toast, setToast] = useState<{
            type: "success" | "error";
            message: string;
        } | null>(null);

        const [clinicalProgressId, setClinicalProgressId] =
            useState<string>("");

        const [clinicalProgress, setClinicalProgress] =
            useState<ClinicalProgresDto>({
                patientId: "",
                dateId: "",
                dentistId: "",
                diagnosis: "",
                treatmentId: "",
                treatmentPlanId: "",
                observations: "",
                registrationDate: new Date(),
            });

        const [medicalPrescription, setMedicalPrescription] =
            useState<CreateMedicalPrescriptionRequest | null>(
                null
            );

        const [dentalChart, setDentalChart] =
            useState<CreateDentalChartRequest | null>(
                null
            );

        const [patientAttachment, setPatientAttachment] =
            useState<PatientAttachmentDto | null>(
                null
            );

        const [prevAppointment, setPrevAppointment] =
            useState<Appointment | null>(appointment);

        if (appointment !== prevAppointment) {
            setPrevAppointment(appointment);

            setClinicalProgress(
                appointment
                    ? {
                        patientId: appointment.patientId,
                        dateId: appointment.id,
                        dentistId: appointment.dentistId,
                        diagnosis: appointment?.diagnosis || "",
                        treatmentId: appointment?.treatmentId || "",
                        treatmentPlanId: appointment?.treatmentPlanId || "",
                        observations: appointment?.clinicalNotes || "",
                        registrationDate: new Date(),
                    }
                    : {
                        patientId: "",
                        dateId: "",
                        dentistId: "",
                        diagnosis: "",
                        treatmentId: "",
                        treatmentPlanId: "",
                        observations: "",
                        registrationDate: new Date(),
                    }
            );
        }

        /*
         * =========================================================
         * TOAST
         * =========================================================
         */

        const showToast = (
            type: "success" | "error",
            message: string
        ) => {
            setToast({
                type,
                message,
            });
        };

        /*
         * =========================================================
         * LIMPIAR
         * =========================================================
         */

        const cleanForm = () => {
            setClinicalProgress({
                patientId: "",
                dateId: "",
                dentistId: "",
                diagnosis: "",
                treatmentId: "",
                treatmentPlanId: "",
                observations: "",
                registrationDate: new Date(),
            });

            setMedicalPrescription(null);
            setDentalChart(null);
            setPatientAttachment(null);
            setClinicalProgressId("");

            setToast(null);

            onHide();
        };

        /*
         * =========================================================
         * VALIDAR CLINICAL PROGRESS
         * =========================================================
         */

        const validateClinicalProgress = (): boolean => {
            if (!clinicalProgress.patientId) {
                showToast(
                    "error",
                    "No se encontró el paciente de la cita."
                );

                return false;
            }

            if (!clinicalProgress.dateId) {
                showToast(
                    "error",
                    "No se encontró la cita."
                );

                return false;
            }

            if (!clinicalProgress.dentistId) {
                showToast(
                    "error",
                    "No se encontró el dentista de la cita."
                );

                return false;
            }

            if (!clinicalProgress.diagnosis.trim()) {
                showToast(
                    "error",
                    "Debe ingresar el diagnóstico."
                );

                return false;
            }

            return true;
        };

        /*
         * =========================================================
         * VALIDAR SECCIONES OPCIONALES
         * =========================================================
         */

        const validateOptionalSections = (): boolean => {

            /*
             * RECETA
             */

            if (medicalPrescription) {
                if (
                    !medicalPrescription.data.generalInstructions.trim()
                ) {
                    showToast(
                        "error",
                        "Debe ingresar las instrucciones generales de la receta."
                    );

                    return false;
                }

                const invalidDetail =
                    medicalPrescription.details.some((detail) => {
                        const medicine = detail.medicine.trim();
                        const dose = detail.dose.trim();
                        const frequency = detail.frequency.trim();
                        const duration = detail.duration.trim();

                        // Si no se ha tocado ningún campo,
                        // esta fila se considera vacía y es válida.
                        const hasAnyValue =
                            medicine ||
                            dose ||
                            frequency ||
                            duration;

                        if (!hasAnyValue) {
                            return false;
                        }

                        // Si se llenó cualquier campo,
                        // todos los campos pasan a ser obligatorios.
                        return (
                            !medicine ||
                            !dose ||
                            !frequency ||
                            !duration
                        );
                    });

                if (invalidDetail) {
                    showToast(
                        "error",
                        "Si ingresa un medicamento, debe completar todos sus datos."
                    );

                    return false;
                }
            }
            /*
             * ODONTOGRAMA
             */

            if (dentalChart) {
                const invalidDetail =
                    dentalChart.details.some(
                        (detail) =>
                            !detail.toothNumber ||
                            !detail.face.trim() ||
                            !detail.toothStatus
                    );

                if (invalidDetail) {
                    showToast(
                        "error",
                        "Debe completar los datos de cada pieza dental."
                    );

                    return false;
                }
            }

            /*
             * ADJUNTO
             */

            if (patientAttachment) {
                if (!patientAttachment.fileType.trim()) {
                    showToast(
                        "error",
                        "Debe ingresar el tipo de archivo."
                    );

                    return false;
                }

                if (!patientAttachment.fileName.trim()) {
                    showToast(
                        "error",
                        "Debe ingresar el nombre del archivo."
                    );

                    return false;
                }

                if (!patientAttachment.fileUrl.trim()) {
                    showToast(
                        "error",
                        "Debe ingresar la URL del archivo."
                    );

                    return false;
                }

                if (!patientAttachment.uploadedBy.trim()) {
                    showToast(
                        "error",
                        "Debe ingresar quién subió el archivo."
                    );

                    return false;
                }
            }

            return true;
        };

        const handleSubmit = async () => {
            if (!validateClinicalProgress()) {
                return;
            }

            if (!validateOptionalSections()) {
                return;
            }

            if (!appointment?.id) {
                showToast(
                    "error",
                    "No se encontró el identificador de la cita."
                );
                return;
            }

            try {
                /*
                 * =====================================================
                 * CREAR TODO MEDIANTE EL ORCHESTRATOR
                 * =====================================================
                 */

                const result =
                    await addClinicalProgressOrchestrator({
                        clinicalProgress: {
                            patientId:
                                clinicalProgress.patientId,

                            dateId:
                                clinicalProgress.dateId,

                            dentistId:
                                clinicalProgress.dentistId,

                            diagnosis:
                                clinicalProgress.diagnosis.trim(),

                            ...(clinicalProgress.treatmentPlanId
                                ? {
                                    treatmentPlanId: clinicalProgress.treatmentPlanId,
                                }
                                : clinicalProgress.treatmentId
                                    ? {
                                        treatmentId: clinicalProgress.treatmentId,
                                    }
                                    : {}),
                            observations:
                                clinicalProgress.observations.trim(),

                            registrationDate:
                                clinicalProgress.registrationDate,
                        },

                        /*
                         * RECETA
                         *
                         * No se envía clinicalProgressId.
                         * El backend lo asigna.
                         */

                        ...(medicalPrescription && {
                            medicalPrescription: {
                                data: {
                                    ...medicalPrescription.data,
                                },
                                details:
                                    medicalPrescription.details,
                            },
                        }),

                        /*
                         * ODONTOGRAMA
                         *
                         * No se envía clinicalProgressId.
                         * El backend lo asigna.
                         */

                        ...(dentalChart && {
                            dentalChart: {
                                dentalChart: {
                                    ...dentalChart.dentalChart,
                                },
                                details:
                                    dentalChart.details,
                            },
                        }),

                        /*
                         * ADJUNTO
                         *
                         * No se envía clinicalProgressId.
                         * El backend lo asigna.
                         */

                        ...(patientAttachment && {
                            patientAttachment: {
                                ...patientAttachment,
                            },
                        }),
                    });

                /*
                 * =====================================================
                 * GUARDAR ID OBTENIDO
                 * =====================================================
                 */

                if (result?.clinicalProgress?.id) {
                    setClinicalProgressId(
                        result.clinicalProgress.id
                    );
                }

                /*
                 * =====================================================
                 * ÉXITO
                 * =====================================================
                 */

                showToast(
                    "success",
                    "El progreso clínico se creó correctamente."
                );

                await markAsClinicalRegistered(appointment.id);
                cleanForm();

            } catch (error) {
                showToast(
                    "error",
                    error instanceof Error
                        ? error.message
                        : "No se pudo crear el progreso clínico."
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
                    title="Nuevo Progreso Clínico"
                    description="Registra el progreso clínico de la cita"
                    width="w-80 md:w-150"
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
                                    ? "Guardando..."
                                    : "Guardar Progreso Clínico"}
                            </button>
                        </>
                    }
                >
                    <div className="space-y-6">

                        <MedicalPrescriptionSection
                            key={`prescription-${appointment?.id ?? "empty"}`}
                            appointment={appointment}
                            onChange={setMedicalPrescription}
                            onDiagnosisChange={(diagnosis) => {
                                setClinicalProgress((prev) => ({
                                    ...prev,
                                    diagnosis,
                                }));
                            }}
                            onObservationChange={(observations) => {
                                setClinicalProgress((prev) => ({
                                    ...prev,
                                    observations,
                                }));
                            }}
                            clinicalProgressId={clinicalProgressId}
                        />

                        <DentalChartSection
                            key={`dental-chart-${appointment?.id ?? "empty"}`}
                            appointment={appointment}
                            onChange={setDentalChart}
                            clinicalProgressId={clinicalProgressId}
                        />

                        <PatientAttachmentSection
                            key={`attachment-${appointment?.id ?? "empty"}`}
                            appointment={appointment}
                            onChange={setPatientAttachment}
                            clinicalProgressId={clinicalProgressId}
                        />
                    </div>
                </GenericDrawer>
            </>
        );
    };

export default CreateClinicalProgressDrawer;