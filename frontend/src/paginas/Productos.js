import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPublica } from "../servicios/api";
import TarjetaProducto from "../componentes/TarjetaProducto";
import { Search, Package, ShoppingCart } from "lucide-react";

const Productos = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    apiPublica.obtenerProductos().then(setProductos);
  }, []);

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Encabezado */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-2">
            <Package className="text-pink-600" size={28} />
            <h1 className="text-3xl font-bold text-gray-800">
              Nuestros Productos
            </h1>
          </div>
          <p className="text-gray-500">
            Explora nuestra variedad de pasteles y postres artesanales.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Buscador */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="text-sm text-gray-500">
            Todos nuestros productos en un solo listado.
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => navigate("/carrito")}
              className="flex items-center justify-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-sm font-medium text-pink-700 transition hover:bg-pink-100"
            >
              <ShoppingCart size={16} />
              Ver carrito
            </button>

            {/* Búsqueda */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-white text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-shadow"
              />
            </div>
          </div>
        </div>

        {/* Grid de productos */}
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosFiltrados.map((p) => (
              <TarjetaProducto key={p.id} producto={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Productos;
