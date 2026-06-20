import React, { useEffect, useState } from "react";
import { apiAdmin } from "../servicios/api";
import {
  Trash2,
  Search,
  ClipboardList,
  Package,
  MapPin,
  Phone,
  User,
  Clock,
  Banknote,
  QrCode,
  ChevronDown,
  Eye,
  X,
  Edit,
  Save,
  Plus,
  Minus,
} from "lucide-react";
import ConfirmarModal from "../componentes/ConfirmarModal";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);
  const [expandido, setExpandido] = useState(null);
  const [mapaModal, setMapaModal] = useState(null);
  const [editarModal, setEditarModal] = useState(null); // pedido a editar
  const [editando, setEditando] = useState(false);

  const cargar = () => apiAdmin.obtenerPedidos().then(setPedidos);
  useEffect(() => {
    cargar();
  }, []);

  const cambiarEstado = async (id, estado) => {
    await apiAdmin.actualizarPedido(id, { estado });
    cargar();
  };

  const confirmarEliminar = (id) => {
    setIdAEliminar(id);
    setModalAbierto(true);
  };

  const ejecutarEliminar = async () => {
    if (idAEliminar) {
      await apiAdmin.eliminarPedido(idAEliminar);
      cargar();
      setIdAEliminar(null);
    }
  };

  const abrirMapa = (ubicacion) => {
    if (!ubicacion) return;
    const partes = ubicacion.split(",");
    if (partes.length === 2) {
      const lat = parseFloat(partes[0]);
      const lng = parseFloat(partes[1]);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapaModal({ lat, lng });
      }
    }
  };

  const abrirEdicion = (pedido) => {
    // Clonar pedido con sus items para editar
    setEditarModal({
      ...pedido,
      items: pedido.items.map((item) => ({
        id: item.id,
        producto_id: item.producto_id,
        presentacion_id: item.presentacion_id,
        nombre_producto: item.nombre_producto,
        presentacion: item.presentacion,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        subtotal: item.subtotal,
      })),
    });
  };

  const cerrarEdicion = () => {
    setEditarModal(null);
  };

  const guardarEdicion = async () => {
    if (!editarModal) return;
    setEditando(true);
    const payload = {
      nombre_cliente: editarModal.nombre_cliente,
      telefono: editarModal.telefono,
      ubicacion: editarModal.ubicacion,
      metodo_pago: editarModal.metodo_pago,
      estado: editarModal.estado,
      items: editarModal.items.map((item) => ({
        presentacion_id: item.presentacion_id,
        cantidad: item.cantidad,
      })),
    };
    try {
      await apiAdmin.actualizarPedido(editarModal.id, payload);
      setEditarModal(null);
      cargar();
    } catch (error) {
      alert("Error al actualizar el pedido");
    } finally {
      setEditando(false);
    }
  };

  const pedidosFiltrados = pedidos.filter(
    (p) =>
      p.nombre_cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.telefono.includes(busqueda) ||
      p.estado.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-700";
      case "Confirmado":
        return "bg-blue-100 text-blue-700";
      case "Preparando":
        return "bg-purple-100 text-purple-700";
      case "Entregado":
        return "bg-green-100 text-green-700";
      case "Cancelado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const obtenerIconoPago = (metodo) => {
    return metodo === "QR" ? <QrCode size={14} /> : <Banknote size={14} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <ClipboardList className="text-pink-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Pedidos</h2>
          <span className="bg-pink-100 text-pink-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {pedidos.length}
          </span>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Buscar por cliente, teléfono o estado..."
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
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">
                  Contacto
                </th>
                <th className="px-6 py-4 font-medium">Pago</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pedidosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No se encontraron pedidos
                  </td>
                </tr>
              ) : (
                pedidosFiltrados.map((pedido) => (
                  <React.Fragment key={pedido.id}>
                    <tr
                      className="hover:bg-pink-50/30 transition-colors cursor-pointer"
                      onClick={() =>
                        setExpandido(expandido === pedido.id ? null : pedido.id)
                      }
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                            <User size={16} />
                          </div>
                          <span className="font-medium text-gray-800">
                            {pedido.nombre_cliente}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1 text-xs">
                            <Phone size={12} className="text-gray-400" />
                            {pedido.telefono}
                          </div>
                          {pedido.ubicacion && (
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                              <MapPin size={12} />
                              {pedido.ubicacion}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                          {obtenerIconoPago(pedido.metodo_pago)}{" "}
                          {pedido.metodo_pago}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-800">
                          Bs. {pedido.monto_total}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={pedido.estado}
                          onChange={(e) =>
                            cambiarEstado(pedido.id, e.target.value)
                          }
                          className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer outline-none ${obtenerColorEstado(pedido.estado)}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option>Pendiente</option>
                          <option>Confirmado</option>
                          <option>Preparando</option>
                          <option>Entregado</option>
                          <option>Cancelado</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {pedido.ubicacion && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                abrirMapa(pedido.ubicacion);
                              }}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ver ubicación"
                            >
                              <Eye size={18} />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              abrirEdicion(pedido);
                            }}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Editar pedido"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmarEliminar(pedido.id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar pedido"
                          >
                            <Trash2 size={18} />
                          </button>
                          <ChevronDown
                            size={18}
                            className={`text-gray-400 transition-transform ${expandido === pedido.id ? "rotate-180" : ""}`}
                          />
                        </div>
                      </td>
                    </tr>
                    {expandido === pedido.id && (
                      <tr>
                        <td colSpan="6" className="bg-gray-50 px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Clock size={14} className="text-pink-500" />{" "}
                                Datos del pedido
                              </h4>
                              <div className="text-xs text-gray-500 space-y-1">
                                <p>
                                  <span className="font-medium">Creado:</span>{" "}
                                  {new Date(pedido.creado_en).toLocaleString()}
                                </p>
                                <p>
                                  <span className="font-medium">
                                    Actualizado:
                                  </span>{" "}
                                  {new Date(
                                    pedido.actualizado_en,
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Package size={14} className="text-pink-500" />{" "}
                                Productos
                              </h4>
                              <ul className="space-y-1">
                                {pedido.items.map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="text-xs text-gray-600 flex justify-between"
                                  >
                                    <span>
                                      {item.nombre_producto} (
                                      {item.presentacion}) x{item.cantidad}
                                    </span>
                                    <span className="font-medium">
                                      Bs. {item.subtotal}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {pedido.ubicacion && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                  <MapPin size={14} className="text-pink-500" />{" "}
                                  Ubicación
                                </h4>
                                <p className="text-xs text-gray-500 mb-2">
                                  {pedido.ubicacion}
                                </p>
                                <button
                                  onClick={() => abrirMapa(pedido.ubicacion)}
                                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                                >
                                  Ver en mapa
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de mapa */}
      {mapaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMapaModal(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full">
            <button
              onClick={() => setMapaModal(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="text-pink-500" size={20} /> Ubicación del
              pedido
            </h3>
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <MapContainer
                center={[mapaModal.lat, mapaModal.lng]}
                zoom={15}
                style={{ height: "300px", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[mapaModal.lat, mapaModal.lng]} />
              </MapContainer>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Lat: {mapaModal.lat.toFixed(4)}, Lng: {mapaModal.lng.toFixed(4)}
            </p>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {editarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={cerrarEdicion}
          />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={cerrarEdicion}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Edit className="text-pink-500" size={20} /> Editar Pedido #
              {editarModal.id}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre cliente
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm"
                    value={editarModal.nombre_cliente}
                    onChange={(e) =>
                      setEditarModal({
                        ...editarModal,
                        nombre_cliente: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm"
                    value={editarModal.telefono}
                    onChange={(e) =>
                      setEditarModal({
                        ...editarModal,
                        telefono: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ubicación (lat,lng)
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm"
                    value={editarModal.ubicacion || ""}
                    onChange={(e) =>
                      setEditarModal({
                        ...editarModal,
                        ubicacion: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Método de pago
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm"
                    value={editarModal.metodo_pago}
                    onChange={(e) =>
                      setEditarModal({
                        ...editarModal,
                        metodo_pago: e.target.value,
                      })
                    }
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="QR">QR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm"
                    value={editarModal.estado}
                    onChange={(e) =>
                      setEditarModal({ ...editarModal, estado: e.target.value })
                    }
                  >
                    <option>Pendiente</option>
                    <option>Confirmado</option>
                    <option>Preparando</option>
                    <option>Entregado</option>
                    <option>Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Productos del pedido */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Productos
                </h3>
                <div className="space-y-2">
                  {editarModal.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">
                          {item.nombre_producto} ({item.presentacion})
                        </p>
                        <p className="text-xs text-gray-500">
                          Bs. {item.precio_unitario} c/u
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            const nuevosItems = [...editarModal.items];
                            if (nuevosItems[idx].cantidad > 1) {
                              nuevosItems[idx].cantidad -= 1;
                              nuevosItems[idx].subtotal =
                                nuevosItems[idx].cantidad *
                                nuevosItems[idx].precio_unitario;
                              setEditarModal({
                                ...editarModal,
                                items: nuevosItems,
                              });
                            }
                          }}
                          className="p-1 text-gray-500 hover:text-pink-600"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center text-sm">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => {
                            const nuevosItems = [...editarModal.items];
                            nuevosItems[idx].cantidad += 1;
                            nuevosItems[idx].subtotal =
                              nuevosItems[idx].cantidad *
                              nuevosItems[idx].precio_unitario;
                            setEditarModal({
                              ...editarModal,
                              items: nuevosItems,
                            });
                          }}
                          className="p-1 text-gray-500 hover:text-pink-600"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          const nuevosItems = editarModal.items.filter(
                            (_, i) => i !== idx,
                          );
                          setEditarModal({
                            ...editarModal,
                            items: nuevosItems,
                          });
                        }}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                {editarModal.items.length === 0 && (
                  <p className="text-xs text-gray-400">
                    No hay productos en este pedido.
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={cerrarEdicion}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={guardarEdicion}
                disabled={editando}
                className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={16} />
                {editando ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmarModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onConfirm={ejecutarEliminar}
        mensaje="¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default AdminPedidos;
