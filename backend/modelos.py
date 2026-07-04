from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Producto(db.Model):
    __tablename__ = 'productos'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    descripcion = db.Column(db.Text)
    imagen = db.Column(db.String(300))
    precio_porcion = db.Column(db.Numeric(10,2), nullable=False)
    es_destacado = db.Column(db.Boolean, default=False)
    creado_en = db.Column(db.DateTime, default=datetime.utcnow)
    presentaciones = db.relationship('Presentacion', backref='producto', lazy=True, cascade='all, delete-orphan')

class Presentacion(db.Model):
    __tablename__ = 'presentaciones'
    id = db.Column(db.Integer, primary_key=True)
    producto_id = db.Column(db.Integer, db.ForeignKey('productos.id', ondelete='CASCADE'), nullable=False)
    porciones = db.Column(db.Integer, nullable=False)
    porcentaje_descuento = db.Column(db.Numeric(5,2), default=0)
    precio_final = db.Column(db.Numeric(10,2))  # calculado por la BD

class Pedido(db.Model):
    __tablename__ = 'pedidos'
    id = db.Column(db.Integer, primary_key=True)
    nombre_cliente = db.Column(db.String(200), nullable=False)
    telefono = db.Column(db.String(20), nullable=False)
    ubicacion = db.Column(db.Text)
    metodo_pago = db.Column(db.String(20))
    estado = db.Column(db.String(20), default='Pendiente')
    monto_total = db.Column(db.Numeric(10,2), nullable=False)
    creado_en = db.Column(db.DateTime, default=datetime.utcnow)
    actualizado_en = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    items = db.relationship('ItemPedido', backref='pedido', lazy=True, cascade='all, delete-orphan')

class ItemPedido(db.Model):
    __tablename__ = 'items_pedido'
    id = db.Column(db.Integer, primary_key=True)
    pedido_id = db.Column(db.Integer, db.ForeignKey('pedidos.id', ondelete='CASCADE'), nullable=False)
    producto_id = db.Column(db.Integer, db.ForeignKey('productos.id'))
    presentacion_id = db.Column(db.Integer, db.ForeignKey('presentaciones.id'))
    cantidad = db.Column(db.Integer, nullable=False)
    precio_unitario = db.Column(db.Numeric(10,2), nullable=False)
    subtotal = db.Column(db.Numeric(10,2), nullable=False)
    producto = db.relationship('Producto')
    presentacion = db.relationship('Presentacion')

class Administrador(db.Model):
    __tablename__ = 'administradores'
    id = db.Column(db.Integer, primary_key=True)
    usuario = db.Column(db.String(100), unique=True, nullable=False)
    hash_contrasena = db.Column(db.String(300), nullable=False)