from flask import Blueprint, request, jsonify
from modelos import db, Categoria, Producto, Presentacion, Pedido, ItemPedido
import datetime

publico_bp = Blueprint('publico', __name__)

@publico_bp.route('/categorias', methods=['GET'])
def obtener_categorias():
    cats = Categoria.query.all()
    return jsonify([{'id': c.id, 'nombre': c.nombre} for c in cats])

@publico_bp.route('/productos', methods=['GET'])
def obtener_productos():
    categoria_id = request.args.get('categoria')
    consulta = Producto.query
    if categoria_id:
        consulta = consulta.filter_by(categoria_id=categoria_id)
    productos = consulta.all()
    resultado = []
    for p in productos:
        resultado.append({
            'id': p.id,
            'categoria_id': p.categoria_id,
            'categoria': p.categoria.nombre,
            'nombre': p.nombre,
            'descripcion': p.descripcion,
            'imagen': p.imagen,
            'precio_porcion': float(p.precio_porcion),
            'presentaciones': [{
                'id': pr.id,
                'porciones': pr.porciones,
                'porcentaje_descuento': float(pr.porcentaje_descuento),
                'precio_final': float(pr.precio_final)
            } for pr in p.presentaciones],
            'es_destacado': p.es_destacado
        })
    return jsonify(resultado)

@publico_bp.route('/productos/destacados', methods=['GET'])
def obtener_destacados():
    productos = Producto.query.filter_by(es_destacado=True).limit(4).all()
    resultado = []
    for p in productos:
        resultado.append({
            'id': p.id,
            'nombre': p.nombre,
            'imagen': p.imagen,
            'precio_porcion': float(p.precio_porcion),
            'descripcion': p.descripcion
        })
    return jsonify(resultado)

@publico_bp.route('/pedidos', methods=['POST'])
def crear_pedido():
    datos = request.get_json()
    nombre_cliente = datos.get('nombre_cliente')
    telefono = datos.get('telefono')
    ubicacion = datos.get('ubicacion')
    metodo_pago = datos.get('metodo_pago')
    items = datos.get('items')  # [{producto_id, presentacion_id, cantidad}]

    if not all([nombre_cliente, telefono, metodo_pago, items]):
        return jsonify(mensaje='Faltan campos requeridos'), 400

    total = 0
    items_pedido = []
    for item in items:
        presentacion = Presentacion.query.get(item['presentacion_id'])
        if not presentacion:
            return jsonify(mensaje=f'Presentación {item["presentacion_id"]} no encontrada'), 404
        precio_unit = float(presentacion.precio_final)
        subtotal = precio_unit * item['cantidad']
        total += subtotal
        items_pedido.append({
            'producto_id': presentacion.producto_id,
            'presentacion_id': presentacion.id,
            'cantidad': item['cantidad'],
            'precio_unitario': precio_unit,
            'subtotal': subtotal
        })

    pedido = Pedido(
        nombre_cliente=nombre_cliente,
        telefono=telefono,
        ubicacion=ubicacion,
        metodo_pago=metodo_pago,
        monto_total=total,
        estado='Pendiente'
    )
    db.session.add(pedido)
    db.session.flush()

    for oi in items_pedido:
        db.session.add(ItemPedido(
            pedido_id=pedido.id,
            producto_id=oi['producto_id'],
            presentacion_id=oi['presentacion_id'],
            cantidad=oi['cantidad'],
            precio_unitario=oi['precio_unitario'],
            subtotal=oi['subtotal']
        ))
    db.session.commit()

    return jsonify(mensaje='Pedido creado exitosamente', pedido_id=pedido.id), 201