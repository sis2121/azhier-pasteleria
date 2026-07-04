import React, { useContext } from "react";
import { ContextoCarrito } from "./ContextoCarrito";
import { Plus, ShoppingBag, Percent, Check } from "lucide-react";

const obtenerUrlImagen = (imagen) => {
  if (!imagen) return "/placeholder.jpg";
  if (imagen.startsWith("http")) return imagen;
  return `http://localhost:5000/static/uploads/${imagen}`;
};

const TarjetaProducto = ({ producto }) => {
  const { carrito, agregarAlCarrito, actualizarItem } =
    useContext(ContextoCarrito);

  const obtenerPrecioFinal = (presentacion) => {
    const precioBase =
      Number(producto.precio_porcion || 0) *
      Number(presentacion.porciones || 0);
    const descuento = Number(presentacion.porcentaje_descuento || 0);
    const precioCalculado =
      presentacion.precio_final != null
        ? Number(presentacion.precio_final)
        : precioBase * (1 - descuento / 100);
    return Number(precioCalculado.toFixed(2));
  };

  const obtenerPrecioOriginal = (presentacion) => {
    const precioBase =
      Number(producto.precio_porcion || 0) *
      Number(presentacion.porciones || 0);
    return Number(precioBase.toFixed(2));
  };

  const encontrarItem = (presentacion) =>
    carrito.find(
      (item) =>
        item.producto_id === producto.id &&
        item.presentacion_id === presentacion.id,
    );

  const manejarAgregar = (presentacion) => {
    const itemExistente = encontrarItem(presentacion);
    if (itemExistente) {
      actualizarItem(itemExistente.idCarrito, itemExistente.cantidad + 1);
      return;
    }

    agregarAlCarrito({
      producto_id: producto.id,
      nombre: producto.nombre,
      presentacion_id: presentacion.id,
      porciones: presentacion.porciones,
      precio: obtenerPrecioFinal(presentacion),
      precio_original: obtenerPrecioOriginal(presentacion),
      descuento: Number(presentacion.porcentaje_descuento || 0),
      cantidad: 1,
    });
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
            {producto.presentaciones?.map((pres) => {
              const itemActual = encontrarItem(pres);
              return (
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
                      Bs. {obtenerPrecioFinal(pres)}
                    </span>
                    <button
                      onClick={() => manejarAgregar(pres)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold transition-all ${
                        itemActual
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-pink-500 text-white hover:bg-pink-600"
                      }`}
                      title={
                        itemActual
                          ? `Agregar otra unidad de ${producto.nombre}`
                          : `Agregar ${producto.nombre} (${pres.porciones} porc.) al carrito`
                      }
                    >
                      {itemActual ? <Check size={14} /> : <Plus size={14} />}
                      <span>{itemActual ? "Añadir otra" : "Agregar"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarjetaProducto;
