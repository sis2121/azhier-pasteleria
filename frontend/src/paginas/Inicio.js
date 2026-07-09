import React, { useEffect, useState } from "react";
import { apiPublica } from "../servicios/api";
import { Link } from "react-router-dom";
import {
  Cake,
  Star,
  Clock,
  MapPin,
  Phone,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  ChevronRight,
} from "lucide-react";

const Inicio = () => {
  const [destacados, setDestacados] = useState([]);
  useEffect(() => {
    apiPublica.obtenerDestacados().then(setDestacados);
  }, []);

  return (
    <div>
      {/* Hero Section - MODIFICADO CON IMAGEN DE FONDO */}
      <section
        className="relative text-white overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/fondo.png')" }}
      >
        {/* Capa oscura encima de la imagen para que el texto sea legible */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Estos son los círculos decorativos de brillo (los mantuve) */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm">
              <Sparkles size={16} />
              <span>Pastelería artesanal desde 2024</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Endulza tus momentos especiales con{" "}
              <span className="text-yellow-300">AZHIER</span>
            </h1>
            <p className="text-lg md:text-xl text-pink-50 mb-8 leading-relaxed">
              Pasteles y postres hechos con amor, ingredientes frescos y recetas
              tradicionales que conquistarán tu paladar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/productos"
                className="inline-flex items-center gap-2 bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-pink-50 transition-all shadow-lg hover:shadow-xl"
              >
                Ver productos <ArrowRight size={18} />
              </Link>
              <a
                href="#info"
                className="inline-flex items-center gap-2 border-2 border-white/50 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all"
              >
                Conócenos <Users size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-start gap-4 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-pink-100 rounded-xl">
              <ShieldCheck className="text-pink-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">
                Ingredientes frescos
              </h3>
              <p className="text-sm text-gray-500">
                Seleccionamos los mejores ingredientes para cada creación.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-start gap-4 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-pink-100 rounded-xl">
              <Clock className="text-pink-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">
                Entrega puntual
              </h3>
              <p className="text-sm text-gray-500">
                Tu pedido listo cuando lo necesites, sin demoras.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-start gap-4 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-pink-100 rounded-xl">
              <Star className="text-pink-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">
                Calidad garantizada
              </h3>
              <p className="text-sm text-gray-500">
                Cada producto es una obra maestra de sabor y presentación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Nuestros <span className="text-pink-600">Favoritos</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Descubre nuestros productos más populares, preparados con dedicación
            para deleitar tu paladar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destacados.map((p) => (
            <div
              key={p.id}
              className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <img
                  src={
                    p.imagen
                      ? p.imagen.startsWith("http")
                        ? p.imagen
                        : `http://localhost:5000/static/uploads/${p.imagen}`
                      : "/placeholder.jpg"
                  }
                  alt={p.nombre}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Star size={12} /> Destacado
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Cake size={16} className="text-pink-500" />
                  <h3 className="font-semibold text-gray-800">{p.nombre}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {p.descripcion}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-pink-600 font-bold text-lg">
                    Desde Bs. {p.precio_porcion}
                  </span>
                  <Link
                    to="/productos"
                    className="p-2 bg-pink-50 rounded-full text-pink-600 hover:bg-pink-100 transition-colors"
                  >
                    <ShoppingBag size={18} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 bg-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors shadow-lg"
          >
            Ver todos los productos <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* Información del negocio */}
      <section id="info" className="bg-pink-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Sobre <span className="text-pink-600">Nosotros</span>
              </h2>
              <p className="text-gray-500">
                Conoce más acerca de nuestra pastelería y nuestra pasión por la
                repostería.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <MapPin className="text-pink-600" size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-800">Ubicación</h3>
                </div>
                <p className="text-gray-600 ml-11">
                  Calle Tarope, esquina Isiboro
                  <br />
                  Trinidad, Beni, Bolivia
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Phone className="text-pink-600" size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-800">Contacto</h3>
                </div>
                <p className="text-gray-600 ml-11">
                  +591 69796983
                  <br />
                  +591 69399722
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Clock className="text-pink-600" size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-800">
                    Horario de atención
                  </h3>
                </div>
                <div className="ml-11 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 font-medium">Lunes a Viernes</p>
                    <p className="text-gray-500">7:00 - 22:30</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">
                      Sábados y Domingos
                    </p>
                    <p className="text-gray-500">7:00 - 23:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Inicio;
