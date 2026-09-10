import { useState } from "react";
import type AppointmentModel from "../../models/AppointmentModel";
import { useCancelAppointment, useCompleteAppointment, useConfirmAppointment, useMarkAppointmentAsNoShow, useStartAppointment } from "../../hooks/useAppointment";

export default function useAppointmentPage() {

  /* =========================================================
     ESTADOS DE DRAWERS Y MODALES
     ========================================================= */

  const [isCreateDrawerOpen, setIsCreateDrawerOpen] =
    useState(false);

  const [isEditDrawerOpen, setIsEditDrawerOpen] =
    useState(false);

  const [isStatusModalOpen, setIsStatusModalOpen] =
    useState(false);

  const [isCancelModalOpen, setIsCancelModalOpen] =
    useState(false);


  /* =========================================================
     CITA SELECCIONADA
     ========================================================= */

  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentModel | null>(null);


  /* =========================================================
     NOTAS DE CANCELACIÓN
     ========================================================= */

  const [cancelNotes, setCancelNotes] =
    useState("");


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
     MUTACIONES
     ========================================================= */

  const confirmMutation =
    useConfirmAppointment();

  const startMutation =
    useStartAppointment();

  const completeMutation =
    useCompleteAppointment();

  const cancelMutation =
    useCancelAppointment();

  const noShowMutation =
    useMarkAppointmentAsNoShow();


  /* =========================================================
     CONFIRMAR CITA
     ========================================================= */

  const handleConfirm = (id: string) => {

    confirmMutation.mutate(
      id,
      {
        onSuccess: () => {
          setIsStatusModalOpen(false);
        },

        onError: (error) => {
          showToast(
            "error",
            error.message ||
              "No se pudo confirmar la cita."
          );
        },
      }
    );
  };


  /* =========================================================
     INICIAR CITA
     ========================================================= */

  const handleStart = (id: string) => {

    startMutation.mutate(
      id,
      {
        onSuccess: () => {
          setIsStatusModalOpen(false);
        },

        onError: (error) => {
          showToast(
            "error",
            error.message ||
              "No se pudo iniciar la cita."
          );
        },
      }
    );
  };


  /* =========================================================
     COMPLETAR CITA
     ========================================================= */

  const handleComplete = (id: string) => {

    completeMutation.mutate(
      id,
      {
        onSuccess: () => {
          setIsStatusModalOpen(false);
        },

        onError: (error) => {
          showToast(
            "error",
            error.message ||
              "No se pudo completar la cita."
          );
        },
      }
    );
  };


  /* =========================================================
     MARCAR COMO NO ATENDIDA
     ========================================================= */

  const handleNoShow = (id: string) => {

    noShowMutation.mutate(
      id,
      {
        onSuccess: () => {
          setIsStatusModalOpen(false);
        },

        onError: (error) => {
          showToast(
            "error",
            error.message ||
              "No se pudo poner en no atendida la cita."
          );
        },
      }
    );
  };


  /* =========================================================
     CANCELAR CITA
     ========================================================= */

  const handleCancelSubmit = () => {

    if (
      !selectedAppointment ||
      !cancelNotes.trim()
    ) {
      return;
    }

    cancelMutation.mutate(
      {
        id: selectedAppointment.id,
        notes: cancelNotes,
      },
      {
        onSuccess: () => {

          setCancelNotes("");

          setIsCancelModalOpen(false);

          setIsStatusModalOpen(false);
        },

        onError: (error) => {
          showToast(
            "error",
            error.message ||
              "No se pudo cancelar la cita."
          );
        },
      }
    );
  };


  /* =========================================================
     VALIDACIONES DE ESTADO
     ========================================================= */

  const canChangeStatus = (
    status: AppointmentModel["status"]
  ) => {

    return [
      "SCHEDULED",
      "CONFIRMED",
      "IN_PROGRESS",
    ].includes(status);
  };


  const canConfirm = (
    status: AppointmentModel["status"]
  ) =>
    status === "SCHEDULED";


  const canStart = (
    status: AppointmentModel["status"]
  ) =>
    status === "CONFIRMED";


  const canComplete = (
    status: AppointmentModel["status"]
  ) =>
    status === "IN_PROGRESS";


  const canNoShow = (
    status: AppointmentModel["status"]
  ) =>
    status === "CONFIRMED";


  const canCancel = (
    status: AppointmentModel["status"]
  ) =>
    status !== "COMPLETED" &&
    status !== "CANCELLED" &&
    status !== "NO_SHOW";


  /* =========================================================
     ESTADO GENERAL DE MUTACIONES
     ========================================================= */

  const isPendingAny =
    confirmMutation.isPending ||
    startMutation.isPending ||
    completeMutation.isPending ||
    cancelMutation.isPending ||
    noShowMutation.isPending;


  /* =========================================================
     RETURN
     ========================================================= */

  return {

    /* Drawers */
    isCreateDrawerOpen,
    setIsCreateDrawerOpen,

    isEditDrawerOpen,
    setIsEditDrawerOpen,


    /* Modales */
    isStatusModalOpen,
    setIsStatusModalOpen,

    isCancelModalOpen,
    setIsCancelModalOpen,


    /* Cita seleccionada */
    selectedAppointment,
    setSelectedAppointment,


    /* Cancelación */
    cancelNotes,
    setCancelNotes,


    /* Toast */
    toast,
    setToast,
    showToast,


    /* Mutaciones */
    confirmMutation,
    startMutation,
    completeMutation,
    cancelMutation,
    noShowMutation,


    /* Handlers */
    handleConfirm,
    handleStart,
    handleComplete,
    handleNoShow,
    handleCancelSubmit,


    /* Validaciones */
    canChangeStatus,
    canConfirm,
    canStart,
    canComplete,
    canNoShow,
    canCancel,


    /* Loading */
    isPendingAny,
  };
}