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
} from "recharts";
import ForceGraph2D from "react-force-graph-2d";

const AdminAnalitica = () => {
  const [datos, setDatos] = useState(null);
  useEffect(() => {
    apiAdmin.obtenerAnalitica().then(setDatos);
  }, []);

  if (!datos) return <p className="p-6 text-gray-500">Cargando analítica...</p>;

  const datosGrafo = {
    nodes: datos.grafo_bipartito.nodos.map((n) => ({
      id: n.id,
      group: n.tipo,
      etiqueta: n.etiqueta,
    })),
    links: datos.grafo_bipartito.aristas.map((e) => ({
      source: e.origen,
      target: e.destino,
      value: e.peso,
    })),
  };

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
        <h3 className="font-semibold text-lg mb-3">Productos menos vendidos</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datos.menos_vendidos} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                horizontal={false}
              />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="nombre" tick={{ fontSize: 12 }} width={100} />
              <Tooltip />
              <Bar
                dataKey="cantidad"
                fill="#f97316"
                radius={[0, 4, 4, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <h3 className="font-semibold text-lg mb-3">Grafo Cliente ↔ Producto</h3>
        <p className="text-sm text-gray-500 mb-2">
          Conexiones entre clientes y productos comprados. Pasa el cursor sobre
          un nodo.
        </p>
        <div style={{ height: 450 }} className="border rounded bg-gray-50">
          <ForceGraph2D
            graphData={datosGrafo}
            nodeLabel="etiqueta"
            nodeAutoColorBy="group"
            linkWidth={(link) => link.value}
            linkDirectionalArrowLength={3}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.etiqueta;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillStyle = node.group === "cliente" ? "#3b82f6" : "#ec4899";
              ctx.fillText(label, node.x, node.y);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalitica;
