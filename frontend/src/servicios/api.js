const URL_BASE = "https://azhier-pasteleria.onrender.com/api";

const obtenerToken = () => localStorage.getItem("tokenAdmin");

const cabeceras = (autenticado = false) => {
  const h = { "Content-Type": "application/json" };
  if (autenticado) {
    const token = obtenerToken();
    if (token) h["Authorization"] = `Bearer ${token}`;
  }
  return h;
};

export const apiPublica = {
  obtenerProductos: () =>
    fetch(`${URL_BASE}/productos`).then((res) => res.json()),
  obtenerDestacados: () =>
    fetch(`${URL_BASE}/productos/destacados`).then((res) => res.json()),
  crearPedido: (datos) =>
    fetch(`${URL_BASE}/pedidos`, {
      method: "POST",
      headers: cabeceras(),
      body: JSON.stringify(datos),
    }).then((res) => res.json()),
};

export const apiAdmin = {
  login: (usuario, contrasena) =>
    fetch(`${URL_BASE}/auth/login`, {
      method: "POST",
      headers: cabeceras(),
      body: JSON.stringify({ usuario, contrasena }),
    }).then((res) => res.json()),
  obtenerPanel: () =>
    fetch(`${URL_BASE}/admin/analitica`, { headers: cabeceras(true) }).then(
      (res) => res.json(),
    ),
  obtenerProductos: () =>
    fetch(`${URL_BASE}/admin/productos`, { headers: cabeceras(true) }).then(
      (res) => res.json(),
    ),
  crearProducto: (formData) =>
    fetch(`${URL_BASE}/admin/productos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${obtenerToken()}` },
      body: formData,
    }).then((res) => res.json()),
  actualizarProducto: (id, formData) =>
    fetch(`${URL_BASE}/admin/productos/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${obtenerToken()}` },
      body: formData,
    }).then((res) => res.json()),
  eliminarProducto: (id) =>
    fetch(`${URL_BASE}/admin/productos/${id}`, {
      method: "DELETE",
      headers: cabeceras(true),
    }).then((res) => res.json()),
  obtenerPedidos: () =>
    fetch(`${URL_BASE}/admin/pedidos`, { headers: cabeceras(true) }).then(
      (res) => res.json(),
    ),
  actualizarPedido: (id, datos) =>
    fetch(`${URL_BASE}/admin/pedidos/${id}`, {
      method: "PUT",
      headers: cabeceras(true),
      body: JSON.stringify(datos),
    }).then((res) => res.json()),
  eliminarPedido: (id) =>
    fetch(`${URL_BASE}/admin/pedidos/${id}`, {
      method: "DELETE",
      headers: cabeceras(true),
    }).then((res) => res.json()),
  obtenerAnalitica: () =>
    fetch(`${URL_BASE}/admin/analitica`, { headers: cabeceras(true) }).then(
      (res) => res.json(),
    ),
};
