export type TreatmentPlanStatus =
  | "DRAFT"
  | "PROPOSED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";
  
export type TreatmentPlanDetailStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";



export const treatmentPlanStatusSpanishOptions: {
    value: TreatmentPlanStatus;
    label: string;
}[] = [
    { value: "DRAFT", label: "Borrador" },
    { value: "PROPOSED", label: "Propuesto" },
    { value: "ACCEPTED", label: "Aceptado" },
    { value: "IN_PROGRESS", label: "En progreso" },
    { value: "COMPLETED", label: "Completado" },
    { value: "CANCELLED", label: "Cancelado" },
];

export const treatmentPlanStatusColors: Record<
    TreatmentPlanStatus,
    { bg: string; text: string; border: string }
> = {
    DRAFT: {
        bg: "bg-slate-100",
        text: "text-slate-500",
        border: "border-slate-200",
    },
    PROPOSED: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
    },
    ACCEPTED: {
        bg: "bg-emerald-50",
        text: "text-emerald-500",
        border: "border-emerald-200",
    },
    IN_PROGRESS: {
        bg: "bg-amber-50",
        text: "text-amber-500",
        border: "border-amber-200",
    },
    COMPLETED: {
        bg: "bg-indigo-50",
        text: "text-indigo-500",
        border: "border-indigo-200",
    },
    CANCELLED: {
        bg: "bg-red-50",
        text: "text-red-500",
        border: "border-red-200",
    },
};

export const treatmentPlanDetailStatusSpanishOptions: {
    value: TreatmentPlanDetailStatus;
    label: string;
}[] = [
    { value: "PENDING", label: "Pendiente" },
    { value: "IN_PROGRESS", label: "En progreso" },
    { value: "COMPLETED", label: "Completado" },
    { value: "CANCELLED", label: "Cancelado" },
];