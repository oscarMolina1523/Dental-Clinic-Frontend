import React, { useState } from "react";
import Toast from "../../shared/Toast";
import { useUpdateUser } from "../../hooks/useUsers";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import User from "../../models/UserModel";

interface EditUserDrawerProps {
    isOpen: boolean;
    onHide: () => void;
    user: User | null;
}

const EditUserDrawer: React.FC<EditUserDrawerProps> = ({
    isOpen,
    onHide,
    user,
}) => {
    const {
        mutate: updateUser,
        isPending,
    } = useUpdateUser();

    const [prevUser, setPrevUser] = useState<User | null>(user);
    const [form, setForm] = useState<User | null>(user);

    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    if (user !== prevUser) {
        setPrevUser(user);
        setForm(user);
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

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setForm((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const handleSubmit = () => {
        if (!user || !form) {
            return;
        }

        if (!form.fullName.trim()) {
            showToast(
                "error",
                "El nombre completo es obligatorio."
            );
            return;
        }

        if (!form.email.trim()) {
            showToast(
                "error",
                "El email es obligatorio."
            );
            return;
        }

        updateUser(
            {
                id: user.id,
                user: {
                    fullName: form.fullName.trim(),
                    email: form.email.trim(),
                    phoneNumber: form.phoneNumber.trim(),
                    roleId: form.roleId,
                    password: form.password,
                    active: form.active,
                    image: form.image,
                    membershipNumber: form.membershipNumber
                }
            },
            {
                onSuccess: () => {
                    showToast(
                        "success",
                        "El usuario se actualizó correctamente."
                    );

                    onHide();
                },

                onError: (error) => {
                    showToast(
                        "error",
                        error.message ||
                        "No se pudo actualizar el usuario."
                    );
                },
            }
        );
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
                title="Editar Usuario"
                description="Modifica la información del usuario"
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

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nombre completo
                        </label>

                        <input
                            type="text"
                            name="fullName"
                            value={form?.fullName || ""}
                            onChange={handleChange}
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

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form?.email || ""}
                            onChange={handleChange}
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

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Teléfono
                        </label>

                        <input
                            type="text"
                            name="phoneNumber"
                            value={form?.phoneNumber || ""}
                            onChange={handleChange}
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

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Rol
                        </label>

                        <select
                            name="roleId"
                            value={form?.roleId || ""}
                            onChange={handleChange}
                            className="
                                w-full
                                px-3 py-2.5
                                border border-slate-200
                                rounded-lg
                                text-sm
                                outline-none
                                focus:border-blue-500
                            "
                        >
                            <option value="">
                                Seleccione un rol
                            </option>

                            <option value="1">
                                Administrador
                            </option>

                            <option value="2">
                                Usuario
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Contraseña
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form?.password || ""}
                            onChange={handleChange}
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
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Imagen
                        </label>

                        <input
                            type="text"
                            name="image"
                            value={form?.image || ""}
                            onChange={handleChange}
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
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Codigo de Profesional
                        </label>

                        <input
                            type="text"
                            name="membershipNumber"
                            value={form?.membershipNumber || ""}
                            onChange={handleChange}
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

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={form?.active ?? false}
                            onChange={(e) =>
                                setForm((prev) =>
                                    prev
                                        ? {
                                            ...prev,
                                            active: e.target.checked,
                                        }
                                        : prev
                                )
                            }
                            className="w-4 h-4"
                        />

                        <label className="text-sm font-medium text-slate-700">
                            Usuario activo
                        </label>
                    </div>

                </div>
            </GenericDrawer>
        </>
    );
};

export default EditUserDrawer;