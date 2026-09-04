import React from "react";
import logo from "../assets/logo.webp";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Stethoscope,
  ClipboardList,
  FileCheck,
  Receipt,
  Archive,
  Package,
  BarChart3,
  UserCheck,
  Settings,
  ChevronDown,
  ScanBarcode
} from "lucide-react";

// Lista de elementos de navegación con sus íconos
const navItems = [
  { id: "home", label: "Dashboard", icon: LayoutDashboard },
  { id: "patients", label: "Pacientes", icon: Users },
  { id: "agenda", label: "Agenda", icon: Calendar },
  { id: "expedientes", label: "Expedientes", icon: FileText },
  { id: "odontograma", label: "Odontograma", icon: Stethoscope },
  { id: "treatments", label: "Tratamientos", icon: ClipboardList },
  { id: "planes", label: "Planes de Tratamiento", icon: FileCheck },
  { id: "facturacion", label: "Facturación", icon: Receipt },
  { id: "caja", label: "Caja", icon: Archive },
  { id: "products", label: "Productos", icon: ScanBarcode },
  { id: "inventories", label: "Inventario", icon: Package },
  { id: "reportes", label: "Reportes", icon: BarChart3 },
  { id: "users", label: "Usuarios", icon: UserCheck },
  { id: "configuracion", label: "Configuración", icon: Settings },
];

const AppSidebar: React.FC = () => {

  return (
    <aside className="flex flex-col h-screen w-64 bg-[#001D4A] text-white px-4 py-6 justify-between select-none">
      {/* 1. Header: Logo y Título */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-20 w-20 object-contain" />
          <div className="flex flex-col">
            <span className="text-[10px] font-medium tracking-wider text-blue-200 uppercase leading-tight">
              Sistema de Gestión
            </span>
            <span className="text-sm font-extrabold tracking-wide uppercase leading-tight">
              Odontológico
            </span>
            <span className="text-[10px] text-blue-300 font-light mt-0.5">
              Odontología Integral <br /> Dra. López
            </span>
          </div>
        </div>

        {/* 2. Menú de Navegación */}
        <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-220px)] scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.id}
                to={`/${item.id}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#1E69FF] text-white"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* 3. Footer: Perfil de Usuario */}
      <div className="border border-blue-400/30 bg-[#00163A]/60 rounded-2xl p-3 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150&auto=format&fit=crop"
              alt="Dra. López"
              className="w-10 h-10 rounded-full object-cover border border-blue-400"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold leading-tight">Dra. López</span>
            <span className="text-[10px] text-blue-300 leading-tight">Administradora</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] text-emerald-400 font-medium leading-none">En línea</span>
            </div>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-blue-300 cursor-pointer hover:text-white transition-colors" />
      </div>
    </aside>
  );
};

export default AppSidebar;