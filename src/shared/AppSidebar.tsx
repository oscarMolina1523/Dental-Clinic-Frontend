import React, { useEffect, useRef, useState } from "react";
import logo from "../assets/logo.webp";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  FileText,
  ClipboardList,
  FileCheck,
  Receipt,
  Package,
  BarChart3,
  UserCheck,
  ChevronDown,
  ScanBarcode,
  Pill,
  LogOut,
} from "lucide-react";
import useAuthContext from "../hooks/useAuthContext";

// Lista de elementos de navegación con sus íconos
const navItems = [
  { id: "patients", label: "Pacientes", icon: Users },
  { id: "agenda", label: "Agenda", icon: Calendar },
  { id: "prescriptions", label: "Recetas", icon: Pill },
  { id: "medical-progress", label: "Expedientes", icon: FileText },
  { id: "treatments", label: "Tratamientos", icon: ClipboardList },
  { id: "treatment-plan", label: "Planes de Tratamiento", icon: FileCheck },
  { id: "invoices", label: "Facturación", icon: Receipt },
  { id: "products", label: "Productos", icon: ScanBarcode },
  { id: "inventories", label: "Inventario", icon: Package },
  { id: "inventory-lotes", label: "Lotes", icon: Package },
  { id: "reports", label: "Reportes", icon: BarChart3 },
  { id: "users", label: "Usuarios", icon: UserCheck },
];

const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  console.log("user data", user);
  const roleName =
    user?.roleId === "70ef9d9c7fb961b2"
      ? "Administrador"
      : user?.roleId === "946adffd1a8d8931"
        ? "Demo"
        : "Usuario";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
                  `flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium transition-all duration-200 ${isActive
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

      {/* 3. Footer: Perfil de Usuario con Menú Estilo Windows */}
      <div className="relative mt-auto" ref={menuRef}>
        {/* Menú Contextual Flotante estilo Windows 11 */}
        {isMenuOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-full bg-[#1c2430]/95 backdrop-blur-md border border-white/10 rounded-xl p-1.5 shadow-2xl z-50 text-xs font-medium animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                if (logoutUser) {
                  logoutUser();
                  navigate("/auth/login", { replace: true });
                }
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors text-left"
            >
              <LogOut className="h-4 w-4 text-red-400" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        )}

        {/* Tarjeta del Usuario */}
        <div
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="border border-blue-400/30 bg-[#00163A]/60 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-[#00163A] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold leading-tight">{user?.username || "Usuario"}</span>
              <span className="text-[10px] text-blue-300 leading-tight">{roleName}</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[9px] text-emerald-400 font-medium leading-none">En línea</span>
              </div>
            </div>
          </div>
          <ChevronDown className={`h-4 w-4 text-blue-300 hover:text-white transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`} />
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;