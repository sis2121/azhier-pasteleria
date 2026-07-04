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
    const nuevoItem = {
      ...item,
      idCarrito: Date.now(),
      precio: Number(item.precio || 0),
      precio_original: Number(
        item.precio_original ??
          (item.descuento
            ? item.precio / (1 - item.descuento / 100)
            : item.precio || 0),
      ),
    };
    setCarrito((prev) => [...prev, nuevoItem]);
    toast.success(`${item.nombre} agregado al carrito`, {
      duration: 2500,
      id: `agregar-${nuevoItem.idCarrito}`,
    });
  };

  const actualizarItem = (idCarrito, cantidad) => {
    setCarrito((prev) => {
      const item = prev.find((i) => i.idCarrito === idCarrito);
      if (!item) return prev;

      if (cantidad <= 0) {
        toast.error(`${item.nombre} eliminado del carrito`, {
          duration: 2500,
          id: `eliminar-${idCarrito}`,
        });
        return prev.filter((i) => i.idCarrito !== idCarrito);
      }

      const actualizado = prev.map((i) =>
        i.idCarrito === idCarrito ? { ...i, cantidad } : i,
      );
      toast.success(`${item.nombre} actualizado en el carrito`, {
        duration: 2000,
        id: `actualizar-${idCarrito}`,
      });
      return actualizado;
    });
  };

  const eliminarItem = (idCarrito) => {
    setCarrito((prev) => {
      const item = prev.find((i) => i.idCarrito === idCarrito);
      if (item) {
        toast.error(`${item.nombre} eliminado del carrito`, {
          duration: 2500,
          id: `eliminar-${idCarrito}`,
        });
      }
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
    (sum, item) => sum + Number(item.precio || 0) * Number(item.cantidad || 1),
    0,
  );
  const ahorroTotal = carrito.reduce((sum, item) => {
    const precioOriginal = Number(
      item.precio_original ??
        (item.descuento
          ? item.precio / (1 - item.descuento / 100)
          : item.precio || 0),
    );
    const precioFinal = Number(item.precio || 0);
    return (
      sum +
      Math.max(0, (precioOriginal - precioFinal) * Number(item.cantidad || 1))
    );
  }, 0);
  const total = subtotal;

  return (
    <ContextoCarrito.Provider
      value={{
        carrito,
        agregarAlCarrito,
        actualizarItem,
        eliminarItem,
        vaciarCarrito,
        subtotal,
        ahorroTotal,
        total,
      }}
    >
      {children}
    </ContextoCarrito.Provider>
  );
};
