import React, { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  FileText,
  Image,
  Pill,
  Stethoscope,
  X,
} from "lucide-react";

import type PatientModel from "../../models/PatientModel";
import {
  useClinicalProgressOrchestratorByPatientId,
} from "../../hooks/useClinicalProgressOrchestrator";
import { dentalChartStatusSpanishOptions } from "../../utils/dentalChartStatus.enum";

interface ClinicalProgressDrawerProps {
  isOpen: boolean;
  onHide: () => void;
  patient: PatientModel | null;
}

const ShowClinicalProgressDrawer: React.FC<
  ClinicalProgressDrawerProps
> = ({
  isOpen,
  onHide,
  patient,
}) => {
    const [openProgressId, setOpenProgressId] =
      useState<string | null>(null);

    const {
      data: clinicalProgresses = [],
      isLoading,
      isError,
      error,
    } = useClinicalProgressOrchestratorByPatientId(
      patient?.id ?? ""
    );

    if (!isOpen) {
      return null;
    }

    const getFullName = () => {
      if (!patient) return "";

      return `${patient.name} ${patient.lastName}`;
    };

    const toggleProgress = (id: string) => {
      setOpenProgressId((prev) =>
        prev === id ? null : id
      );
    };

    const formatDate = (
      date: string | Date | null | undefined
    ) => {
      if (!date) return "N/A";

      return new Date(date).toLocaleString("es-NI", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return (
      <div
        className="
        fixed
        inset-0
        z-50
        flex
        justify-end
      "
      >
        {/* Overlay */}
        <div
          className="
          absolute
          inset-0
          bg-black/30
        "
          onClick={onHide}
        />

        {/* Drawer */}
        <div
          className="
          relative
          z-10
          h-full
          w-full
          max-w-3xl
          bg-white
          shadow-2xl
          flex
          flex-col
          animate-in
          slide-in-from-right
          duration-300
        "
        >

          {/* Header */}
          <div
            className="
            flex
            items-center
            justify-between
            px-6
            py-5
            border-b
            border-slate-200
            shrink-0
            bg-[#001D4A]
            text-white
          "
          >
            <div>
              <h2 className="text-lg font-bold">
                Expediente clínico
              </h2>

              {patient && (
                <p className="text-sm mt-1">
                  {getFullName()}
                </p>
              )}

              {patient?.idCard && (
                <p className="text-xs mt-0.5">
                  Cédula: {patient.idCard}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onHide}
              className="
              w-9
              h-9
              flex
              items-center
              justify-center
              rounded-lg
              text-slate-400
              hover:text-slate-700
              hover:bg-slate-100
              transition-colors
              cursor-pointer
            "
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-sm text-slate-500">
                  Cargando expediente clínico...
                </div>
              </div>
            )}

            {/* Error */}
            {isError && (
              <div
                className="
                rounded-xl
                border
                border-rose-200
                bg-rose-50
                p-4
                text-sm
                text-rose-600
              "
              >
                {error?.message ??
                  "No se pudo cargar el expediente clínico."}
              </div>
            )}

            {/* Sin registros */}
            {!isLoading &&
              !isError &&
              clinicalProgresses.length === 0 && (
                <div
                  className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  py-20
                  text-center
                "
                >
                  <FileText
                    className="w-12 h-12 text-slate-300 mb-3"
                  />

                  <p className="text-sm font-medium text-slate-600">
                    No hay progresos clínicos
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Este paciente todavía no tiene registros
                    clínicos.
                  </p>
                </div>
              )}

            {/* Clinical Progresses */}
            {!isLoading &&
              !isError &&
              clinicalProgresses.length > 0 && (
                <div className="space-y-3">

                  <div className="mb-5">
                    <h3 className="text-sm font-semibold text-slate-700">
                      Historial clínico
                    </h3>

                    <p className="text-xs text-slate-400 mt-1">
                      {clinicalProgresses.length}{" "}
                      {clinicalProgresses.length === 1
                        ? "registro"
                        : "registros"}{" "}
                      clínicos
                    </p>
                  </div>

                  {clinicalProgresses.map(
                    (item, index) => {
                      const progressId =
                        item.clinicalProgress.id;

                      const isOpen =
                        openProgressId === progressId;

                      return (
                        <div
                          key={progressId}
                          className="
                          border
                          border-slate-200
                          rounded-xl
                          overflow-hidden
                          bg-white
                        "
                        >

                          {/* Accordion header */}
                          <button
                            type="button"
                            onClick={() =>
                              toggleProgress(progressId)
                            }
                            className="
                            w-full
                            flex
                            items-center
                            justify-between
                            px-5
                            py-4
                            text-left
                            hover:bg-slate-50
                            transition-colors
                            cursor-pointer
                          "
                          >
                            <div className="flex items-center gap-3">

                              <div
                                className="
                                w-9
                                h-9
                                rounded-lg
                                bg-blue-50
                                text-blue-600
                                flex
                                items-center
                                justify-center
                                shrink-0
                              "
                              >
                                <Stethoscope className="w-4 h-4" />
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-slate-700">
                                  Consulta #{index + 1}
                                </p>

                                <p className="text-xs text-slate-400 mt-0.5">
                                  {formatDate(
                                    item.clinicalProgress.registrationDate
                                  )}
                                </p>
                              </div>

                            </div>

                            <ChevronDown
                              className={`
                              w-5
                              h-5
                              text-slate-400
                              transition-transform
                              duration-200
                              ${isOpen
                                  ? "rotate-180"
                                  : ""
                                }
                            `}
                            />

                          </button>

                          {/* Accordion content */}
                          {isOpen && (
                            <div
                              className="
                              border-t
                              border-slate-200
                              px-5
                              py-5
                              space-y-5
                            "
                            >

                              {/* Clinical Progress */}
                              <section>
                                <div className="flex items-center gap-2 mb-3">
                                  <CalendarDays className="w-4 h-4 text-blue-500" />

                                  <h4 className="text-sm font-semibold text-slate-700">
                                    Registro clínico por <strong>{item.medicalPrescription?.medicalPrescription.dentistFullName} </strong>
                                  </h4>
                                </div>
                                <div
                                  className="
                                  rounded-lg
                                  bg-slate-50
                                  border
                                  border-slate-100
                                  p-4
                                "
                                >
                                  <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                    <strong>Notas clinicas: </strong>{item.clinicalProgress.observations ||
                                      "Sin descripción."}
                                  </p>
                                </div>
                                <div
                                  className="
                                  rounded-lg
                                  bg-slate-50
                                  border
                                  border-slate-100
                                  p-4
                                "
                                >
                                  <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                    <strong>Diagnosticos: </strong>{item.clinicalProgress.diagnosis ||
                                      "Sin descripción."}
                                  </p>
                                </div>
                                <div
                                  className="
                                  rounded-lg
                                  bg-slate-50
                                  border
                                  border-slate-100
                                  p-4
                                "
                                >
                                  <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                    <strong>Instrucciones generales: </strong>{item.medicalPrescription?.medicalPrescription.generalInstructions ||
                                      "Sin descripción."}
                                  </p>
                                </div>
                              </section>

                              {/* Medical Prescription */}
                              {item.medicalPrescription &&
                                item.medicalPrescription.details?.some(
                                  (detail) =>
                                    detail.medicine?.trim() ||
                                    detail.dose?.trim() ||
                                    detail.frequency?.trim() ||
                                    detail.duration?.trim()
                                ) && (
                                  <section>
                                    <div className="flex items-center gap-2 mb-3">
                                      <Pill className="w-4 h-4 text-emerald-500" />

                                      <h4 className="text-sm font-semibold text-slate-700">
                                        Receta médica
                                      </h4>
                                    </div>

                                    <div className="rounded-lg border border-slate-200 overflow-hidden">

                                      {item.medicalPrescription.details
                                        ?.length > 0 ? (
                                        <div className="divide-y divide-slate-100">

                                          {item.medicalPrescription.details.map(
                                            (detail) => (
                                              <div
                                                key={detail.id}
                                                className="p-4"
                                              >
                                                <p className="text-sm font-medium text-slate-700">
                                                  <strong>Medicina: </strong>{detail.medicine || "no se registro medicina"}
                                                </p>

                                                <p className="text-xs text-slate-500 mt-1">
                                                  <strong>Dosis: </strong>{detail.dose || "no se registro dosis"}
                                                </p>

                                                <p className="text-xs text-slate-500 mt-1">
                                                  <strong>Frequencia: </strong>{detail.frequency || "no se registro frequencia"}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                  <strong>Duración: </strong>{detail.duration || "no se registro duración"}
                                                </p>
                                              </div>
                                            )
                                          )}

                                        </div>
                                      ) : (
                                        <p className="p-4 text-sm text-slate-400">
                                          Sin detalles de receta.
                                        </p>
                                      )}

                                    </div>
                                  </section>
                                )}

                              {/* Dental Chart */}
                              {item.dentalChart && (
                                <section>
                                  <div className="flex items-center gap-2 mb-3">
                                    <Stethoscope className="w-4 h-4 text-violet-500" />
                                    <h4 className="text-sm font-semibold text-slate-700">
                                      Odontograma
                                    </h4>
                                  </div>

                                  <div className="rounded-lg border border-slate-200 p-4">
                                    <p className="text-xs text-slate-500 mt-1">
                                      <strong>Observaciones: </strong>{item.dentalChart.dentalChart.observations || "no se agregaron observaciones"}
                                    </p>
                                    {item.dentalChart.details?.length ? (
                                      <div className="space-y-2">
                                        {item.dentalChart.details.map(
                                          (detail) => (
                                            <div
                                              key={detail.id}
                                              className="
                                              flex
                                              flex-col
                                              items-start
                                              justify-between
                                              rounded-lg
                                              bg-slate-50
                                              p-3
                                            "
                                            >
                                              <div className="flex flex-row justify-between w-full">
                                                <span className="text-sm text-slate-600">
                                                  Diente # {" "}
                                                  {detail.toothNumber}
                                                </span>
                                                <span className="text-sm text-slate-600">
                                                  Cara {" "}
                                                  {detail.face}
                                                </span>

                                                <span className="text-xs text-slate-500">
                                                  {dentalChartStatusSpanishOptions.find(
                                                    (option) => option.value === detail.toothStatus
                                                  )?.label}
                                                </span>
                                              </div>
                                              <p className="text-xs text-slate-500 mt-1">
                                                <strong>Observaciones: </strong>{detail.notes || "no se agregaron observaciones"}
                                              </p>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-slate-400">
                                        Sin detalles del odontograma.
                                      </p>
                                    )}
                                  </div>
                                </section>
                              )}

                              {/* Attachment */}
                              {item.patientAttachment && (
                                <section>
                                  <div className="flex items-center gap-2 mb-3">
                                    <Image className="w-4 h-4 text-amber-500" />

                                    <h4 className="text-sm font-semibold text-slate-700">
                                      Archivo adjunto
                                    </h4>
                                  </div>
                                  <p className="text-xs text-slate-500 my-1">
                                    <strong>Descripción: </strong>{item.patientAttachment.description || "no se agrego descripción"}
                                  </p>

                                  <div className="rounded-lg border border-slate-200 overflow-hidden">
                                    <img src={item.patientAttachment.fileUrl} alt={item.patientAttachment.fileName} className="w-full h-full object-cover" />
                                  </div>
                                </section>
                              )}

                            </div>
                          )}

                        </div>
                      );
                    }
                  )}

                </div>
              )}

          </div>

        </div>
      </div>
    );
  };

export default ShowClinicalProgressDrawer;