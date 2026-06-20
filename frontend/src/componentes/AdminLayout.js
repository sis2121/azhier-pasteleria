import React, { useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  BarChart3,
  LogOut,
  Cake,
  Menu,
  X,
} from "lucide-react";

const AdminLayout = () => {
  const navegar = useNavigate();
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  const cerrarSesion = () => {
    localStorage.removeItem("tokenAdmin");
    navegar("/admin");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Overlay para cerrar sidebar en móvil */}
      {sidebarAbierto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarAbierto(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed md:relative z-50 w-64 bg-pink-900 text-white flex flex-col p-4 h-full transition-transform duration-300 transform
        ${sidebarAbierto ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:flex-shrink-0
      `}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Cake size={24} />
            <h2 className="text-xl font-bold">AZHIER Admin</h2>
          </div>
          <button
            className="md:hidden text-white"
            onClick={() => setSidebarAbierto(false)}
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          <Link
            to="/admin/panel"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-pink-700 transition-colors"
            onClick={() => setSidebarAbierto(false)}
          >
            <LayoutDashboard size={18} /> Panel
          </Link>
          <Link
            to="/admin/productos"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-pink-700 transition-colors"
            onClick={() => setSidebarAbierto(false)}
          >
            <Package size={18} /> Productos
          </Link>
          <Link
            to="/admin/pedidos"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-pink-700 transition-colors"
            onClick={() => setSidebarAbierto(false)}
          >
            <ClipboardList size={18} /> Pedidos
          </Link>
          <Link
            to="/admin/analitica"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-pink-700 transition-colors"
            onClick={() => setSidebarAbierto(false)}
          >
            <BarChart3 size={18} /> Analítica
          </Link>
        </nav>
        <button
          onClick={cerrarSesion}
          className="flex items-center gap-3 p-3 mt-auto text-pink-200 hover:bg-pink-800 rounded-lg transition-colors"
        >
          <LogOut size={18} /> Cerrar sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* Botón para abrir sidebar en móvil */}
        <button
          className="md:hidden mb-4 p-2 bg-pink-600 text-white rounded-lg"
          onClick={() => setSidebarAbierto(true)}
        >
          <Menu size={20} />
        </button>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
