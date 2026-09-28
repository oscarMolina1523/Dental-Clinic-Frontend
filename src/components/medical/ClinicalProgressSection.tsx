import React from "react";
import type Appointment from "../../models/AppointmentModel";
import type { ClinicalProgresDto } from "../../models/ClinicalProgressModel";

interface ClinicalProgressSectionProps {
  appointment: Appointment | null;
  value: ClinicalProgresDto;
  onChange: (value: ClinicalProgresDto) => void;
}

const ClinicalProgressSection: React.FC<
  ClinicalProgressSectionProps
> = ({
  appointment,
  value,
  onChange,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value: inputValue } = e.target;

    onChange({
      ...value,
      [name]: inputValue,
    });
  };

  return (
    <div className="space-y-5">

      {/* PACIENTE */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Paciente
        </label>

        <input
          type="text"
          value={appointment?.patientFullName || ""}
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

      {/* DENTISTA */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Dentista
        </label>

        <input
          type="text"
          value={appointment?.dentistFullName || ""}
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

      {/* TRATAMIENTO */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Tratamiento
        </label>

        <input
          type="text"
          name="treatmentId"
          value={value.treatmentId}
          onChange={handleChange}
          placeholder="Ingrese el ID del tratamiento"
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

      {/* DIAGNÓSTICO */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Diagnóstico
        </label>

        <textarea
          name="diagnosis"
          value={value.diagnosis}
          onChange={handleChange}
          placeholder="Ingrese el diagnóstico..."
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

      {/* OBSERVACIONES */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Observaciones
        </label>

        <textarea
          name="observations"
          value={value.observations}
          onChange={handleChange}
          placeholder="Ingrese las observaciones..."
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

    </div>
  );
};

export default ClinicalProgressSection;