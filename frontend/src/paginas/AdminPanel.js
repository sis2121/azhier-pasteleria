import React, { useEffect, useState } from "react";
import { apiAdmin } from "../servicios/api";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Clock,
  Package,
  ChevronRight,
  Sparkles,
  Users,
  CreditCard,
} from "lucide-react";

const AdminPanel = () => {
  const [datos, setDatos] = useState(null);
  useEffect(() => {
    apiAdmin.obtenerPanel().then(setDatos);
  }, []);

  if (!datos) return <p className="p-6 text-gray-500">Cargando panel...</p>;

  const productoMasVendido = datos.mas_vendidos?.[0];

  const clienteConMayorVariedad = (() => {
    const nodos = datos.grafo_clientes_multi_producto?.nodos ?? [];
    const aristas = datos.grafo_clientes_multi_producto?.aristas ?? [];
    const conteo = {};

    nodos.forEach((nodo) => {
      if (nodo.tipo === "cliente") {
        conteo[nodo.id] = 0;
      }
    });

    aristas.forEach((arista) => {
      if (conteo[arista.origen] !== undefined) {
        conteo[arista.origen] += 1;
      }
      if (conteo[arista.destino] !== undefined) {
        conteo[arista.destino] += 1;
      }
    });

    let mejor = null;
    Object.entries(conteo).forEach(([id, valor]) => {
      if (!mejor || valor > mejor.valor) {
        mejor = { id, valor };
      }
    });

    return mejor ? nodos.find((nodo) => nodo.id === mejor.id) : null;
  })();

  const metodoPagoMasUsado = (() => {
    const nodos = datos.grafo_clientes_metodos_pago?.nodos ?? [];
    const aristas = datos.grafo_clientes_metodos_pago?.aristas ?? [];
    const conteo = {};

    nodos.forEach((nodo) => {
      if (nodo.tipo === "metodo_pago") {
        conteo[nodo.id] = 0;
      }
    });

    aristas.forEach((arista) => {
      if (conteo[arista.destino] !== undefined) {
        conteo[arista.destino] += 1;
      }
      if (conteo[arista.origen] !== undefined) {
        conteo[arista.origen] += 1;
      }
    });

    let mejor = null;
    Object.entries(conteo).forEach(([id, valor]) => {
      if (!mejor || valor > mejor.valor) {
        mejor = { id, valor };
      }
    });

    return mejor ? nodos.find((nodo) => nodo.id === mejor.id) : null;
  })();

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2 text-pink-600">
            <Sparkles size={18} />
            <h3 className="font-semibold text-gray-800">Producto estrella</h3>
          </div>
          <p className="text-sm text-gray-600">
            {productoMasVendido
              ? `${productoMasVendido.nombre} lidera las ventas con ${productoMasVendido.cantidad} unidades.`
              : "Aún no hay suficientes ventas para destacar un producto."}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2 text-blue-600">
            <Users size={18} />
            <h3 className="font-semibold text-gray-800">
              Cliente con más variedad
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            {clienteConMayorVariedad
              ? `${clienteConMayorVariedad.etiqueta} compra varios productos diferentes.`
              : "No hay clientes con variedad suficiente para mostrar."}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2 text-teal-600">
            <CreditCard size={18} />
            <h3 className="font-semibold text-gray-800">
              Método de pago más usado
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            {metodoPagoMasUsado
              ? `${metodoPagoMasUsado.etiqueta} es el método más repetido.`
              : "Aún no hay datos suficientes de pagos."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
