import React, { useEffect, useState } from "react";

import type Appointment from "../../models/AppointmentModel";
import type { PatientAttachmentDto } from "../../models/PatientAttachmentModel";

interface PatientAttachmentSectionProps {
  appointment: Appointment | null;
  onChange: (
    data: PatientAttachmentDto | null
  ) => void;
  clinicalProgressId: string;
}

const PatientAttachmentSection: React.FC<
  PatientAttachmentSectionProps
> = ({
  appointment,
  onChange,
  clinicalProgressId
}) => {
    const [form, setForm] = useState<
      PatientAttachmentDto
    >({
      clinicalProgressId: "",
      patientId: "",
      fileType: "",
      fileUrl: "",
      fileName: "",
      description: "",
      uploadedBy: "system",
      createdAt: "",
    });

    useEffect(() => {
      const hasData =
        form.fileType.trim() ||
        form.fileUrl.trim() ||
        form.fileName.trim() ||
        form.description.trim() ||
        form.uploadedBy.trim();

      if (!hasData) {
        onChange(null);
        return;
      }

      onChange({
        ...form,
        clinicalProgressId: clinicalProgressId || "",
        patientId:
          appointment?.patientId || form.patientId,
      });
    }, [form, appointment, onChange]);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;

      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    return (
      <div className="border-t border-slate-100 pt-5 space-y-5">

        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Adjunto clínico
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Esta sección es opcional.
          </p>
        </div>

        {/* TIPO */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tipo de archivo
          </label>

          <input
            type="text"
            name="fileType"
            value={form.fileType}
            onChange={handleChange}
            placeholder="Ej. Radiografía"
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

        {/* NOMBRE */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nombre del archivo
          </label>

          <input
            type="text"
            name="fileName"
            value={form.fileName}
            onChange={handleChange}
            placeholder="Nombre del archivo"
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

        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            URL del archivo
          </label>

          <input
            type="text"
            name="fileUrl"
            value={form.fileUrl}
            onChange={handleChange}
            placeholder="https://..."
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

        {/* DESCRIPCIÓN */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Descripción
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descripción del archivo..."
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

        {/* SUBIDO POR */}
        {/* <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Subido por
        </label>

        <input
          type="text"
          name="uploadedBy"
          value={form.uploadedBy}
          onChange={handleChange}
          placeholder="Usuario que registra el archivo"
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
      </div> */}

      </div>
    );
  };

export default PatientAttachmentSection;