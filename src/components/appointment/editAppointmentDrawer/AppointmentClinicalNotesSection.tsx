import React from "react";
import { DynamicListInput } from "../../../shared/dynamicListInput/DynamicListInput";

interface AppointmentClinicalNotesSectionProps {
    diagnoses: string[];
    allergies: string[];
    symptoms: string[];
    clinicalNotes: string[];
    reason: string;
    onAddDiagnosis: () => void;
    onDiagnosisChange: (index: number, value: string) => void;
    onRemoveDiagnosis: () => void;
    onAddAllergy: () => void;
    onAllergyChange: (index: number, value: string) => void;
    onRemoveAllergy: () => void;
    onAddSymptom: () => void;
    onSymptomChange: (index: number, value: string) => void;
    onRemoveSymptom: () => void;
    onAddClinicalNote: () => void;
    onClinicalNoteChange: (index: number, value: string) => void;
    onRemoveClinicalNote: () => void;
    onReasonChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const AppointmentClinicalNotesSection: React.FC<AppointmentClinicalNotesSectionProps> = ({
    diagnoses,
    allergies,
    symptoms,
    clinicalNotes,
    reason,
    onAddDiagnosis,
    onDiagnosisChange,
    onRemoveDiagnosis,
    onAddAllergy,
    onAllergyChange,
    onRemoveAllergy,
    onAddSymptom,
    onSymptomChange,
    onRemoveSymptom,
    onAddClinicalNote,
    onClinicalNoteChange,
    onRemoveClinicalNote,
    onReasonChange,
}) => {
    return (
        <>
            <DynamicListInput
                label="Diagnósticos"
                items={diagnoses}
                addLabel="+ Agregar diagnóstico"
                placeholderPrefix="Diagnóstico"
                minHeightClass="min-h-24"
                onAdd={onAddDiagnosis}
                onChange={onDiagnosisChange}
                onRemove={onRemoveDiagnosis}
            />

            <DynamicListInput
                label="Alergias"
                items={allergies}
                addLabel="+ Agregar alergia"
                placeholderPrefix="Alergia"
                minHeightClass="min-h-20"
                onAdd={onAddAllergy}
                onChange={onAllergyChange}
                onRemove={onRemoveAllergy}
            />

            <DynamicListInput
                label="Síntomas"
                items={symptoms}
                addLabel="+ Agregar síntoma"
                placeholderPrefix="Síntoma"
                minHeightClass="min-h-20"
                onAdd={onAddSymptom}
                onChange={onSymptomChange}
                onRemove={onRemoveSymptom}
            />

            <DynamicListInput
                label="Notas clínicas"
                items={clinicalNotes}
                addLabel="+ Agregar nota"
                placeholderPrefix="Nota clínica"
                minHeightClass="min-h-24"
                onAdd={onAddClinicalNote}
                onChange={onClinicalNoteChange}
                onRemove={onRemoveClinicalNote}
            />

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Razón</label>
                <textarea
                    name="reason"
                    value={reason}
                    onChange={onReasonChange}
                    placeholder="Ingrese una razón de la cita"
                    className="w-full min-h-50 px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
            </div>
        </>
    );
};