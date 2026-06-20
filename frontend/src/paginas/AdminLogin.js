import React, { useState } from "react";
import { apiAdmin } from "../servicios/api";
import { useNavigate, Link } from "react-router-dom";
import { Shield, LogIn, Eye, EyeOff, ArrowLeft, Cake } from "lucide-react";

const AdminLogin = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [mostrarPass, setMostrarPass] = useState(false);
  const [cargando, setCargando] = useState(false);
  const navegar = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    const res = await apiAdmin.login(usuario, contrasena);
    setCargando(false);
    if (res.token) {
      localStorage.setItem("tokenAdmin", res.token);
      navegar("/admin/panel");
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Tarjeta principal */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Encabezado con gradiente */}
          <div className="bg-gradient-to-r from-pink-600 to-rose-500 p-8 text-center text-white">
            <div className="inline-flex p-3 bg-white/20 rounded-full mb-4">
              <Cake size={32} />
            </div>
            <h1 className="text-2xl font-bold mb-1">Panel Administrativo</h1>
            <p className="text-pink-100 text-sm">AZHIER Pastelería</p>
          </div>

          {/* Formulario */}
          <form onSubmit={manejarEnvio} className="p-8">
            <div className="flex items-center gap-2 mb-6 text-gray-500">
              <Shield size={18} />
              <span className="text-sm font-medium">Acceso restringido</span>
            </div>

            {/* Usuario */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all text-gray-700"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={mostrarPass ? "text" : "password"}
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all text-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPass(!mostrarPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {mostrarPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
                <span className="text-red-500">⚠</span> {error}
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {cargando ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <LogIn size={20} />
              )}
              {cargando ? "Ingresando..." : "Ingresar"}
            </button>

            {/* Volver a la tienda */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-gray-500 hover:text-pink-600 text-sm transition-colors"
              >
                <ArrowLeft size={16} /> Volver a la tienda
              </Link>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          © {new Date().getFullYear()} AZHIER. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
