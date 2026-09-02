import React, { useState } from "react";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import type TreatmentCatalogModel from "../../models/TreatmentCatalogModel";
import { useActivateTreatment, useChangeTreatmentDuration, useChangeTreatmentPrice, useDeactivateTreatment } from "../../hooks/useTreatmentsCatalog";

interface SecurityTreatmentCatalogDrawerProps {
    isOpen: boolean;
    onHide: () => void;
    treatment: TreatmentCatalogModel | null;
}

const SecurityTreatmentCatalogDrawer: React.FC<SecurityTreatmentCatalogDrawerProps> = ({
    isOpen,
    onHide,
    treatment,
}) => {
    const [prevTreatment, setPrevTreatment] = useState<TreatmentCatalogModel | null>(treatment);

    // Hooks de mutación
    const { mutateAsync: changePrice, isPending: isPendingPrice } = useChangeTreatmentPrice();
    const { mutateAsync: changeDuration, isPending: isPendingDuration } = useChangeTreatmentDuration();
    const { mutateAsync: activateTreatment, isPending: isPendingActivate } = useActivateTreatment();
    const { mutateAsync: deactivateTreatment, isPending: isPendingDeactivate } = useDeactivateTreatment();

    const isPending =
        isPendingPrice ||
        isPendingDuration ||
        isPendingActivate ||
        isPendingDeactivate;

    // Estados del formulario
    const [price, setPrice] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(false);

    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);


    if (treatment !== prevTreatment) {
        setPrevTreatment(treatment);
        setPrice(treatment?.basePrice || 0);
        setDuration(treatment?.estimatedDurationMinutes || 0);
        setIsActive(treatment?.active ?? false);
    }

    const showToast = (
        type: "success" | "error",
        message: string
    ) => {
        setToast({
            type,
            message,
        });
    };

    const handleSubmit = async () => {
        if (!treatment) return;

        if (!duration) {
            showToast("error", "Debes asignar una duración.");
            return;
        }

        if (!price) {
            showToast("error", "Debes asignar un precio.");
            return;
        }

        try {
            // Se utiliza Promise<unknown>[] en lugar de Promise<any>[] para cumplir con las reglas de linting
            // (no-explicit-any) y mantener el tipo estricto. Como solo esperamos la resolución de Promise.all
            // y no consumimos el retorno individual de las mutaciones, unknown es el tipo seguro adecuado.
            const promises: Promise<unknown>[] = [];

            // Evaluar cambios y encolar peticiones específicas

            // Cambiar precio
            if (price !== treatment.basePrice) {
                promises.push(changePrice({ id: treatment.id, price }));
            }

            // Cambiar duración
            if (duration !== treatment.estimatedDurationMinutes) {
                promises.push(changeDuration({ id: treatment.id, minutes: duration }));
            }

            // Activar / Desactivar Estado
            if (isActive !== treatment.active) {
                if (isActive) {
                    promises.push(activateTreatment(treatment.id));
                } else {
                    promises.push(deactivateTreatment(treatment.id));
                }
            }

            // Si no hubo cambios
            if (promises.length === 0) {
                showToast("error", "No se detectó ningún cambio para guardar.");
                return;
            }

            // Ejecutar todas las peticiones necesarias
            await Promise.all(promises);

            showToast("success", "Ajustes de seguridad actualizados correctamente.");
            onHide();
        } catch {
            showToast(
                "error",
                "Ocurrió un error al actualizar los datos de seguridad."
            );
        }
    };

    return (
        <>
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
            {/* Overlay */}
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

            <GenericDrawer
                isOpen={isOpen}
                onHide={onHide}
                title="Seguridad del Paciente"
                description="Modifica la información sensible del paciente"
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
                                cursor-pointer
                                disabled:opacity-50
                            "
                        >
                            {isPending
                                ? "Guardando..."
                                : "Guardar Cambios"}
                        </button>
                    </>
                }
            >
                {/* TODO EL BODY ES EXCLUSIVO DE EDITAR */}

                <div className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Precio
                        </label>
                        <input
                            type="number"
                            value={price || 0}
                            onChange={(e) => setPrice(e.target.valueAsNumber)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                        />
                    </div>

                    {/* numero de telefono */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Duración (minutos)
                        </label>
                        <input
                            type="number"
                            value={duration || 0}
                            onChange={(e) => setDuration(e.target.valueAsNumber)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                        />
                    </div>

                    {/* Estado Activo/Inactivo */}
                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="active"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="userActive" className="text-sm font-medium text-slate-700 cursor-pointer">
                            Tratamiento activo en la plataforma
                        </label>
                    </div>
                </div>
            </GenericDrawer >
        </>
    );
};

export default SecurityTreatmentCatalogDrawer;