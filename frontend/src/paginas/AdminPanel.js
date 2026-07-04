import React, { useEffect, useState } from "react";
import { apiAdmin } from "../servicios/api";
import { Link } from "react-router-dom";
import { TrendingUp, Clock, Package, ChevronRight } from "lucide-react";

const AdminPanel = () => {
  const [datos, setDatos] = useState(null);
  useEffect(() => {
    apiAdmin.obtenerPanel().then(setDatos);
  }, []);

  if (!datos) return <p className="p-6 text-gray-500">Cargando panel...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Panel de Control</h2>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full">
            <TrendingUp className="text-green-600" size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Ventas totales</p>
            <p className="text-2xl font-bold text-gray-800">
              Bs. {datos.ventas_totales.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-yellow-100 rounded-full">
            <Clock className="text-yellow-600" size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Pedidos pendientes</p>
            <p className="text-2xl font-bold text-gray-800">
              {datos.pedidos_pendientes}
            </p>
          </div>
        </div>

        <Link
          to="/admin/productos"
          className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-100 rounded-full">
              <Package className="text-pink-600" size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Productos</p>
              <p className="text-xl font-bold text-gray-800">Gestionar</p>
            </div>
          </div>
          <ChevronRight className="text-gray-400" size={20} />
        </Link>
      </div>
    </div>
  );
};

export default AdminPanel;
