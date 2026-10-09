import React, { useState } from "react";

import type Appointment from "../../models/AppointmentModel";

import type {
    CreateMedicalPrescriptionRequest,
} from "../../models/MedicalPrescriptionOrchestratorModel";

import type {
    MedicalPrescriptionDto,
} from "../../models/MedicalPrescriptionModel";

import type {
    MedicalPrescriptionDetailDto,
} from "../../models/MedicalPrescriptionDetailModel";

interface CreateMedicalPrescriptionDrawerProps {
    appointment: Appointment | null;
    onChange: (
        data: CreateMedicalPrescriptionRequest | null
    ) => void;
    onDiagnosisChange: (
        diagnosis: string
    ) => void;
    clinicalProgressId: string;
}

const MedicalPrescriptionSection: React.FC<
    CreateMedicalPrescriptionDrawerProps
> = ({
    appointment,
    onChange,
    onDiagnosisChange,
    clinicalProgressId
}) => {

        /*
         * =========================================================
         * FORMULARIO PRINCIPAL
         * =========================================================
         */

        const createEmptyForm = (): MedicalPrescriptionDto => ({
            clinicalProgressId: clinicalProgressId || "",
            patientId: appointment?.patientId || "",
            patientFullName: appointment?.patientFullName || "",
            dentistId: appointment?.dentistId || "",
            dentistFullName: appointment?.dentistFullName || "",
            date: appointment?.startAppointmentTime
                ? new Date(appointment.startAppointmentTime)
                : new Date(),
            generalInstructions: "",
        });

        const [diagnosis, setDiagnosis] =
            useState<string>(appointment?.diagnosis || "");

        const [form, setForm] =
            useState<MedicalPrescriptionDto>(
                createEmptyForm
            );

        /*
         * =========================================================
         * DETALLES
         * =========================================================
         */

        const [details, setDetails] =
            useState<MedicalPrescriptionDetailDto[]>([
                {
                    medicine: "",
                    dose: "",
                    frequency: "",
                    duration: "",
                },
            ]);


        const [prevAppointment, setPrevAppointment] =
            useState<Appointment | null>(appointment);

        if (appointment !== prevAppointment) {
            setPrevAppointment(appointment);

            const newForm: MedicalPrescriptionDto = {
                clinicalProgressId: clinicalProgressId || "",
                patientId: appointment?.patientId || "",
                patientFullName:
                    appointment?.patientFullName || "",
                dentistId: appointment?.dentistId || "",
                dentistFullName:
                    appointment?.dentistFullName || "",
                date: appointment?.startAppointmentTime
                    ? new Date(
                        appointment.startAppointmentTime
                    )
                    : new Date(),
                generalInstructions: "",
            };

            setForm(newForm);

            setDiagnosis( appointment?.diagnosis || "");
            // onDiagnosisChange("");

            setDetails([
                {
                    medicine: "",
                    dose: "",
                    frequency: "",
                    duration: "",
                },
            ]);

            onChange(null);
        }

        /*
         * =========================================================
         * ENVIAR DATOS AL PADRE
         * =========================================================
         */

        const updateParent = (
            newForm: MedicalPrescriptionDto,
            newDetails: MedicalPrescriptionDetailDto[]
        ) => {
            onChange({
                data: newForm,
                details: newDetails,
            });
        };

        const handleDiagnosisChange = (
            e: React.ChangeEvent<HTMLTextAreaElement>
        ) => {
            const value = e.target.value;

            setDiagnosis(value);

            onDiagnosisChange(value);
        };


        /*
         * =========================================================
         * CAMBIAR DATOS GENERALES
         * =========================================================
         */

        const handleChange = (
            e: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement
            >
        ) => {
            const {
                name,
                value,
            } = e.target;

            const newForm = {
                ...form,
                [name]: value,
            };

            setForm(newForm);

            updateParent(
                newForm,
                details
            );
        };

        /*
         * =========================================================
         * CAMBIAR DETALLE
         * =========================================================
         */

        const handleDetailChange = (
            index: number,
            field: keyof MedicalPrescriptionDetailDto,
            value: string
        ) => {
            const newDetails = details.map(
                (detail, detailIndex) =>
                    detailIndex === index
                        ? {
                            ...detail,
                            [field]: value,
                        }
                        : detail
            );

            setDetails(newDetails);

            updateParent(
                form,
                newDetails
            );
        };

        /*
         * =========================================================
         * AGREGAR MEDICAMENTO
         * =========================================================
         */

        const handleAddDetail = () => {
            const newDetails = [
                ...details,
                {
                    medicine: "",
                    dose: "",
                    frequency: "",
                    duration: "",
                },
            ];

            setDetails(newDetails);

            updateParent(
                form,
                newDetails
            );
        };

        /*
         * =========================================================
         * ELIMINAR MEDICAMENTO
         * =========================================================
         */

        const handleRemoveDetail = (
            index: number
        ) => {
            if (details.length === 1) {
                return;
            }

            const newDetails = details.filter(
                (_, detailIndex) =>
                    detailIndex !== index
            );

            setDetails(newDetails);

            updateParent(
                form,
                newDetails
            );
        };

        /*
         * =========================================================
         * RENDER
         * =========================================================
         */

        return (
            <div className="space-y-5">

                {/* =================================================
                DATOS DEL PACIENTE
            ================================================= */}

                <div>

                    <label className="
                    block
                    text-sm
                    font-medium
                    text-slate-700
                    mb-2
                ">
                        Paciente
                    </label>

                    <input
                        type="text"
                        value={form.patientFullName}
                        disabled
                        className="
                        w-full
                        px-3 py-2.5
                        border border-slate-200
                        rounded-lg
                        text-sm
                        bg-slate-50
                        text-slate-500
                        outline-none
                    "
                    />

                </div>

                {/* =================================================
                DENTISTA
            ================================================= */}

                <div>

                    <label className="
                    block
                    text-sm
                    font-medium
                    text-slate-700
                    mb-2
                ">
                        Dentista
                    </label>

                    <input
                        type="text"
                        value={form.dentistFullName}
                        disabled
                        className="
                        w-full
                        px-3 py-2.5
                        border border-slate-200
                        rounded-lg
                        text-sm
                        bg-slate-50
                        text-slate-500
                        outline-none
                    "
                    />

                </div>

                {/* =================================================
                FECHA
            ================================================= */}

                <div>

                    <label className="
                    block
                    text-sm
                    font-medium
                    text-slate-700
                    mb-2
                ">
                        Fecha
                    </label>

                    <input
                        type="text"
                        value={form.date.toLocaleString(
                            "es-NI",
                            {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            }
                        )}
                        disabled
                        className="
                        w-full
                        px-3 py-2.5
                        border border-slate-200
                        rounded-lg
                        text-sm
                        bg-slate-50
                        text-slate-500
                        outline-none
                    "
                    />

                </div>

                {/* =================================================
                    DIAGNÓSTICO
                ================================================= */}

                <div>

                    <label className="
                        block
                        text-sm
                        font-medium
                        text-slate-700
                        mb-2
                    ">
                        Diagnóstico *
                    </label>

                    <textarea
                        value={diagnosis}
                        onChange={handleDiagnosisChange}
                        placeholder="Ingrese el diagnóstico del paciente..."
                        rows={4}
                        className="
                            w-full
                            px-3 py-2.5
                            border border-slate-200
                            rounded-lg
                            text-sm
                            outline-none
                            resize-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-500/10
                        "
                    />

                </div>

                {/* =================================================
                INSTRUCCIONES GENERALES
            ================================================= */}

                <div>

                    <label className="
                    block
                    text-sm
                    font-medium
                    text-slate-700
                    mb-2
                ">
                        Instrucciones Generales
                    </label>

                    <textarea
                        name="generalInstructions"
                        value={
                            form.generalInstructions
                        }
                        onChange={handleChange}
                        placeholder="Ingrese las instrucciones generales para el paciente..."
                        rows={4}
                        className="
                            w-full
                            px-3 py-2.5
                            border border-slate-200
                            rounded-lg
                            text-sm
                            outline-none
                            resize-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-500/10
                        "
                    />

                </div>

                {/* =================================================
                MEDICAMENTOS
            ================================================= */}

                <div className="
                border-t
                border-slate-100
                pt-5
            ">

                    <div className="
                    flex
                    items-center
                    justify-between
                    mb-4
                ">

                        <div>

                            <h3 className="
                            text-sm
                            font-semibold
                            text-slate-800
                        ">
                                Medicamentos
                            </h3>

                            <p className="
                            text-xs
                            text-slate-500
                            mt-1
                        ">
                                Agrega los medicamentos
                                de la receta.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={handleAddDetail}
                            className="
                            px-3
                            py-2
                            text-xs
                            font-medium
                            text-blue-600
                            bg-blue-50
                            hover:bg-blue-100
                            rounded-lg
                            transition-colors
                            cursor-pointer
                        "
                        >
                            + Agregar
                        </button>

                    </div>

                    <div className="space-y-5">

                        {details.map(
                            (detail, index) => (

                                <div
                                    key={index}
                                    className="
                                    border
                                    border-slate-200
                                    rounded-xl
                                    p-4
                                    space-y-4
                                "
                                >

                                    {/* HEADER */}

                                    <div className="
                                    flex
                                    items-center
                                    justify-between
                                ">

                                        <span className="
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    ">
                                            Medicamento{" "}
                                            {index + 1}
                                        </span>

                                        {details.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveDetail(
                                                        index
                                                    )
                                                }
                                                className="
                                                text-xs
                                                font-medium
                                                text-rose-600
                                                hover:text-rose-700
                                                cursor-pointer
                                            "
                                            >
                                                Eliminar
                                            </button>
                                        )}

                                    </div>

                                    {/* MEDICAMENTO */}

                                    <div>

                                        <label className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        mb-2
                                    ">
                                            Medicamento
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                detail.medicine
                                            }
                                            onChange={(e) =>
                                                handleDetailChange(
                                                    index,
                                                    "medicine",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="
                                            Ej. Amoxicilina
                                        "
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

                                    {/* DOSIS */}

                                    <div>

                                        <label className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        mb-2
                                    ">
                                            Dosis
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                detail.dose
                                            }
                                            onChange={(e) =>
                                                handleDetailChange(
                                                    index,
                                                    "dose",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="
                                            Ej. 500 mg
                                        "
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

                                    {/* FRECUENCIA */}

                                    <div>

                                        <label className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        mb-2
                                    ">
                                            Frecuencia
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                detail.frequency
                                            }
                                            onChange={(e) =>
                                                handleDetailChange(
                                                    index,
                                                    "frequency",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="
                                            Ej. Cada 8 horas
                                        "
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

                                    {/* DURACIÓN */}

                                    <div>

                                        <label className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        mb-2
                                    ">
                                            Duración
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                detail.duration
                                            }
                                            onChange={(e) =>
                                                handleDetailChange(
                                                    index,
                                                    "duration",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="
                                            Ej. 7 días
                                        "
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

                                </div>
                            )
                        )}

                    </div>

                </div>

            </div>
        );
    };

export default MedicalPrescriptionSection;