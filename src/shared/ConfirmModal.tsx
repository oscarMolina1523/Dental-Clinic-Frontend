import React from "react";
import { AlertCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  isPending = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop / Overlay */}
      <div
        onClick={onCancel}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300 flex items-center justify-center p-4 select-none"
      >
        {/* Modal Container */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-6 text-center transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Icono de Alerta */}
          <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-full mb-5">
            <AlertCircle className="w-15 h-15 text-rose-500" />
          </div>

          {/* Título y Descripción */}
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            {title}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-6 px-2">
            {description}
          </p>

          {/* Botones de Acción */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="px-6 py-2.5 border border-slate-300 text-slate-600 font-semibold text-sm rounded-sm hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-sm transition-colors shadow-sm shadow-rose-500/30 disabled:opacity-50 cursor-pointer"
            >
              {isPending ? "Procesando..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;