import React from "react";
import { Mail, Lock } from "lucide-react";
import { NavLink } from "react-router-dom";

const LoginPage: React.FC = () => {
    return (
        <div className="flex h-full w-full items-center justify-center bg-[#f4f7fc] p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
                {/* Cabecera / Ilustración */}
                <div className="mb-6 flex flex-col items-center justify-between">
                    <div className="relative flex h-40 w-40 items-center justify-center rounded-2xl overflow-hidden">
                        <img src="/candado.webp" alt="candado" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#1e293b]">
                        Iniciar Sesión
                    </h1>
                </div>

                {/* Formulario */}
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-3 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-800 transition focus:border-blue-500 focus:bg-white focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-3 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-800 transition focus:border-blue-500 focus:bg-white focus:outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-[#2563eb] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.99]"
                    >
                        Acceder
                    </button>
                </form>

                <div className="mt-4 text-sm text-right">
                    ¿No tiene cuenta?{" "}
                    <NavLink
                        to="/auth/register"
                        type="button"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Regístrese aquí
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;