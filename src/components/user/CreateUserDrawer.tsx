import React from "react";
import { X } from "lucide-react";

interface CreateUserProps {
    isOpen: boolean;
    onHide: () => void;
}

const CreateUserDrawer: React.FC<CreateUserProps> = ({ isOpen, onHide }) => {
    return (
        <>
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
            <aside
                className={`
                    fixed top-0 right-0 z-50
                    h-screen
                    w-112.5
                    bg-white
                    shadow-2xl
                    flex flex-col
                    transform
                    transition-transform
                    duration-300
                    ease-in-out
                    ${isOpen
                        ? "translate-x-0"
                        : "translate-x-full"
                    }
                    `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b bg-[#001D4A] text-white border-slate-100">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Nuevo Usuario
                        </h2>

                        <p className="text-sm mt-1">
                            Registra un nuevo usuario
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onHide}
                        className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>


                {/* Body */}

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nombre completo
                            </label>
                            <input
                                type="text"
                                placeholder="Ingrese el nombre completo"
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="correo@ejemplo.com"
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Teléfono
                            </label>
                            <input
                                type="text"
                                placeholder="Ingrese el teléfono"
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Contraseña
                            </label>

                            <input
                                type="password"
                                placeholder="Ingrese la contraseña"
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}

                <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onHide}
                        className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className="px-4 py-2.5 text-sm font-medium text-white bg-[#001D4A] rounded-lg transition-colors cursor-pointer"
                    >
                        Crear Usuario
                    </button>

                </div>

            </aside>
        </>
    );
}

export default CreateUserDrawer;