import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import {
    useCreateTreatmentPlanOrchestrator
} from "../../hooks/useTreatmentPlanOrchestrator";
import type {
    TreatmentPlanDto
} from "../../models/TreatmentPlanModel";
import type {
    TreatmentPlanDetailDto
} from "../../models/TreatmentPlanDetailsModel";
import {
    useTreatments
} from "../../hooks/useTreatmentsCatalog";
import {
    usePatients
} from "../../hooks/usePatients";
import {
    useUsers
} from "../../hooks/useUsers";
import type { CreateTreatmentPlanRequest } from "../../models/TreatmentPlanOrchestratorModel";


interface CreateTreatmentPlanDrawerProps {
    isOpen: boolean;
    onHide: () => void;
}

const CreateTreatmentPlanDrawer: React.FC<
    CreateTreatmentPlanDrawerProps
> = ({
    isOpen,
    onHide
}) => {


        const {
            data: treatments = [],
            isLoading: isLoadingTreatments
        } = useTreatments();


        const {
            data: patients = [],
            isLoading: isLoadingPatients
        } = usePatients();


        const {
            data: users = [],
            isLoading: isLoadingUsers
        } = useUsers();


        // ============================================================
        // MUTATION
        // ============================================================

        const {
            mutate: addTreatmentPlan,
            isPending
        } = useCreateTreatmentPlanOrchestrator();


        // ============================================================
        // FORMULARIO PRINCIPAL
        // ============================================================

        const [form, setForm] =
            useState<TreatmentPlanDto>({
                patientId: "",
                patientFullName: "",
                dentistId: "",
                dentistFullName: "",
                status: "DRAFT",
                totalAmount: 0,
                discount: 0

            });


        // ============================================================
        // DETALLES
        // ============================================================

        const [details, setDetails] =
            useState<TreatmentPlanDetailDto[]>([
                {
                    treatmentId: "",
                    treatmentName: "",
                    toothNumber: 0,
                    quantity: 1,
                    unitPrice: 0,
                    subtotal: 0,
                    status: "PENDING"
                }

            ]);


        // ============================================================
        // TOAST
        // ============================================================

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
                message
            });

        };


        // ============================================================
        // LIMPIAR FORMULARIO
        // ============================================================

        const cleanForm = () => {
            setForm({
                patientId: "",
                patientFullName: "",
                dentistId: "",
                dentistFullName: "",
                status: "DRAFT",
                totalAmount: 0,
                discount: 0
            });


            setDetails([
                {
                    treatmentId: "",
                    treatmentName: "",
                    toothNumber: 0,
                    quantity: 1,
                    unitPrice: 0,
                    subtotal: 0,
                    status: "PENDING"
                }
            ]);

            onHide();
        };


        // ============================================================
        // SELECCIONAR PACIENTE
        // ============================================================

        const handlePatientChange = (
            e: React.ChangeEvent<HTMLSelectElement>
        ) => {

            const selectedId =
                e.target.value;


            const selectedPatient =
                patients.find(
                    (patient) =>
                        String(patient.id) === selectedId
                );


            setForm((prev) => ({

                ...prev,
                patientId: selectedId,
                patientFullName:
                    selectedPatient
                        ? `${selectedPatient.name} ${selectedPatient.lastName}`
                        : ""

            }));

        };


        // ============================================================
        // SELECCIONAR DENTISTA
        // ============================================================

        const handleDentistChange = (
            e: React.ChangeEvent<HTMLSelectElement>
        ) => {

            const selectedId =
                e.target.value;

            const selectedDentist =
                users.find(
                    (user) =>
                        String(user.id) === selectedId
                );

            setForm((prev) => ({
                ...prev,
                dentistId: selectedId,
                dentistFullName:
                    selectedDentist
                        ? selectedDentist.fullName
                        : ""

            }));

        };


        // ============================================================
        // CAMBIAR DATOS GENERALES
        // ============================================================

        const handleChange = (
            e: React.ChangeEvent<
                HTMLInputElement |
                HTMLSelectElement
            >
        ) => {

            const {
                name,
                value
            } = e.target;


            setForm((prev) => ({

                ...prev,

                [name]:
                    name === "discount"
                        ? Number(value)
                        : value

            }));

        };


        // ============================================================
        // SELECCIONAR TRATAMIENTO
        // ============================================================

        const handleTreatmentChange = (
            index: number,
            treatmentId: string
        ) => {
            const selectedTreatment = treatments.find(
                (treatment) =>
                    String(treatment.id) === treatmentId
            );

            setDetails((prev) =>
                prev.map((detail, detailIndex) => {
                    if (detailIndex !== index) {
                        return detail;
                    }

                    const unitPrice = selectedTreatment
                        ? Number(selectedTreatment.basePrice) || 0
                        : 0;

                    const treatmentName = selectedTreatment
                        ? selectedTreatment.name
                        : "";

                    const subtotal =
                        unitPrice *
                        Number(detail.quantity || 0);

                    return {
                        ...detail,
                        treatmentId,
                        treatmentName,
                        unitPrice,
                        subtotal,
                    };
                })
            );
        };


        // ============================================================
        // CAMBIAR DETALLE
        // ============================================================

        const handleDetailChange = (
            index: number,
            field: keyof TreatmentPlanDetailDto,
            value: string
        ) => {
            setDetails((prev) =>
                prev.map(
                    (detail, detailIndex) => {
                        if (detailIndex !== index) {
                            return detail;
                        }

                        const numericFields = [
                            "toothNumber",
                            "quantity",
                            "unitPrice",
                            "subtotal"
                        ];


                        const newValue =
                            numericFields.includes(field)
                                ? Number(value)
                                : value;


                        const updatedDetail = {

                            ...detail,

                            [field]: newValue

                        };


                        // ------------------------------------------------
                        // RECALCULAR SUBTOTAL
                        // ------------------------------------------------

                        if (
                            field === "quantity" ||
                            field === "unitPrice"
                        ) {

                            updatedDetail.subtotal =
                                Number(updatedDetail.quantity || 0) *
                                Number(updatedDetail.unitPrice || 0);

                        }


                        return updatedDetail;

                    }
                )

            );

        };


        // ============================================================
        // AGREGAR DETALLE
        // ============================================================

        const handleAddDetail = () => {

            setDetails((prev) => [

                ...prev,

                {

                    treatmentId: "",
                    treatmentName: "",

                    toothNumber: 0,

                    quantity: 1,

                    unitPrice: 0,

                    subtotal: 0,

                    status: "PENDING"

                }

            ]);

        };


        // ============================================================
        // ELIMINAR DETALLE
        // ============================================================

        const handleRemoveDetail = (
            index: number
        ) => {

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


        // ============================================================
        // CALCULAR TOTAL
        // ============================================================

        const calculateTotal = () => {

            return details.reduce(
                (total, detail) =>

                    total +
                    Number(detail.subtotal || 0),

                0
            );

        };

        // ============================================================
        // CALCULAR TOTAL FINAL CON DESCUENTO
        // ============================================================

        const calculateFinalTotal = () => {

            const total = calculateTotal();

            const discount = Number(form.discount || 0);

            return Math.max(
                0,
                total - discount
            );
        };


        // ============================================================
        // CREAR PLAN
        // ============================================================

        const handleSubmit = () => {

            // --------------------------------------------------------
            // VALIDAR PACIENTE
            // --------------------------------------------------------

            if (!form.patientId) {

                showToast(
                    "error",
                    "Debe seleccionar un paciente."
                );

                return;

            }


            // --------------------------------------------------------
            // VALIDAR DENTISTA
            // --------------------------------------------------------

            if (!form.dentistId) {

                showToast(
                    "error",
                    "Debe seleccionar un dentista."
                );

                return;

            }


            // --------------------------------------------------------
            // VALIDAR DETALLES
            // --------------------------------------------------------

            const invalidDetail =
                details.some(
                    (detail) =>

                        !detail.treatmentId ||

                        !detail.toothNumber ||

                        Number(detail.quantity) <= 0 ||

                        Number(detail.unitPrice) < 0

                );


            if (invalidDetail) {

                showToast(
                    "error",
                    "Debe completar correctamente todos los tratamientos."
                );

                return;

            }

            // --------------------------------------------------------
            // CALCULAR TOTAL NORMAL
            // --------------------------------------------------------

            const totalNormal = details.reduce(
                (total, detail) =>
                    total + Number(detail.subtotal || 0),
                0
            );


            // --------------------------------------------------------
            // DESCUENTO COMO MONTO FIJO
            // --------------------------------------------------------

            const discount = Math.max(
                0,
                Number(form.discount || 0)
            );


            // --------------------------------------------------------
            // TOTAL FINAL
            // --------------------------------------------------------

            const totalAmount = Math.max(
                0,
                totalNormal - discount
            );




            // --------------------------------------------------------
            // REQUEST
            // --------------------------------------------------------

            const request: CreateTreatmentPlanRequest = {

                patientId: form.patientId,
                patientFullName: form.patientFullName,
                dentistId: form.dentistId,
                dentistFullName: form.dentistFullName,
                status: form.status,
                totalAmount: totalAmount,
                discount: form.discount,
                details: details.map((detail) => ({
                    treatmentId: detail.treatmentId,
                    treatmentName: detail.treatmentName,
                    toothNumber: detail.toothNumber,
                    quantity: detail.quantity,
                    unitPrice: detail.unitPrice,
                    subtotal: detail.subtotal,
                    status: detail.status,
                })),
            };


            // --------------------------------------------------------
            // ENVIAR
            // --------------------------------------------------------

            addTreatmentPlan(
                request,
                {

                    onSuccess: () => {

                        showToast(
                            "success",
                            "El plan de tratamiento se creó correctamente."
                        );


                        cleanForm();

                    },


                    onError: (error) => {

                        showToast(
                            "error",
                            error.message ||
                            "No se pudo crear el plan de tratamiento."
                        );

                    }

                }
            );

        };


        // ============================================================
        // RENDER
        // ============================================================

        return (
            <>
                {toast && (

                    <Toast
                        type={toast.type}
                        message={toast.message}
                        onClose={() =>
                            setToast(null)
                        }
                    />

                )}

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
                    onHide={cleanForm}
                    title="Nuevo Plan de Tratamiento"
                    description="Registra un nuevo plan de tratamiento"
                    width="w-112.5"
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
                                    : "Crear Plan"}
                            </button>

                        </>

                    }
                >

                    {/* =================================================
                    BODY
                ================================================= */}

                    <div className="space-y-5">


                        {/* =================================================
                        PACIENTE
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


                            <select
                                name="patientId"
                                value={form.patientId}
                                onChange={handlePatientChange}
                                disabled={isLoadingPatients}
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
                                disabled:bg-slate-50
                                disabled:cursor-not-allowed
                            "
                            >

                                <option value="">

                                    {isLoadingPatients
                                        ? "Cargando pacientes..."
                                        : "Seleccione un paciente"}

                                </option>


                                {patients.map((patient) => (

                                    <option
                                        key={patient.id}
                                        value={patient.id}
                                    >
                                        {patient.name}{" "}
                                        {patient.lastName}
                                    </option>

                                ))}

                            </select>

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


                            <select
                                name="dentistId"
                                value={form.dentistId}
                                onChange={handleDentistChange}
                                disabled={isLoadingUsers}
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
                                disabled:bg-slate-50
                                disabled:cursor-not-allowed
                            "
                            >

                                <option value="">

                                    {isLoadingUsers
                                        ? "Cargando dentistas..."
                                        : "Seleccione un dentista"}

                                </option>


                                {users.map((dentist) => (

                                    <option
                                        key={dentist.id}
                                        value={dentist.id}
                                    >
                                        {dentist.fullName}
                                    </option>

                                ))}

                            </select>

                        </div>

                        {/* =================================================
                        DESCUENTO
                    ================================================= */}

                        <div>

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-slate-700
                                mb-2
                            ">
                                Descuento de C$
                            </label>


                            <input
                                type="number"
                                name="discount"
                                value={form.discount}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="0"
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


                        {/* =================================================
                        TRATAMIENTOS
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
                                        Tratamientos
                                    </h3>


                                    <p className="
                                    text-xs
                                    text-slate-500
                                    mt-1
                                ">
                                        Agrega los tratamientos del plan.
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
                            LISTA
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
                                                    Tratamiento {index + 1}
                                                </span>


                                                {details.length > 1 && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveDetail(index)
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


                                            {/* =================================================
                                            TRATAMIENTO
                                        ================================================= */}

                                            <div>

                                                <label className="
                                                block
                                                text-sm
                                                font-medium
                                                text-slate-700
                                                mb-2
                                            ">
                                                    Tratamiento
                                                </label>


                                                <select
                                                    value={detail.treatmentId}
                                                    onChange={(e) =>
                                                        handleTreatmentChange(
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={isLoadingTreatments}
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
                                                    disabled:bg-slate-50
                                                    disabled:cursor-not-allowed
                                                "
                                                >

                                                    <option value="">

                                                        {isLoadingTreatments
                                                            ? "Cargando tratamientos..."
                                                            : "Seleccione un tratamiento"}

                                                    </option>


                                                    {treatments.map(
                                                        (treatment) => (

                                                            <option
                                                                key={treatment.id}
                                                                value={treatment.id}
                                                            >
                                                                {treatment.name}
                                                            </option>

                                                        )
                                                    )}

                                                </select>

                                            </div>


                                            {/* =================================================
                                            NÚMERO DE DIENTE
                                        ================================================= */}

                                            <div>

                                                <label className="
                                                block
                                                text-sm
                                                font-medium
                                                text-slate-700
                                                mb-2
                                            ">
                                                    Número de diente
                                                </label>


                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="99"
                                                    value={
                                                        detail.toothNumber || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleDetailChange(
                                                            index,
                                                            "toothNumber",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Ej. 11"
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


                                            {/* =================================================
                                            CANTIDAD
                                        ================================================= */}

                                            <div>

                                                <label className="
                                                block
                                                text-sm
                                                font-medium
                                                text-slate-700
                                                mb-2
                                            ">
                                                    Cantidad
                                                </label>


                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={
                                                        detail.quantity || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleDetailChange(
                                                            index,
                                                            "quantity",
                                                            e.target.value
                                                        )
                                                    }
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


                                            {/* =================================================
                                            PRECIO UNITARIO
                                        ================================================= */}

                                            <div>

                                                <label className="
                                                block
                                                text-sm
                                                font-medium
                                                text-slate-700
                                                mb-2
                                            ">
                                                    Precio unitario
                                                </label>


                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={
                                                        detail.unitPrice
                                                    }
                                                    disabled
                                                    onChange={(e) =>
                                                        handleDetailChange(
                                                            index,
                                                            "unitPrice",
                                                            e.target.value
                                                        )
                                                    }
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
                                            SUBTOTAL
                                        ================================================= */}

                                            <div>

                                                <label className="
                                                block
                                                text-sm
                                                font-medium
                                                text-slate-700
                                                mb-2
                                            ">
                                                    Subtotal
                                                </label>


                                                <input
                                                    type="number"
                                                    value={
                                                        detail.subtotal
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

                                        </div>

                                    )
                                )}

                            </div>

                        </div>


                        {/* =================================================
                        TOTAL
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
                        ">

                                <span className="
                                text-sm
                                font-semibold
                                text-slate-700
                            ">
                                    Total
                                </span>


                                <span className="
                                text-lg
                                font-bold
                                text-[#001D4A]
                            ">
                                    C$ {calculateFinalTotal().toFixed(2)}

                                </span>

                            </div>

                        </div>

                    </div>

                </GenericDrawer>

            </>

        );

    };


export default CreateTreatmentPlanDrawer;