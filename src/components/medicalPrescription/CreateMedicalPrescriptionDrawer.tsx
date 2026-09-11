import React, { useState } from "react";

import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";

import type AppointmentModel from "../../models/AppointmentModel";

import {
    useCreateMedicalPrescriptionOrchestrator,
} from "../../hooks/useMedicalPrescriptionOrchestrator";

import type {
    CreateMedicalPrescriptionRequest,
} from "../../models/MedicalPrescriptionOrchestratorModel";
import type Appointment from "../../models/AppointmentModel";
import type { MedicalPrescriptionDto } from "../../models/MedicalPrescriptionModel";
import type { MedicalPrescriptionDetailDto } from "../../models/MedicalPrescriptionDetailModel";


interface CreateMedicalPrescriptionDrawerProps {
    isOpen: boolean;
    onHide: () => void;
    appointment: AppointmentModel | null;
}


/* =========================================================
   COMPONENTE
   ========================================================= */

const CreateMedicalPrescriptionDrawer: React.FC<
    CreateMedicalPrescriptionDrawerProps
> = ({
    isOpen,
    onHide,
    appointment,
}) => {

        const [prevAppointment, setPrevAppointment] = useState<Appointment | null>(appointment);
        /* =========================================================
           MUTATION
           ========================================================= */

        const {
            mutate: addMedicalPrescription,
            isPending,
        } = useCreateMedicalPrescriptionOrchestrator();


        /* =========================================================
           FORMULARIO PRINCIPAL
           ========================================================= */

        const [form, setForm] =
            useState<MedicalPrescriptionDto>({
                patientId: "",
                patientFullName: "",
                dentistId: "",
                dentistFullName: "",
                date: new Date(),
                generalInstructions: "",
            });


        /* =========================================================
           DETALLES DE LA RECETA
    
           Puede crecer indefinidamente:
           medicamento 1
           medicamento 2
           medicamento 3
           ...
           ========================================================= */

        const [details, setDetails] =
            useState<MedicalPrescriptionDetailDto[]>([
                {
                    medicine: "",
                    dose: "",
                    frequency: "",
                    duration: "",
                },
            ]);


        /* =========================================================
           TOAST
           ========================================================= */

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


        /* =========================================================
           CARGAR DATOS DE LA CITA
    
           La cita proporciona:
    
           - patientId
           - patientFullName
           - dentistId
           - dentistFullName
           - fecha
    
           El usuario solamente debe rellenar:
           - generalInstructions
           - medicines
           ========================================================= */

        if (appointment !== prevAppointment) {
            setPrevAppointment(appointment);
            setForm({
                patientId: appointment?.patientId || "",
                patientFullName: appointment?.patientFullName || "",
                dentistId: appointment?.dentistId || "",
                dentistFullName: appointment?.dentistFullName || "",
                date: appointment?.startAppointmentTime
                    ? new Date(appointment.startAppointmentTime)
                    : new Date(),
                generalInstructions: "",
            });
        }

        /* =========================================================
           LIMPIAR FORMULARIO
           ========================================================= */

        const cleanForm = () => {

            setForm({
                patientId: "",
                patientFullName: "",
                dentistId: "",
                dentistFullName: "",
                date: new Date(),
                generalInstructions: "",
            });

            setDetails([
                {
                    medicine: "",
                    dose: "",
                    frequency: "",
                    duration: "",
                },
            ]);

            onHide();
        };


        /* =========================================================
           CAMBIAR DATOS GENERALES
           ========================================================= */

        const handleChange = (
            e: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement
            >
        ) => {

            const {
                name,
                value,
            } = e.target;

            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        };


        /* =========================================================
           CAMBIAR DETALLE DE RECETA
           ========================================================= */

        const handleDetailChange = (
            index: number,
            field: keyof MedicalPrescriptionDetailDto,
            value: string
        ) => {

            setDetails((prev) =>
                prev.map((detail, detailIndex) =>
                    detailIndex === index
                        ? {
                            ...detail,
                            [field]: value,
                        }
                        : detail
                )
            );
        };


        /* =========================================================
           AGREGAR MEDICAMENTO
           ========================================================= */

        const handleAddDetail = () => {

            setDetails((prev) => [
                ...prev,
                {
                    medicine: "",
                    dose: "",
                    frequency: "",
                    duration: "",
                },
            ]);
        };


        /* =========================================================
           ELIMINAR MEDICAMENTO
           ========================================================= */

        const handleRemoveDetail = (
            index: number
        ) => {

            /*
             * No permitimos que la lista quede vacía.
             * Siempre debe existir al menos un medicamento.
             */

            if (details.length === 1) {
                return;
            }

            setDetails((prev) =>
                prev.filter(
                    (_, detailIndex) =>
                        detailIndex !== index
                )
            );
        };


        /* =========================================================
           CREAR RECETA
           ========================================================= */

        const handleSubmit = () => {

            /* -----------------------------------------------------
               VALIDAR DATOS PRINCIPALES
               ----------------------------------------------------- */

            if (!form.patientId) {
                showToast(
                    "error",
                    "No se encontró el paciente de la cita."
                );

                return;
            }

            if (!form.dentistId) {
                showToast(
                    "error",
                    "No se encontró el dentista de la cita."
                );

                return;
            }


            if (!form.generalInstructions.trim()) {
                showToast(
                    "error",
                    "Debe ingresar las instrucciones generales."
                );

                return;
            }


            /* -----------------------------------------------------
               VALIDAR MEDICAMENTOS
               ----------------------------------------------------- */

            const invalidDetail = details.some(
                (detail) =>
                    !detail.medicine.trim() ||
                    !detail.dose.trim() ||
                    !detail.frequency.trim() ||
                    !detail.duration.trim()
            );

            if (invalidDetail) {
                showToast(
                    "error",
                    "Debe completar todos los datos de cada medicamento."
                );

                return;
            }


            /* -----------------------------------------------------
               CONSTRUIR REQUEST
    
               Esto coincide con:
    
               {
                   data: MedicalPrescriptionDto,
                   details: MedicalPrescriptionDetailDto[]
               }
               ----------------------------------------------------- */

            const request: CreateMedicalPrescriptionRequest = {

                data: {
                    patientId: form.patientId,

                    patientFullName:
                        form.patientFullName,

                    dentistId: form.dentistId,

                    dentistFullName:
                        form.dentistFullName,

                    date: form.date,

                    generalInstructions:
                        form.generalInstructions.trim(),
                },

                details: details.map((detail) => ({
                    medicine:
                        detail.medicine.trim(),

                    dose:
                        detail.dose.trim(),

                    frequency:
                        detail.frequency.trim(),

                    duration:
                        detail.duration.trim(),
                })),
            };


            /* -----------------------------------------------------
               ENVIAR
               ----------------------------------------------------- */

            addMedicalPrescription(
                request,
                {
                    onSuccess: () => {

                        showToast(
                            "success",
                            "La receta médica se creó correctamente."
                        );

                        cleanForm();
                    },

                    onError: (error) => {

                        showToast(
                            "error",
                            error.message ||
                            "No se pudo crear la receta médica."
                        );
                    },
                }
            );
        };


        /* =========================================================
           RENDER
           ========================================================= */

        return (
            <>
                {/* =================================================
                TOAST
                ================================================= */}

                {toast && (
                    <Toast
                        type={toast.type}
                        message={toast.message}
                        onClose={() =>
                            setToast(null)
                        }
                    />
                )}


                {/* =================================================
                OVERLAY
                ================================================= */}

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


                {/* =================================================
                DRAWER
                ================================================= */}

                <GenericDrawer
                    isOpen={isOpen}
                    onHide={onHide}
                    title="Nueva Receta Médica"
                    description="Registra la receta médica de la cita"
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
                                    : "Crear Receta"}
                            </button>
                        </>
                    }
                >

                    {/* =================================================
                    BODY
                    ================================================= */}

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
                                value={
                                    form.date.toLocaleString(
                                        "es-NI",
                                        {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }
                                    )
                                }
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
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/10
                                resize-none
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
                                        Agrega los medicamentos de la receta.
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


                            {/* =================================================
                            LISTA DINÁMICA
                            ================================================= */}

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

                                            {/* ---------------------------------
                                            HEADER
                                           --------------------------------- */}

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
                                                    Medicamento {index + 1}
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


                                            {/* ---------------------------------
                                            MEDICINA
                                           --------------------------------- */}

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
                                                    placeholder="Ej. Amoxicilina"
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


                                            {/* ---------------------------------
                                            DOSIS
                                           --------------------------------- */}

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
                                                    placeholder="Ej. 500 mg"
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


                                            {/* ---------------------------------
                                            FRECUENCIA
                                           --------------------------------- */}

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
                                                    placeholder="Ej. Cada 8 horas"
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


                                            {/* ---------------------------------
                                            DURACIÓN
                                           --------------------------------- */}

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
                                                    placeholder="Ej. 7 días"
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

                </GenericDrawer>
            </>
        );
    };


export default CreateMedicalPrescriptionDrawer;