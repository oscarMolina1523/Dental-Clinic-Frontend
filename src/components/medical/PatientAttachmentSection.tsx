import React, { useEffect, useState } from "react";

import type Appointment from "../../models/AppointmentModel";
import type { PatientAttachmentDto } from "../../models/PatientAttachmentModel";

import useImageUpload from "../../hooks/useImageUpload";

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
  clinicalProgressId,
}) => {
  const { uploadImage } = useImageUpload();

  const [form, setForm] = useState<PatientAttachmentDto>({
    clinicalProgressId: "",
    patientId: "",
    fileType: "",
    fileUrl: "",
    fileName: "",
    description: "",
    uploadedBy: "",
    createdAt: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const hasData =
      form.fileType.trim() ||
      form.fileUrl.trim() ||
      form.fileName.trim() ||
      form.description.trim();

    if (!hasData) {
      onChange(null);
      return;
    }

    onChange({
      ...form,
      clinicalProgressId: clinicalProgressId || "",
      uploadedBy: "system",
      patientId:
        appointment?.patientId || form.patientId,
    });
  }, [
    form,
    appointment,
    clinicalProgressId,
    onChange,
  ]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      return;
    }

    setImageFile(file);
    setIsUploading(true);

    try {
      const uploadedImageUrl = await uploadImage(file);

      if (!uploadedImageUrl) {
        setImageFile(null);

        return;
      }

      setForm((prev) => ({
        ...prev,
        fileUrl: uploadedImageUrl,
        fileName: file.name,
        fileType: file.type,
      }));
    } catch (error) {
      console.error(
        "Error al subir archivo:",
        error
      );

      setImageFile(null);
    } finally {
      setIsUploading(false);
    }
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

      {/* IMAGEN */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Imagen
        </label>

        <input
          type="file"
          id="clinicalAttachment"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />

        <label
          htmlFor="clinicalAttachment"
          className="
            inline-flex
            items-center
            justify-center
            px-4
            py-2.5
            text-sm
            font-medium
            text-slate-700
            bg-slate-100
            border
            border-slate-200
            rounded-lg
            cursor-pointer
            hover:bg-slate-200
            disabled:opacity-50
          "
        >
          {isUploading
            ? "Subiendo imagen..."
            : "Seleccionar imagen"}
        </label>

        <span className="ml-2 text-sm text-slate-500">
          {imageFile
            ? imageFile.name
            : "No se ha seleccionado una imagen"}
        </span>

        {/* PREVIEW */}
        {imageFile && (
          <div className="mt-3">
            <p className="text-xs text-slate-500 mb-2">
              Vista previa
            </p>

            <img
              src={URL.createObjectURL(imageFile)}
              alt="Vista previa"
              className="
                w-32
                h-32
                rounded-lg
                object-cover
                border
                border-slate-200
              "
            />
          </div>
        )}
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
            focus:ring-2
            focus:ring-blue-500/10
            resize-none
          "
        />
      </div>

    </div>
  );
};

export default PatientAttachmentSection;