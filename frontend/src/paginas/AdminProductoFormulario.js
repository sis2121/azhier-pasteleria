import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiAdmin } from "../servicios/api";
import {
  Plus,
  Trash,
  Save,
  ArrowLeft,
  Upload,
  ImagePlus,
  Package,
  Percent,
  DollarSign,
} from "lucide-react";

const AdminProductoFormulario = () => {
  const { id } = useParams();
  const navegar = useNavigate();
  const esEditar = Boolean(id);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [destacado, setDestacado] = useState(false);
  const [imagen, setImagen] = useState(null);
  const [presentaciones, setPresentaciones] = useState([
    { porciones: 10, descuento: 0 },
  ]);
  const [vistaPrevia, setVistaPrevia] = useState({});
  const [imagenPreview, setImagenPreview] = useState(null);

  useEffect(() => {
    if (esEditar) {
      apiAdmin.obtenerProductos().then((prods) => {
        const p = prods.find((x) => x.id == id);
        if (p) {
          setNombre(p.nombre);
          setDescripcion(p.descripcion || "");
          setPrecio(p.precio_porcion);
          setDestacado(p.es_destacado);
          setPresentaciones(
            p.presentaciones.map((pr) => ({
              porciones: pr.porciones,
              descuento: pr.porcentaje_descuento,
              id: pr.id,
            })),
          );
          if (p.imagen) {
            setImagenPreview(
              p.imagen.startsWith("http")
                ? p.imagen
                : `http://localhost:5000/static/uploads/${p.imagen}`,
            );
          }
        }
      });
    }
  }, [id, esEditar]);

  const agregarPresentacion = () =>
    setPresentaciones([...presentaciones, { porciones: 10, descuento: 0 }]);
  const eliminarPresentacion = (indice) =>
    setPresentaciones(presentaciones.filter((_, i) => i !== indice));

  const actualizarPresentacion = (indice, campo, valor) => {
    const actualizadas = [...presentaciones];
    actualizadas[indice][campo] = valor;
    setPresentaciones(actualizadas);
    if (precio) {
      const p = parseFloat(precio);
      const porc = parseInt(actualizadas[indice].porciones) || 0;
      const desc = parseFloat(actualizadas[indice].descuento) || 0;
      const final = (p * porc * (1 - desc / 100)).toFixed(2);
      setVistaPrevia({ ...vistaPrevia, [indice]: final });
    }
  };

  const manejarImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("precio_porcion", precio);
    formData.append("es_destacado", destacado);
    if (imagen) formData.append("imagen", imagen);
    formData.append(
      "presentaciones",
      JSON.stringify(
        presentaciones.map((p) => ({
          porciones: p.porciones,
          porcentaje_descuento: p.descuento,
        })),
      ),
    );

    if (esEditar) {
      await apiAdmin.actualizarProducto(id, formData);
    } else {
      await apiAdmin.crearProducto(formData);
    }
    navegar("/admin/productos");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="text-pink-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">
            {esEditar ? "Editar Producto" : "Nuevo Producto"}
          </h2>
        </div>
        <button
          onClick={() => navegar("/admin/productos")}
          className="flex items-center gap-2 text-gray-500 hover:text-pink-600 transition-colors"
        >
          <ArrowLeft size={18} /> Volver
        </button>
      </div>

      <form
        onSubmit={manejarEnvio}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información básica */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">
              Información del producto
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                  placeholder="Ej: Torta de chocolate"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio por porción (Bs)
                  </label>
                  <div className="relative">
                    <DollarSign
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="number"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                      placeholder="0.00"
                      value={precio}
                      onChange={(e) => setPrecio(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                  rows="3"
                  placeholder="Breve descripción del producto..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
              <label className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl cursor-pointer hover:bg-pink-100 transition-colors">
                <input
                  type="checkbox"
                  checked={destacado}
                  onChange={(e) => setDestacado(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Producto destacado
                </span>
              </label>
            </div>
          </div>

          {/* Imagen */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ImagePlus size={20} className="text-pink-600" /> Imagen del
              producto
            </h3>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-full sm:w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 hover:border-pink-400 transition-colors">
                {imagenPreview ? (
                  <img
                    src={imagenPreview}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="text-gray-400" size={32} />
                )}
              </div>
              <div className="flex-1">
                <label className="flex items-center gap-2 bg-white border border-gray-200 hover:border-pink-300 px-4 py-3 rounded-xl cursor-pointer transition-colors text-gray-700 text-sm font-medium w-full sm:w-auto">
                  <Upload size={18} />
                  {esEditar ? "Cambiar imagen" : "Seleccionar imagen"}
                  <input
                    type="file"
                    className="hidden"
                    onChange={manejarImagen}
                    accept="image/*"
                  />
                </label>
                <p className="text-xs text-gray-400 mt-2">
                  Formatos: JPG, PNG. Tamaño recomendado: 400x400px.
                </p>
              </div>
            </div>
          </div>

          {/* Presentaciones */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Percent size={20} className="text-pink-600" /> Presentaciones
              </h3>
              <button
                type="button"
                onClick={agregarPresentacion}
                className="flex items-center gap-2 text-pink-600 hover:text-pink-700 text-sm font-medium"
              >
                <Plus size={16} /> Agregar
              </button>
            </div>
            <div className="space-y-3">
              {presentaciones.map((pres, indice) => (
                <div
                  key={indice}
                  className="flex flex-wrap items-center gap-3 bg-gray-50 p-3 rounded-xl"
                >
                  <div className="flex-1 min-w-[100px]">
                    <label className="block text-xs text-gray-500 mb-1">
                      Porciones
                    </label>
                    <input
                      type="number"
                      value={pres.porciones}
                      onChange={(e) =>
                        actualizarPresentacion(
                          indice,
                          "porciones",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-400 outline-none text-sm"
                      placeholder="10"
                    />
                  </div>
                  <div className="flex-1 min-w-[100px]">
                    <label className="block text-xs text-gray-500 mb-1">
                      Descuento (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={pres.descuento}
                      onChange={(e) =>
                        actualizarPresentacion(
                          indice,
                          "descuento",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-400 outline-none text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-xs text-gray-500 mb-1">
                      Precio final
                    </label>
                    <div className="px-3 py-2 rounded-lg bg-white border border-gray-100 text-sm font-bold text-pink-600">
                      {vistaPrevia[indice] ? `Bs. ${vistaPrevia[indice]}` : "—"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => eliminarPresentacion(indice)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors self-end"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="font-semibold mb-4">Acciones</h3>
            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Save size={18} />
              {esEditar ? "Guardar cambios" : "Crear producto"}
            </button>
            <button
              type="button"
              onClick={() => navegar("/admin/productos")}
              className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminProductoFormulario;
