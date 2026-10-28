import React, { useState } from "react";
import { AlertTriangle, Bell, CalendarDays, Check, CircleCheck, Info, Menu, Trash2, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/usenotifications";
import type { NotificationModel } from "../models/NotificationModel";

const sections: Record<string, string> = {
    "/patients": "Pacientes",
    "/agenda": "Citas y Agenda",
    "/prescriptions": "Administrador de recetas",
    "/medical-progress": "Expedientes",
    "/treatments": "Servicios",
    "/treatment-plan": "Paquetes clínicos",
    "/invoices": "Facturación",
    "/products": "Productos",
    "/inventories": "Inventario",
    "/inventory-lotes": "Administrador de Lotes",
    "/reports": "Reportes",
    "/users": "Usuarios",
};

const typeStyles = {
  success: {
    icon: CircleCheck,
    color: "text-green-600",
    background: "bg-green-50",
  },
  info: {
    icon: Info,
    color: "text-blue-600",
    background: "bg-blue-50",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600",
    background: "bg-amber-50",
  },
  error: {
    icon: AlertTriangle,
    color: "text-red-600",
    background: "bg-red-50",
  },
};

interface TopBarProps {
    onMenuClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [isNotificationsOpen, setIsNotificationsOpen] =
        useState(false);

    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearNotifications,
    } = useNotifications();


    const sectionName = sections[location.pathname] ?? "Dashboard";

    const today = new Date();

    const formattedDate = new Intl.DateTimeFormat("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(today);

    const handleNotificationClick = (
        notification: NotificationModel
    ) => {
        markAsRead(notification.id);
        setIsNotificationsOpen(false);

        if (notification.actionUrl) {
            navigate(notification.actionUrl);
        }
    };

    // Capitalizar el primer carácter
    const date = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    return (
        <header className="w-full min-h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between select-none">
            {/* Lado izquierdo: Botón Menú Hamburger y Título */}
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="md:hidden flex items-center justify-center p-2"
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>
                <h1 className="text-base font-bold text-[#001D4A] ">
                    {sectionName}
                </h1>
            </div>

            {/* Lado derecho: Notificaciones, Mensajes y Fecha */}
            <div className="flex items-center gap-6 text-[#001D4A]">
                {/* Ícono de Notificaciones */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() =>
                            setIsNotificationsOpen((previous) => !previous)
                        }
                        className="relative p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                        aria-label="Ver notificaciones"
                        aria-expanded={isNotificationsOpen}
                    >
                        <Bell className="w-5 h-5" />

                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Panel desplegable */}
                    {isNotificationsOpen && (
                        <div className="absolute right-0 top-full mt-3 w-100 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
                            {/* Encabezado */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-800">
                                        Notificaciones
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {unreadCount} sin leer
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsNotificationsOpen(false)}
                                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                                    aria-label="Cerrar notificaciones"
                                >
                                    <X size={17} />
                                </button>
                            </div>

                            {/* Acciones */}
                            {notifications.length > 0 && (
                                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                                    <button
                                        type="button"
                                        onClick={markAllAsRead}
                                        disabled={unreadCount === 0}
                                        className="text-xs font-medium text-blue-600 hover:text-blue-800 disabled:text-slate-400 disabled:cursor-not-allowed"
                                    >
                                        Marcar todas como leídas
                                    </button>

                                    <button
                                        type="button"
                                        onClick={clearNotifications}
                                        className="text-xs text-slate-500 hover:text-red-600"
                                    >
                                        Limpiar todas
                                    </button>
                                </div>
                            )}

                            {/* Lista */}
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                        <Bell className="w-8 h-8 text-slate-300 mb-2" />

                                        <p className="text-sm font-medium text-slate-600">
                                            No hay notificaciones
                                        </p>

                                        <p className="text-xs text-slate-400 mt-1">
                                            Aquí aparecerán las alertas del sistema.
                                        </p>
                                    </div>
                                ) : (
                                    notifications.map((notification) => {
                                        const style = typeStyles[notification.type];
                                        const Icon = style.icon;

                                        return (
                                            <div
                                                key={notification.id}
                                                className={`flex gap-3 px-4 py-3 border-b border-slate-100 transition-colors ${notification.read
                                                    ? "bg-white"
                                                    : "bg-blue-50/40"
                                                    }`}
                                            >
                                                <div
                                                    className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${style.background} ${style.color}`}
                                                >
                                                    <Icon size={18} />
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleNotificationClick(notification)
                                                    }
                                                    className="flex-1 min-w-0 text-left cursor-pointer"
                                                >
                                                    <div className="flex items-start gap-2">
                                                        <p className="text-sm font-semibold text-slate-800">
                                                            {notification.title}
                                                        </p>

                                                        {!notification.read && (
                                                            <span className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-blue-600" />
                                                        )}
                                                    </div>

                                                    <p className="text-xs text-slate-600 mt-1 leading-relaxed break-words">
                                                        {notification.message}
                                                    </p>

                                                    <p className="text-[10px] text-slate-400 mt-2">
                                                        {new Date(
                                                            notification.createdAt
                                                        ).toLocaleString("es-NI", {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </p>
                                                </button>

                                                <div className="flex flex-col gap-1 shrink-0">
                                                    {!notification.read && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                markAsRead(notification.id)
                                                            }
                                                            title="Marcar como leída"
                                                            aria-label="Marcar como leída"
                                                            className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                                        >
                                                            <Check size={15} />
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeNotification(notification.id)
                                                        }
                                                        title="Eliminar notificación"
                                                        aria-label="Eliminar notificación"
                                                        className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {notifications.length > 0 && (
                                <div className="px-4 py-2 bg-slate-50 text-center">
                                    <span className="text-[11px] text-slate-500">
                                        {notifications.length} notificación(es)
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>


                {/* Sección de Fecha y Calendario */}
                <div className="hidden md:flex items-center gap-2 text-slate-500">
                    <span className="text-xs font-medium ">
                        {date}
                    </span>
                    <div className="p-1 border border-slate-300 rounded-md text-[#001D4A]">
                        <CalendarDays className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;