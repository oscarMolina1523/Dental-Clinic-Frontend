import React from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import type Appointment from "../../models/AppointmentModel";
import type { TreatmentPlanDetailDto } from "../../models/TreatmentPlanDetailsModel";
import { AppointmentGeneralInfo } from "./editAppointmentDrawer/AppointmentGeneralInfo";
import { AppointmentClinicalNotesSection } from "./editAppointmentDrawer/AppointmentClinicalNotesSection";
import { AppointmentServicesSection } from "./editAppointmentDrawer/AppointmentServiceSection";
import { useEditAppointmentDrawer } from "./editAppointmentDrawer/useEditAppointmentDrawer";

export interface TreatmentPlanDetailState extends TreatmentPlanDetailDto {
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
        patients,
        isLoadingPatients,
        dentists,
        isLoadingUsers,
        treatments,
        isLoadingTreatments,
        isLoadingAppointmentDetails,
        isPending,
        isStartingTreatment,
        isCompletingTreatment,
        isCancelingTreatment,
        isMarkingAsInvoiced,
        canMarkAsInvoiced,
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
    } = useEditAppointmentDrawer(appointment, onHide);

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
                    <AppointmentGeneralInfo
                        form={form}
                        patients={patients}
                        isLoadingPatients={isLoadingPatients}
                        dentists={dentists}
                        isLoadingUsers={isLoadingUsers}
                        dentistSpecialities={dentistSpecialities}
                        onPatientChange={handlePatientChange}
                        onDentistChange={handleDentistChange}
                        onSpecialityChange={(speciality) => updateField("dentistSpeciality", speciality)}
                        onUpdateField={updateField}
                    />

                    <AppointmentServicesSection
                        treatments={treatments}
                        isLoadingTreatments={isLoadingTreatments}
                        selectedTreatments={selectedTreatments}
                        treatmentDetails={treatmentDetails}
                        isLoadingAppointmentDetails={isLoadingAppointmentDetails}
                        isStartingTreatment={isStartingTreatment}
                        isCompletingTreatment={isCompletingTreatment}
                        isCancelingTreatment={isCancelingTreatment}
                        isPending={isPending}
                        isMarkingAsInvoiced={isMarkingAsInvoiced}
                        canMarkAsInvoiced={canMarkAsInvoiced()}
                        onTreatmentChange={handleTreatmentChange}
                        onStartTreatment={handleStartTreatment}
                        onCompleteTreatment={handleCompleteTreatment}
                        onCancelTreatment={handleCancelTreatment}
                        onRemoveTreatment={handleRemoveTreatment}
                        onMarkAsInvoiced={handleMarkAsInvoiced}
                    />

                    <AppointmentClinicalNotesSection
                        diagnoses={diagnoses}
                        allergies={allergies}
                        symptoms={symptoms}
                        clinicalNotes={clinicalNotes}
                        reason={form?.reason || ""}
                        onAddDiagnosis={handleAddDiagnosis}
                        onDiagnosisChange={handleDiagnosisChange}
                        onRemoveDiagnosis={handleRemoveDiagnosis}
                        onAddAllergy={handleAddAllergy}
                        onAllergyChange={handleAllergyChange}
                        onRemoveAllergy={handleRemoveAllergy}
                        onAddSymptom={handleAddSymptom}
                        onSymptomChange={handleSymptomChange}
                        onRemoveSymptom={handleRemoveSymptom}
                        onAddClinicalNote={handleAddClinicalNote}
                        onClinicalNoteChange={handleClinicalNoteChange}
                        onRemoveClinicalNote={handleRemoveClinicalNote}
                        onReasonChange={handleChange}
                    />
                </div>
            </GenericDrawer>
        </>
    );
};

export default EditAppointmentDrawer;