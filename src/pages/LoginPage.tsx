import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const loginMutation = useLogin();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!email.trim() || !password.trim()) {
            return;
        }

        loginMutation.mutate(
            {
                email: email.trim(),
                password,
            },
            {
                onSuccess: (data) => {
                    if (!data?.user || !data.token) {
                        return;
                    }

                    navigate("/");
                },
            }
        );
    };

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
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-3 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                disabled={loginMutation.isPending}
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
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                disabled={loginMutation.isPending}
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-800 transition focus:border-blue-500 focus:bg-white focus:outline-none"
                            />
                        </div>
                    </div>
                    
                    {loginMutation.isError && (
                        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                            {loginMutation.error.message ||
                                "No se pudo iniciar sesión"}
                        </div>
                    )}

                    <button
                    disabled={
                            loginMutation.isPending ||
                            !email.trim() ||
                            !password.trim()
                        }
                        type="submit"
                        className="w-full rounded-lg bg-[#2563eb] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
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