import React, { useEffect, useState } from "react";
import { apiAdmin } from "../servicios/api";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, Clock, Package, ChevronRight } from "lucide-react";

const COLOR_PINK = "#ec4899";
const COLOR_LIGHT_PINK = "#fbcfe8";

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

      {/* Gráfico horizontal de productos más vendidos */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Productos más vendidos
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={datos.mas_vendidos}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f3f4f6"
                horizontal={false}
              />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                dataKey="nombre"
                type="category"
                tick={{ fontSize: 13 }}
                width={100}
              />
              <Tooltip cursor={{ fill: "#fdf2f8" }} />
              <Bar dataKey="cantidad" radius={[0, 8, 8, 0]} barSize={20}>
                {datos.mas_vendidos.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? COLOR_PINK : COLOR_LIGHT_PINK}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 text-xs text-gray-500 text-right">
          Cantidad de unidades vendidas
        </div>
      </div>

      {/* Lista rápida de productos top (opcional, refuerza información) */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Top 5 productos
        </h3>
        <div className="divide-y divide-gray-100">
          {datos.mas_vendidos.map((prod, idx) => (
            <div key={idx} className="flex justify-between items-center py-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-pink-500">
                  #{idx + 1}
                </span>
                <span className="text-gray-700">{prod.nombre}</span>
              </div>
              <span className="text-sm font-semibold text-gray-600">
                {prod.cantidad} vendidos
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
