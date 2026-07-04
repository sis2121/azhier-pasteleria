import React, { useEffect, useState } from "react";
import { apiAdmin } from "../servicios/api";
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

const GraficoGrafoEstatico = ({ grafo }) => {
  const nodos = grafo?.nodos ?? [];
  const aristas = grafo?.aristas ?? [];
  const productos = nodos.filter((n) => n.tipo === "producto");
  const clientes = nodos.filter((n) => n.tipo === "cliente");
  const altura = Math.max(
    360,
    90 + Math.max(productos.length, clientes.length) * 44,
  );

  const posiciones = {};
  const calcularY = (index, total) => {
    if (total <= 1) return altura / 2;
    const margen = 70;
    const espacio = altura - margen * 2;
    return margen + (index * espacio) / (total - 1);
  };

  productos.forEach((nodo, index) => {
    posiciones[nodo.id] = { x: 140, y: calcularY(index, productos.length) };
  });

  clientes.forEach((nodo, index) => {
    posiciones[nodo.id] = { x: 620, y: calcularY(index, clientes.length) };
  });

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-2">
      <svg
        viewBox={`0 0 760 ${altura}`}
        className="w-full h-full min-h-[360px]"
      >
        <rect x="0" y="0" width="760" height={altura} rx="16" fill="#faf7f7" />
        <line
          x1="140"
          y1="30"
          x2="140"
          y2={altura - 30}
          stroke="#f2c8d8"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        <line
          x1="620"
          y1="30"
          x2="620"
          y2={altura - 30}
          stroke="#f2c8d8"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        <text
          x="140"
          y="24"
          textAnchor="middle"
          fill="#be185d"
          fontSize="13"
          fontWeight="700"
        >
          Productos
        </text>
        <text
          x="620"
          y="24"
          textAnchor="middle"
          fill="#2563eb"
          fontSize="13"
          fontWeight="700"
        >
          Clientes
        </text>

        {aristas.map((arista) => {
          const origen = posiciones[arista.origen];
          const destino = posiciones[arista.destino];
          if (!origen || !destino) return null;

          return (
            <line
              key={`${arista.origen}-${arista.destino}`}
              x1={origen.x}
              y1={origen.y}
              x2={destino.x}
              y2={destino.y}
              stroke="#6b7280"
              strokeWidth={Math.max(2.2, arista.peso * 0.8)}
              strokeOpacity="0.95"
            />
          );
        })}

        {nodos.map((nodo) => {
          const posicion = posiciones[nodo.id];
          if (!posicion) return null;

          return (
            <g key={nodo.id}>
              <circle
                cx={posicion.x}
                cy={posicion.y}
                r="22"
                fill={nodo.tipo === "cliente" ? "#2563eb" : "#ec4899"}
                stroke="#ffffff"
                strokeWidth="3"
              />
              <text
                x={posicion.x}
                y={posicion.y + 4}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="700"
              >
                {nodo.etiqueta.slice(0, 2).toUpperCase()}
              </text>
              <text
                x={nodo.tipo === "producto" ? posicion.x - 34 : posicion.x + 32}
                y={posicion.y - 8}
                fill="#111827"
                fontSize="11"
                fontWeight="600"
                textAnchor={nodo.tipo === "producto" ? "end" : "start"}
              >
                {nodo.etiqueta}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const AdminAnalitica = () => {
  const [datos, setDatos] = useState(null);
  useEffect(() => {
    apiAdmin.obtenerAnalitica().then(setDatos);
  }, []);

  if (!datos) return <p className="p-6 text-gray-500">Cargando analítica...</p>;

  const datosBarras = [...(datos.menos_vendidos || [])].sort(
    (a, b) => a.cantidad - b.cantidad,
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Analítica de Negocio</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h3 className="font-semibold text-lg mb-3">Clientes frecuentes</h3>
          <ul className="space-y-2">
            {datos.clientes_frecuentes.map((c) => (
              <li key={c.telefono} className="flex justify-between text-sm">
                <span className="text-gray-700">{c.telefono}</span>
                <span className="font-medium">{c.pedidos} pedidos</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h3 className="font-semibold text-lg mb-3">Clientes de alto valor</h3>
          <ul className="space-y-2">
            {datos.clientes_alto_valor.map((c) => (
              <li key={c.telefono} className="flex justify-between text-sm">
                <span className="text-gray-700">{c.telefono}</span>
                <span className="font-medium">Bs. {c.total_gastado}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <h3 className="font-semibold text-lg mb-3">
          Productos con menor demanda
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          Comparación simple de unidades vendidas por producto.
        </p>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={datosBarras}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="nombre"
                tick={{ fontSize: 12 }}
                width={120}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip />
              <Bar dataKey="cantidad" radius={[0, 8, 8, 0]} barSize={22}>
                {datosBarras.map((entrada, index) => (
                  <Cell
                    key={`${entrada.nombre}-${index}`}
                    fill={index % 2 === 0 ? "#ef4444" : "#f97316"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <h3 className="font-semibold text-lg mb-3">
          Relación cliente ↔ producto
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          Vista estática de las conexiones entre clientes y productos comprados.
        </p>
        <GraficoGrafoEstatico grafo={datos.grafo_bipartito} />
      </div>
    </div>
  );
};

export default AdminAnalitica;
