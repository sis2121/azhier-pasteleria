import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import BarraNav from "./componentes/BarraNav";
import PiePagina from "./componentes/PiePagina";
import { ProveedorCarrito } from "./componentes/ContextoCarrito";
import AdminLayout from "./componentes/AdminLayout";
import RutaProtegida from "./componentes/RutaProtegida";
import Inicio from "./paginas/Inicio";
import Productos from "./paginas/Productos";
import Carrito from "./paginas/Carrito";
import FinalizarPedido from "./paginas/FinalizarPedido";
import AdminLogin from "./paginas/AdminLogin";
import AdminPanel from "./paginas/AdminPanel";
import AdminProductos from "./paginas/AdminProductos";
import AdminProductoFormulario from "./paginas/AdminProductoFormulario";
import AdminPedidos from "./paginas/AdminPedidos";
import AdminAnalitica from "./paginas/AdminAnalitica";

const App = () => {
  return (
    <ProveedorCarrito>
      <Router>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              fontSize: "16px",
              padding: "14px 24px",
              fontWeight: "500",
              borderRadius: "12px",
              background: "#1f2937",
              color: "#fff",
            },
            success: {
              style: { background: "#059669" },
            },
            error: {
              style: { background: "#dc2626" },
            },
          }}
        />
        <Routes>
          <Route path="/*" element={<PublicLayout />}>
            <Route index element={<Inicio />} />
            <Route path="productos" element={<Productos />} />
            <Route path="carrito" element={<Carrito />} />
            <Route path="finalizar-pedido" element={<FinalizarPedido />} />
          </Route>

          <Route path="/admin" element={<AdminLogin />} />

          <Route
            path="/admin/*"
            element={
              <RutaProtegida>
                <AdminLayout />
              </RutaProtegida>
            }
          >
            <Route path="panel" element={<AdminPanel />} />
            <Route path="productos" element={<AdminProductos />} />
            <Route
              path="productos/nuevo"
              element={<AdminProductoFormulario />}
            />
            <Route
              path="productos/editar/:id"
              element={<AdminProductoFormulario />}
            />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="analitica" element={<AdminAnalitica />} />
          </Route>
        </Routes>
      </Router>
    </ProveedorCarrito>
  );
};

const PublicLayout = () => (
  <>
    <BarraNav />
    <div className="min-h-screen">
      <Routes>
        <Route index element={<Inicio />} />
        <Route path="productos" element={<Productos />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="finalizar-pedido" element={<FinalizarPedido />} />
      </Routes>
    </div>
    <PiePagina />
  </>
);

export default App;
