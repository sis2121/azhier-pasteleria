import React, { useEffect, useState } from "react";
import { apiAdmin } from "../servicios/api";

const GraficoGrafoEstatico = ({
  grafo,
  nodoResaltadoId = null,
  tipoIzquierda = "producto",
  tituloIzquierda = "Productos",
  tipoDerecha = "cliente",
  tituloDerecha = "Clientes",
}) => {
  const nodos = grafo?.nodos ?? [];
  const aristas = grafo?.aristas ?? [];

  const nodosFiltrados = nodoResaltadoId
    ? nodos.filter((nodo) => {
        if (nodo.id === nodoResaltadoId) return true;
        return aristas.some(
          (arista) =>
            (arista.origen === nodoResaltadoId && arista.destino === nodo.id) ||
            (arista.destino === nodoResaltadoId && arista.origen === nodo.id),
        );
      })
    : nodos;

  const aristasFiltradas = nodoResaltadoId
    ? aristas.filter(
        (arista) =>
          arista.origen === nodoResaltadoId ||
          arista.destino === nodoResaltadoId,
      )
    : aristas;

  const izquierda = nodosFiltrados.filter((n) => n.tipo === tipoIzquierda);
  const derecha = nodosFiltrados.filter((n) => n.tipo === tipoDerecha);
  const altura = Math.max(
    360,
    90 + Math.max(izquierda.length, derecha.length) * 44,
  );

  const posiciones = {};
  const calcularY = (index, total) => {
    if (total <= 1) return altura / 2;
    const margen = 70;
    const espacio = altura - margen * 2;
    return margen + (index * espacio) / (total - 1);
  };

  izquierda.forEach((nodo, index) => {
    posiciones[nodo.id] = { x: 140, y: calcularY(index, izquierda.length) };
  });

  derecha.forEach((nodo, index) => {
    posiciones[nodo.id] = { x: 620, y: calcularY(index, derecha.length) };
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
          {tituloIzquierda}
        </text>
        <text
          x="620"
          y="24"
          textAnchor="middle"
          fill="#2563eb"
          fontSize="13"
          fontWeight="700"
        >
          {tituloDerecha}
        </text>

        {aristasFiltradas.map((arista) => {
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

        {nodosFiltrados.map((nodo) => {
          const posicion = posiciones[nodo.id];
          if (!posicion) return null;
          const esResaltado = nodo.id === nodoResaltadoId;

          return (
            <g key={nodo.id}>
              <circle
                cx={posicion.x}
                cy={posicion.y}
                r={esResaltado ? "26" : "22"}
                fill={
                  esResaltado
                    ? "#be185d"
                    : nodo.tipo === "cliente"
                      ? "#2563eb"
                      : nodo.tipo === "metodo_pago"
                        ? "#0f766e"
                        : "#ec4899"
                }
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
                x={
                  nodo.tipo === tipoIzquierda
                    ? posicion.x - 34
                    : posicion.x + 32
                }
                y={posicion.y - 8}
                fill="#111827"
                fontSize="11"
                fontWeight="600"
                textAnchor={nodo.tipo === tipoIzquierda ? "end" : "start"}
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

  const productoMasConectado = (() => {
    const conteo = {};
    (datos.grafo_bipartito?.nodos ?? []).forEach((nodo) => {
      if (nodo.tipo === "producto") {
        conteo[nodo.id] = 0;
      }
    });

    (datos.grafo_bipartito?.aristas ?? []).forEach((arista) => {
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

    return mejor
      ? (datos.grafo_bipartito?.nodos ?? []).find(
          (nodo) => nodo.id === mejor.id,
        )
      : null;
  })();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Analítica de Negocio</h2>

      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <h3 className="font-semibold text-lg mb-3">
          Relación completa cliente ↔ producto
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          Vista estática de todas las conexiones entre clientes y productos.
        </p>
        <GraficoGrafoEstatico grafo={datos.grafo_bipartito} />
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <h3 className="font-semibold text-lg mb-3">Producto más comprado</h3>
        <p className="text-sm text-gray-500 mb-3">
          {productoMasConectado
            ? `Nodo destacado: ${productoMasConectado.etiqueta}`
            : "No hay suficiente información para resaltar un producto."}
        </p>
        <GraficoGrafoEstatico
          grafo={datos.grafo_bipartito}
          nodoResaltadoId={productoMasConectado?.id}
        />
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <h3 className="font-semibold text-lg mb-3">
          Clientes que compran más de un producto
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          Muestra a los clientes que tienen varias compras de productos
          diferentes.
        </p>
        <GraficoGrafoEstatico
          grafo={datos.grafo_clientes_multi_producto}
          tipoIzquierda="producto"
          tituloIzquierda="Productos"
          tipoDerecha="cliente"
          tituloDerecha="Clientes"
        />
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <h3 className="font-semibold text-lg mb-3">
          Relación cliente ↔ método de pago
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          Conexiones entre clientes y los métodos de pago que han utilizado.
        </p>
        <GraficoGrafoEstatico
          grafo={datos.grafo_clientes_metodos_pago}
          tipoIzquierda="metodo_pago"
          tituloIzquierda="Métodos de pago"
          tipoDerecha="cliente"
          tituloDerecha="Clientes"
        />
      </div>
    </div>
  );
};

export default AdminAnalitica;
