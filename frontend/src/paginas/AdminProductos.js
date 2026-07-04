import React, { useEffect, useState } from "react";
import { apiAdmin } from "../servicios/api";
import { Link } from "react-router-dom";
import { Edit, Trash, Plus, Search, Package, ImageOff } from "lucide-react";
import ConfirmarModal from "../componentes/ConfirmarModal";

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  const cargar = () => apiAdmin.obtenerProductos().then(setProductos);
  useEffect(() => {
    cargar();
  }, []);

  const confirmarEliminar = (id) => {
    setIdAEliminar(id);
    setModalAbierto(true);
  };

  const ejecutarEliminar = async () => {
    if (idAEliminar) {
      await apiAdmin.eliminarProducto(idAEliminar);
      cargar();
      setIdAEliminar(null);
    }
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Package className="text-pink-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Productos</h2>
          <span className="bg-pink-100 text-pink-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {productos.length}
          </span>
        </div>
        <Link
          to="/admin/productos/nuevo"
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
        >
          <Plus size={18} /> Nuevo producto
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Producto</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">
                  Categoría
                </th>
                <th className="px-6 py-4 font-medium">Precio</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">
                  Destacado
                </th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-pink-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                          {p.imagen ? (
                            <img
                              src={
                                p.imagen.startsWith("http")
                                  ? p.imagen
                                  : `http://localhost:5000/static/uploads/${p.imagen}`
                              }
                              alt={p.nombre}
                              className="w-full h-full object-cover"
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ImageOff size={18} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {p.nombre}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">
                        Bs. {p.precio_porcion}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      {p.es_destacado ? (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          ★ Destacado
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/productos/editar/${p.id}`}
                          className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => confirmarEliminar(p.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmarModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onConfirm={ejecutarEliminar}
        mensaje="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default AdminProductos;
