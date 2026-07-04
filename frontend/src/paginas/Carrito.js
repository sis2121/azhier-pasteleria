import React, { useContext } from "react";
import { ContextoCarrito } from "../componentes/ContextoCarrito";
import { Link } from "react-router-dom";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowLeft,
  ShoppingCart,
  ArrowRight,
  Tag,
} from "lucide-react";

const Carrito = () => {
  const {
    carrito,
    actualizarItem,
    eliminarItem,
    vaciarCarrito,
    subtotal,
    ahorroTotal,
    total,
  } = useContext(ContextoCarrito);

  if (carrito.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-3xl shadow-sm border border-gray-100 max-w-md mx-auto">
          <div className="inline-flex p-4 bg-pink-100 rounded-full mb-4">
            <ShoppingCart className="text-pink-600" size={36} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Carrito vacío
          </h2>
          <p className="text-gray-500 mb-6">
            Aún no has agregado productos. ¡Elige algo delicioso!
          </p>
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors"
          >
            <ShoppingBag size={18} /> Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <ShoppingCart className="text-pink-600" size={30} />
              Mi Carrito
            </h1>
            <p className="text-gray-500 mt-1">
              {carrito.length} producto(s) en tu carrito
            </p>
          </div>
          <button
            onClick={vaciarCarrito}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium transition-colors bg-red-50 px-4 py-2 rounded-full"
          >
            <Trash2 size={16} /> Vaciar carrito
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lista de productos */}
          <div className="flex-1 space-y-4">
            {carrito.map((item) => (
              <div
                key={item.idCarrito}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Info del producto */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {item.nombre}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">
                        {item.porciones} porciones
                      </span>
                      {item.descuento > 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          -{item.descuento}% OFF
                        </span>
                      )}
                    </div>
                    <p className="text-pink-600 font-bold mt-2">
                      Bs. {(item.precio * item.cantidad).toFixed(2)}
                    </p>
                  </div>

                  {/* Controles */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-100 rounded-full">
                      <button
                        onClick={() =>
                          actualizarItem(item.idCarrito, item.cantidad - 1)
                        }
                        className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-3 font-medium text-gray-800">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() =>
                          actualizarItem(item.idCarrito, item.cantidad + 1)
                        }
                        className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => eliminarItem(item.idCarrito)}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <Link
              to="/productos"
              className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium mt-4"
            >
              <ArrowLeft size={18} /> Seguir comprando
            </Link>
          </div>

          {/* Resumen */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Tag size={20} className="text-pink-600" /> Resumen del pedido
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Bs. {subtotal.toFixed(2)}</span>
                </div>
                {ahorroTotal > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Ahorro</span>
                    <span>- Bs. {ahorroTotal.toFixed(2)}</span>
                  </div>
                )}
                <hr className="border-gray-200" />
                <div className="flex justify-between text-gray-800 font-bold text-lg">
                  <span>Total</span>
                  <span>Bs. {total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/finalizar-pedido"
                className="mt-6 w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                Finalizar pedido <ArrowRight size={18} />
              </Link>

              <p className="text-xs text-gray-400 text-center mt-3">
                Métodos de pago: Efectivo o QR
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
