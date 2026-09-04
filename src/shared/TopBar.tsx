import React from "react";
import { Bell, CalendarDays, Mail } from "lucide-react";
import { useLocation } from "react-router-dom";

const sections: Record<string, string> = {
    "/home": "Dashboard",
    "/patients": "Pacientes",
    "/agenda": "Agenda",
    "/expedientes": "Expedientes",
    "/odontograma": "Odontograma",
    "/treatments": "Tratamientos",
    "/planes": "Planes de Tratamiento",
    "/facturacion": "Facturación",
    "/caja": "Caja",
    "/products": "Productos",
    "/inventories": "Inventario",
    "/inventory-lotes": "Administrador de Lotes",
    "/reportes": "Reportes",
    "/users": "Usuarios",
    "/configuracion": "Configuración",
};

const TopBar: React.FC = () => {
    const location = useLocation();

    const sectionName = sections[location.pathname] ?? "Dashboard";

    const today = new Date();

    const formattedDate = new Intl.DateTimeFormat("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(today);

    // Capitalizar el primer carácter
    const date = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    return (
        <header className="w-full h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between select-none">
            {/* Lado izquierdo: Botón Menú Hamburger y Título */}
            <div className="flex items-center gap-4">
                <h1 className="text-base font-bold text-[#001D4A] ">
                    {sectionName}
                </h1>
            </div>

            {/* Lado derecho: Notificaciones, Mensajes y Fecha */}
            <div className="flex items-center gap-6 text-[#001D4A]">
                {/* Ícono de Notificaciones */}
                <button className="relative p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full">
                        3
                    </span>
                </button>

                {/* Ícono de Mensajes / Correo */}
                <button className="relative p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
                    <Mail className="w-5 h-5" />
                    <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full">
                        1
                    </span>
                </button>

                {/* Sección de Fecha y Calendario */}
                <div className="flex items-center gap-2 text-slate-500">
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