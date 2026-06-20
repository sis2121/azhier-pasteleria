import React, { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const ContextoCarrito = createContext();

export const ProveedorCarrito = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito_azhier");
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    localStorage.setItem("carrito_azhier", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (item) => {
    const nuevoItem = { ...item, idCarrito: Date.now() };
    setCarrito((prev) => [...prev, nuevoItem]);
    toast.success(`${item.nombre} agregado al carrito`, {
      duration: 3000,
    });
  };

  const actualizarItem = (idCarrito, cantidad) => {
    if (cantidad <= 0) {
      setCarrito((prev) => {
        const item = prev.find((i) => i.idCarrito === idCarrito);
        if (item)
          toast.error(`${item.nombre} eliminado del carrito`, {
            duration: 3000,
          });
        return prev.filter((i) => i.idCarrito !== idCarrito);
      });
    } else {
      setCarrito((prev) =>
        prev.map((i) => (i.idCarrito === idCarrito ? { ...i, cantidad } : i)),
      );
    }
  };

  const eliminarItem = (idCarrito) => {
    setCarrito((prev) => {
      const item = prev.find((i) => i.idCarrito === idCarrito);
      if (item)
        toast.error(`${item.nombre} eliminado del carrito`, { duration: 3000 });
      return prev.filter((i) => i.idCarrito !== idCarrito);
    });
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    toast("Carrito vaciado", {
      icon: "🧹",
      duration: 3000,
    });
  };

  const subtotal = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0,
  );
  const descuentoTotal = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad * (item.descuento / 100),
    0,
  );
  const total = subtotal - descuentoTotal;

  return (
    <ContextoCarrito.Provider
      value={{
        carrito,
        agregarAlCarrito,
        actualizarItem,
        eliminarItem,
        vaciarCarrito,
        subtotal,
        descuentoTotal,
        total,
      }}
    >
      {children}
    </ContextoCarrito.Provider>
  );
};
