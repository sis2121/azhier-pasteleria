import React, { useContext } from "react";
import { ContextoCarrito } from "./ContextoCarrito";
import { Plus, Edit, ShoppingBag, Percent } from "lucide-react";

const obtenerUrlImagen = (imagen) => {
  if (!imagen) return "/placeholder.jpg";
  if (imagen.startsWith("http")) return imagen;
  return `http://localhost:5000/static/uploads/${imagen}`;
};

const TarjetaProducto = ({ producto }) => {
  const { carrito, agregarAlCarrito, actualizarItem, eliminarItem } =
    useContext(ContextoCarrito);
  const existente = carrito.find((item) => item.producto_id === producto.id);

  const manejarAgregar = (presentacion) => {
    if (existente) {
      if (existente.presentacion_id === presentacion.id) {
        actualizarItem(existente.idCarrito, existente.cantidad + 1);
      } else {
        eliminarItem(existente.idCarrito);
        agregarAlCarrito({
          producto_id: producto.id,
          nombre: producto.nombre,
          presentacion_id: presentacion.id,
          porciones: presentacion.porciones,
          precio: presentacion.precio_final,
          descuento: presentacion.porcentaje_descuento,
          cantidad: 1,
        });
      }
    } else {
      agregarAlCarrito({
        producto_id: producto.id,
        nombre: producto.nombre,
        presentacion_id: presentacion.id,
        porciones: presentacion.porciones,
        precio: presentacion.precio_final,
        descuento: presentacion.porcentaje_descuento,
        cantidad: 1,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
      {/* Imagen */}
      <div className="relative overflow-hidden">
        <img
          src={obtenerUrlImagen(producto.imagen)}
          alt={producto.nombre}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {producto.es_destacado && (
          <span className="absolute top-3 left-3 bg-amber-400 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <Percent size={12} /> Destacado
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Nombre y descripción */}
        <h3 className="font-semibold text-gray-800 text-lg mb-1">
          {producto.nombre}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {producto.descripcion}
        </p>

        <div className="mt-auto space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-pink-600 font-bold text-xl">
              Bs. {producto.precio_porcion}
            </span>
            <span className="text-xs text-gray-400">/ porción</span>
          </div>

          {/* Presentaciones */}
          <div className="space-y-1.5">
            {producto.presentaciones?.map((pres) => (
              <div
                key={pres.id}
                className="flex items-center justify-between bg-gray-50 p-2 rounded-lg text-sm"
              >
                <div>
                  <span className="font-medium text-gray-700">
                    {pres.porciones} porc.
                  </span>
                  <span className="text-gray-400 mx-1">•</span>
                  <span className="text-green-600 text-xs">
                    {pres.porcentaje_descuento}% OFF
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">
                    Bs. {pres.precio_final}
                  </span>
                  <button
                    onClick={() => manejarAgregar(pres)}
                    className="p-1.5 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                    title={
                      existente ? "Editar en carrito" : "Agregar al carrito"
                    }
                  >
                    {existente ? <Edit size={14} /> : <Plus size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicador de ya en carrito */}
        {existente && (
          <div className="mt-3 flex items-center gap-1 text-xs text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
            <ShoppingBag size={12} />
            En carrito ({existente.cantidad})
          </div>
        )}
      </div>
    </div>
  );
};

export default TarjetaProducto;
