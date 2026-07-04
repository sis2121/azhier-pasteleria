import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ContextoCarrito } from "../componentes/ContextoCarrito";
import { apiPublica } from "../servicios/api";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  User,
  Phone,
  MapPin,
  CreditCard,
  Banknote,
  QrCode,
  ShoppingBag,
  CheckCircle,
  ArrowLeft,
  MapPinned,
  Send,
} from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const SelectorUbicacion = ({ alSeleccionar }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      alSeleccionar({ lat, lng });
    },
  });
  return null;
};

const FinalizarPedido = () => {
  const { carrito, total, vaciarCarrito } = useContext(ContextoCarrito);
  const navegar = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    pago: "Efectivo",
  });
  const [ubicacion, setUbicacion] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.telefono || !ubicacion) {
      alert("Complete todos los campos y seleccione ubicación en el mapa");
      return;
    }
    setEnviando(true);
    const datosPedido = {
      nombre_cliente: form.nombre,
      telefono: form.telefono,
      ubicacion: `${ubicacion.lat},${ubicacion.lng}`,
      metodo_pago: form.pago,
      items: carrito.map((item) => ({
        producto_id: item.producto_id,
        presentacion_id: item.presentacion_id,
        cantidad: item.cantidad,
      })),
    };
    try {
      await apiPublica.crearPedido(datosPedido);
      vaciarCarrito();
      setMensaje("¡Pedido realizado con éxito! Lo contactaremos pronto.");
    } catch (err) {
      alert("Error al crear pedido");
    } finally {
      setEnviando(false);
    }
  };

  if (mensaje) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center max-w-lg">
          <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{mensaje}</h2>
          <button
            onClick={() => navegar("/")}
            className="mt-6 bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="text-pink-600" size={28} />
          <h1 className="text-3xl font-bold text-gray-800">Finalizar Pedido</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <form onSubmit={manejarEnvio}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User size={20} className="text-pink-600" /> Datos personales
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo
                    </label>
                    <input
                      className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                      placeholder="Ej: María García"
                      value={form.nombre}
                      onChange={(e) =>
                        setForm({ ...form, nombre: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                        placeholder="+591 12345678"
                        value={form.telefono}
                        onChange={(e) =>
                          setForm({ ...form, telefono: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPinned size={20} className="text-pink-600" /> Ubicación de
                  entrega
                </h2>
                <p className="text-sm text-gray-500 mb-3">
                  Haz clic en el mapa para marcar tu ubicación.
                </p>
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <MapContainer
                    center={[-14.83, -64.9]}
                    zoom={13}
                    style={{ height: "320px", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <SelectorUbicacion alSeleccionar={setUbicacion} />
                    {ubicacion && (
                      <Marker position={[ubicacion.lat, ubicacion.lng]} />
                    )}
                  </MapContainer>
                </div>
                {ubicacion && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <MapPin size={14} className="text-pink-500" />
                    Lat: {ubicacion.lat.toFixed(4)}, Lng:{" "}
                    {ubicacion.lng.toFixed(4)}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-pink-600" /> Método de
                  pago
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, pago: "Efectivo" })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      form.pago === "Efectivo"
                        ? "border-pink-500 bg-pink-50 text-pink-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <Banknote size={20} /> Efectivo
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, pago: "QR" })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      form.pago === "QR"
                        ? "border-pink-500 bg-pink-50 text-pink-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <QrCode size={20} /> QR
                  </button>
                </div>
              </div>

              <div className="lg:hidden mt-6">
                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {enviando ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send size={18} /> Confirmar pedido
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="w-full lg:w-96">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ShoppingBag size={20} className="text-pink-600" /> Resumen del
                pedido
              </h2>

              <div className="space-y-2 mb-4">
                {carrito.map((item) => (
                  <div
                    key={item.idCarrito}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-600">
                      {item.nombre} x{item.cantidad}
                    </span>
                    <span className="font-medium">
                      Bs. {(item.precio * item.cantidad).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="border-gray-200 mb-4" />

              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>Total</span>
                <span>Bs. {total.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                onClick={manejarEnvio}
                disabled={enviando}
                className="hidden lg:flex mt-6 w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {enviando ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send size={18} /> Confirmar pedido
                  </>
                )}
              </button>

              <Link
                to="/carrito"
                className="mt-4 flex items-center justify-center gap-1 text-gray-500 hover:text-pink-600 text-sm transition-colors"
              >
                <ArrowLeft size={16} /> Volver al carrito
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalizarPedido;
