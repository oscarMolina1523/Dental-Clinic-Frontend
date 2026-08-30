import React, { useState } from "react";
import Toast from "../../shared/Toast";
import { useActivateUser, useChangeUserEmail, useChangeUserPassword, useChangeUserRole, useDeactivateUser } from "../../hooks/useUsers";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import User from "../../models/UserModel";
import { useRoles } from "../../hooks/useRoles";

interface SecurityUserDrawerProps {
    isOpen: boolean;
    onHide: () => void;
    user: User | null;
}

const SecurityUserDrawer: React.FC<SecurityUserDrawerProps> = ({
    isOpen,
    onHide,
    user,
}) => {
    const [prevUser, setPrevUser] = useState<User | null>(user);

    const { data: roles = [], isLoading: isLoadingRoles } = useRoles();

    // Hooks de mutación
    const { mutateAsync: changeEmail, isPending: isPendingEmail } = useChangeUserEmail();
    const { mutateAsync: changePassword, isPending: isPendingPassword } = useChangeUserPassword();
    const { mutateAsync: changeRole, isPending: isPendingRole } = useChangeUserRole();
    const { mutateAsync: activateUser, isPending: isPendingActivate } = useActivateUser();
    const { mutateAsync: deactivateUser, isPending: isPendingDeactivate } = useDeactivateUser();

    const isPending =
        isPendingEmail ||
        isPendingPassword ||
        isPendingRole ||
        isPendingActivate ||
        isPendingDeactivate;

    // Estados del formulario
    const [email, setEmail] = useState<string | null>("");
    const [roleId, setRoleId] = useState<string>("");
    const [isActive, setIsActive] = useState<boolean>(false);

    // Estado para controlar la activación del cambio de contraseña
    const [shouldChangePassword, setShouldChangePassword] = useState<boolean>(false);

    // Estados exclusivos para cambio de contraseña
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);


    if (user !== prevUser) {
        setPrevUser(user);
        setEmail(user?.email || "");
        setRoleId(user?.roleId || "");
        setIsActive(user?.active ?? false);

        // Limpiar campos de contraseña
        setShouldChangePassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
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

    const handleToggleChangePassword = (enabled: boolean) => {
        setShouldChangePassword(enabled);
        if (!enabled) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
    };

    const handleSubmit = async () => {
        if (!user) return;

        //  Validaciones de que han cambiado campos
        const isPasswordDirty = Boolean(currentPassword || newPassword || confirmPassword);

        if (shouldChangePassword) {
            if (!currentPassword.trim()) {
                showToast("error", "Debes ingresar la contraseña actual.");
                return;
            }
            if (!newPassword.trim()) {
                showToast("error", "Debes ingresar la nueva contraseña.");
                return;
            }
            if (newPassword.length < 8) {
                showToast("error", "La nueva contraseña debe tener al menos 8 caracteres.");
                return;
            }
            if (newPassword !== confirmPassword) {
                showToast("error", "Las nuevas contraseñas no coinciden.");
                return;
            }
        }

        if (email !== user.email && !email?.trim()) {
            showToast("error", "El correo electrónico no puede estar vacío.");
            return;
        }

        const isRoleValid = roles.some((role) => String(role.id) === String(roleId));

        if (!roleId || !isRoleValid) {
            showToast("error", "Debes seleccionar un rol válido de la lista.");
            return;
        }

        try {
            // Se utiliza Promise<unknown>[] en lugar de Promise<any>[] para cumplir con las reglas de linting
            // (no-explicit-any) y mantener el tipo estricto. Como solo esperamos la resolución de Promise.all
            // y no consumimos el retorno individual de las mutaciones, unknown es el tipo seguro adecuado.
            const promises: Promise<unknown>[] = [];

            // Evaluar cambios y encolar peticiones específicas

            // Cambiar Email
            if (email !== user.email) {
                promises.push(changeEmail({ id: user.id, email: email.trim() }));
            }

            // Cambiar Rol
            if (roleId !== user.roleId) {
                promises.push(changeRole({ id: user.id, roleId }));
            }

            // Activar / Desactivar Estado
            if (isActive !== user.active) {
                if (isActive) {
                    promises.push(activateUser(user.id));
                } else {
                    promises.push(deactivateUser(user.id));
                }
            }

            // Cambiar Contraseña
            if (isPasswordDirty) {
                promises.push(
                    changePassword({
                        id: user.id,
                        currentPassword,
                        newPassword,
                    })
                );
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
                title="Seguridad del Usuario"
                description="Modifica la información sensible del usuario"
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
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            value={email || ""}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                        />
                    </div>

                    {/* Rol */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Rol
                        </label>
                        <select
                            value={roleId}
                            onChange={(e) => setRoleId(e.target.value)}
                            disabled={isLoadingRoles}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50 disabled:cursor-not-allowed"
                        >
                            <option value="">
                                {isLoadingRoles ? "Cargando roles..." : "Seleccione un rol"}
                            </option>
                            {/* 3. Mapeo dinámico de los roles devueltos por la API */}
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Estado Activo/Inactivo */}
                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="userActive"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="userActive" className="text-sm font-medium text-slate-700 cursor-pointer">
                            Usuario activo en la plataforma
                        </label>
                    </div>

                    <hr className="border-slate-200 my-4" />

                    {/* Sección Cambio de Contraseña con Checkbox */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="enablePasswordChange"
                                checked={shouldChangePassword}
                                onChange={(e) => handleToggleChangePassword(e.target.checked)}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <label
                                htmlFor="enablePasswordChange"
                                className="text-sm font-semibold text-slate-800 cursor-pointer select-none"
                            >
                                Cambiar Contraseña
                            </label>
                        </div>

                        {/* Renderizado condicional de los inputs de contraseña */}
                        {shouldChangePassword && (
                            <div className="space-y-3 pl-2 border-l-2 border-blue-500/20">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                        Contraseña actual
                                    </label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                        Nueva contraseña
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                        Confirmar nueva contraseña
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </GenericDrawer >
        </>
    );
};

export default SecurityUserDrawer;