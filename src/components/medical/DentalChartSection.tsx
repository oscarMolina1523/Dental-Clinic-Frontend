import React, { useState } from "react";

import type Appointment from "../../models/AppointmentModel";

import type {
  CreateDentalChartRequest,
  DentalChartDetailDto,
} from "../../models/DentalChartOrchestratorModel";

import type { DentalChartDto } from "../../models/DentalChartModel";
import { dentalChartStatusSpanishOptions, type DentalChartDetailsStatus } from "../../utils/dentalChartStatus.enum";

interface DentalChartSectionProps {
  appointment: Appointment | null;
  onChange: (
    data: CreateDentalChartRequest | null
  ) => void;
  clinicalProgressId: string;
}

const DentalChartSection: React.FC<
  DentalChartSectionProps
> = ({
  appointment,
  onChange,
  clinicalProgressId
}) => {
    const [dentalChart, setDentalChart] =
      useState<DentalChartDto>({
        clinicalProgressId: clinicalProgressId || "",
        patientId: appointment?.patientId || "",
        evaluationDate: appointment?.startAppointmentTime
          ? new Date(appointment.startAppointmentTime)
          : new Date(),
        dentistId: appointment?.dentistId || "",
        observations: "",
      });

    const [details, setDetails] = useState<
      DentalChartDetailDto[]
    >([]);

    /*
     * =========================================================
     * CREAR REQUEST
     * =========================================================
     */

    const buildRequest = (
      chart: DentalChartDto,
      chartDetails: DentalChartDetailDto[]
    ): CreateDentalChartRequest | null => {
      const hasObservations =
        chart.observations.trim().length > 0;

      const hasDetails = chartDetails.length > 0;

      if (!hasObservations && !hasDetails) {
        return null;
      }

      return {
        dentalChart: {
          ...chart,
          clinicalProgressId: clinicalProgressId || "",
          patientId:
            appointment?.patientId || chart.patientId,
          dentistId:
            appointment?.dentistId || chart.dentistId,
          observations:
            chart.observations.trim(),
        },

        details: chartDetails.map((detail) => ({
          ...detail,
          face: detail.face.trim(),
          notes: detail.notes.trim(),
        })),
      };
    };

    /*
     * =========================================================
     * CAMBIAR OBSERVACIONES
     * =========================================================
     */

    const handleChartChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      const nextChart = {
        ...dentalChart,
        [e.target.name]: e.target.value,
      };

      setDentalChart(nextChart);

      onChange(
        buildRequest(nextChart, details)
      );
    };

    /*
     * =========================================================
     * CAMBIAR DETALLE
     * =========================================================
     */

    const handleDetailChange = (
      index: number,
      field: keyof DentalChartDetailDto,
      value: string | number
    ) => {
      const nextDetails = details.map(
        (detail, detailIndex) => {
          if (detailIndex !== index) {
            return detail;
          }

          return {
            ...detail,
            [field]: value,
          };
        }
      );

      setDetails(nextDetails);

      onChange(
        buildRequest(
          dentalChart,
          nextDetails
        )
      );
    };

    /*
     * =========================================================
     * AGREGAR DETALLE
     * =========================================================
     */

    const handleAddDetail = () => {
      const nextDetails = [
        ...details,
        {
          dentalChartId: "",
          toothNumber: 0,
          face: "",
          toothStatus:
            "" as DentalChartDetailsStatus,
          notes: "",
        },
      ];

      setDetails(nextDetails);

      onChange(
        buildRequest(
          dentalChart,
          nextDetails
        )
      );
    };

    /*
     * =========================================================
     * ELIMINAR DETALLE
     * =========================================================
     */

    const handleRemoveDetail = (
      index: number
    ) => {
      const nextDetails = details.filter(
        (_, detailIndex) =>
          detailIndex !== index
      );

      setDetails(nextDetails);

      onChange(
        buildRequest(
          dentalChart,
          nextDetails
        )
      );
    };

    return (
      <div className="border-t border-slate-100 space-y-5">
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-slate-200" />

          <div className="flex flex-col text-center">
            <h2 className="text-sm font-semibold text-slate-700 whitespace-nowrap">
              Odontograma (opcional)
            </h2>
          </div>

          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* OBSERVACIONES */}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Observaciones
          </label>

          <textarea
            name="observations"
            value={dentalChart.observations}
            onChange={handleChartChange}
            placeholder="Ingrese las observaciones del odontograma..."
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

        {/* DETALLES */}

        <div>

          <div className="flex items-center justify-between mb-4">

            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Detalle dental
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Agregue las piezas dentales evaluadas.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddDetail}
              className="
              px-3 py-2
              text-xs font-medium
              text-blue-600
              bg-blue-50
              hover:bg-blue-100
              rounded-lg
              cursor-pointer
            "
            >
              + Agregar
            </button>

          </div>

          <div className="space-y-5">

            {details.map((detail, index) => (

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

                <div className="flex items-center justify-between">

                  <span className="text-sm font-semibold text-slate-700">
                    Pieza {index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveDetail(index)
                    }
                    className="
                    text-xs
                    text-rose-600
                    hover:text-rose-700
                    cursor-pointer
                  "
                  >
                    Eliminar
                  </button>

                </div>

                <div className="flex flex-col md:flex-row gap-2 w-full">
                  {/* DIENTE */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Número de diente
                    </label>

                    <input
                      type="number"
                      min={11}
                      max={48}
                      value={
                        detail.toothNumber || ""
                      }
                      onChange={(e) =>
                        handleDetailChange(
                          index,
                          "toothNumber",
                          Number(e.target.value)
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
                  "
                    />
                  </div>

                  {/* CARA del diente */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Cara
                    </label>

                    <select
                      value={detail.face}
                      onChange={(e) =>
                        handleDetailChange(
                          index,
                          "face",
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
                      bg-white
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-500/10
                    "
                    >
                      <option value="">
                        Seleccione una cara
                      </option>

                      <option value="OCLUSAL">Oclusal</option>
                      <option value="INCISAL">Incisal</option>
                      <option value="VESTIBULAR">Vestibular</option>
                      <option value="LINGUAL">Lingual</option>
                      <option value="PALATINA">Palatina</option>
                      <option value="MESIAL">Mesial</option>
                      <option value="DISTAL">Distal</option>
                    </select>
                  </div>

                  {/* ESTADO */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Estado
                    </label>

                    <select
                      value={detail.toothStatus}
                      onChange={(e) =>
                        handleDetailChange(
                          index,
                          "toothStatus",
                          e.target.value as DentalChartDetailsStatus
                        )
                      }
                      className="
                      w-full
                      px-3 py-2.5
                      border border-slate-200
                      rounded-lg
                      text-sm
                      outline-none
                      bg-white
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-500/10
                    "
                    >
                      <option value="">
                        Seleccione un estado
                      </option>

                      {dentalChartStatusSpanishOptions.map((status) => (
                        <option
                          key={status.value}
                          value={status.value}
                        >
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* NOTAS */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notas
                  </label>

                  <textarea
                    value={detail.notes}
                    onChange={(e) =>
                      handleDetailChange(
                        index,
                        "notes",
                        e.target.value
                      )
                    }
                    placeholder="Notas..."
                    rows={3}
                    className="
                    w-full
                    px-3 py-2.5
                    border border-slate-200
                    rounded-lg
                    text-sm
                    outline-none
                    focus:border-blue-500
                    resize-none
                  "
                  />
                </div>

              </div>

            ))}

          </div>

        </div>

      </div>
    );
  };

export default DentalChartSection;