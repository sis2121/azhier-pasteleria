import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, Package, Shield } from "lucide-react";

const BarraNav = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const enlaces = [
    { nombre: "Inicio", ruta: "/", icono: Home },
    { nombre: "Productos", ruta: "/productos", icono: Package },
    { nombre: "Administración", ruta: "/admin", icono: Shield },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-pink-800 font-bold text-xl hover:text-pink-600 transition-colors"
          >
            <img
              src="/images/logopastel.png"
              alt="Azhier Pastelería"
              className="h-17 w-17 object-contain"
            />
            <span>AZHIER</span>
          </Link>

          {/* Enlaces escritorio */}
          <div className="hidden md:flex items-center gap-1">
            {enlaces.map((enlace) => (
              <Link
                key={enlace.ruta}
                to={enlace.ruta}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all"
              >
                <enlace.icono size={18} />
                <span>{enlace.nombre}</span>
              </Link>
            ))}
          </div>

          {/* Botón hamburguesa (móvil) */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-pink-50 text-pink-800 transition-colors"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            {menuAbierto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menú móvil desplegable */}
        {menuAbierto && (
          <div className="md:hidden py-4 border-t border-pink-100 bg-white/95 backdrop-blur-sm rounded-b-2xl shadow-lg">
            <div className="flex flex-col gap-1">
              {enlaces.map((enlace) => (
                <Link
                  key={enlace.ruta}
                  to={enlace.ruta}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  <enlace.icono size={20} />
                  <span>{enlace.nombre}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default BarraNav;
