import React, { useState } from "react";
import { useAddUser } from "../../hooks/useUsers";
import Toast from "../../shared/Toast";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
interface CreateUserProps {
    isOpen: boolean;
    onHide: () => void;
}

const CreateUserDrawer: React.FC<CreateUserProps> = ({ isOpen, onHide }) => {
    const { mutate: addUser, isPending } = useAddUser();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    });

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

    const cleanForm = () => {
        setForm({
            name: "",
            email: "",
            password: "",
            phone: "",
        });

        onHide();
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        const name = form.name.trim();
        const email = form.email.trim();
        const password = form.password.trim();
        const phone = form.phone.trim();

        // Validaciones
        if (!name) {
            showToast(
                "error",
                "El nombre completo es obligatorio."
            );
            return;
        }

        if (!email) {
            showToast(
                "error",
                "El email es obligatorio."
            );
            return;
        }

        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            showToast(
                "error",
                "Ingrese un email válido."
            );
            return;
        }

        if (!password) {
            showToast(
                "error",
                "La contraseña es obligatoria."
            );
            return;
        }

        if (password.length < 6) {
            showToast(
                "error",
                "La contraseña debe tener al menos 6 caracteres."
            );
            return;
        }

        addUser(
            {
                fullName: name,
                email,
                password,
                phoneNumber: phone || "",
            },
            {
                onSuccess: () => {
                    showToast(
                        "success",
                        "El usuario se creó correctamente."
                    );

                    cleanForm();

                },

                onError: (error) => {
                    showToast(
                        "error",
                        error.message ||
                        "No se pudo crear el usuario."
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
                title="Nuevo Usuario"
                description="Registra un nuevo usuario"
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
                                transition-colors
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
                                transition-colors
                                cursor-pointer
                                disabled:opacity-50
                            "
                        >
                            {isPending
                                ? "Creando..."
                                : "Crear Usuario"}
                        </button>
                    </>
                }
            >
                {/* BODY DEL CREATE */}
                <div className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nombre completo
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Ingrese el nombre completo"
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
                            value={form.email}
                            onChange={handleChange}
                            placeholder="correo@ejemplo.com"
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
                            Contraseña
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Ingrese la contraseña"
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
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Ingrese el teléfono"
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

                </div>
            </GenericDrawer>
        </>
    );
}

export default CreateUserDrawer;