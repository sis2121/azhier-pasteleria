CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    imagen VARCHAR(300),
    precio_porcion DECIMAL(10,2) NOT NULL,
    es_destacado BOOLEAN DEFAULT false,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE presentaciones (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
    porciones INTEGER NOT NULL,
    porcentaje_descuento DECIMAL(5,2) DEFAULT 0,
    precio_final DECIMAL(10,2) NOT NULL
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    nombre_cliente VARCHAR(200) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    ubicacion TEXT,
    metodo_pago VARCHAR(20) CHECK (metodo_pago IN ('QR', 'Efectivo')),
    estado VARCHAR(20) CHECK (estado IN ('Pendiente','Confirmado','Preparando','Entregado','Cancelado')) DEFAULT 'Pendiente',
    monto_total DECIMAL(10,2) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES productos(id),
    presentacion_id INTEGER REFERENCES presentaciones(id),
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

CREATE TABLE administradores (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(100) UNIQUE NOT NULL,
    hash_contrasena VARCHAR(300) NOT NULL
);