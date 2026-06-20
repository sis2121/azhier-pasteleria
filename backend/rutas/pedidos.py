from flask import Blueprint, request, jsonify
from utilidades import admin_requerido
from modelos import db, Pedido, ItemPedido, Producto, Presentacion
from datetime import datetime

pedidos_bp = Blueprint('admin_pedidos', __name__)

@pedidos_bp.route('/pedidos', methods=['GET'])
@admin_requerido
def obtener_pedidos():
    pedidos = Pedido.query.order_by(Pedido.creado_en.desc()).all()
    resultado = []
    for p in pedidos:
        items = []
        for i in p.items:
            items.append({
                'id': i.id,
                'producto_id': i.producto_id,
                'presentacion_id': i.presentacion_id,
                'nombre_producto': i.producto.nombre if i.producto else '',
                'presentacion': f"{i.presentacion.porciones} porciones" if i.presentacion else "Única",
                'cantidad': i.cantidad,
                'precio_unitario': float(i.precio_unitario),
                'subtotal': float(i.subtotal)
            })
        resultado.append({
            'id': p.id,
            'nombre_cliente': p.nombre_cliente,
            'telefono': p.telefono,
            'ubicacion': p.ubicacion,
            'metodo_pago': p.metodo_pago,
            'estado': p.estado,
            'monto_total': float(p.monto_total),
            'creado_en': p.creado_en.isoformat(),
            'actualizado_en': p.actualizado_en.isoformat() if p.actualizado_en else None,
            'items': items
        })
    return jsonify(resultado)

@pedidos_bp.route('/pedidos/<int:id>', methods=['PUT'])
@admin_requerido
def actualizar_pedido(id):
    pedido = Pedido.query.get_or_404(id)
    datos = request.get_json()

    # Actualizar campos del pedido
    if 'nombre_cliente' in datos:
        pedido.nombre_cliente = datos['nombre_cliente']
    if 'telefono' in datos:
        pedido.telefono = datos['telefono']
    if 'ubicacion' in datos:
        pedido.ubicacion = datos['ubicacion']
    if 'metodo_pago' in datos:
        pedido.metodo_pago = datos['metodo_pago']
    if 'estado' in datos:
        if datos['estado'] not in ['Pendiente','Confirmado','Preparando','Entregado','Cancelado']:
            return jsonify(mensaje='Estado no válido'), 400
        pedido.estado = datos['estado']

    pedido.actualizado_en = datetime.utcnow()

    # Actualizar items si se proporcionan
    if 'items' in datos and isinstance(datos['items'], list):
        # Eliminar items existentes
        ItemPedido.query.filter_by(pedido_id=pedido.id).delete()
        total = 0
        for item in datos['items']:
            presentacion = Presentacion.query.get(item.get('presentacion_id'))
            if not presentacion:
                db.session.rollback()
                return jsonify(mensaje=f"Presentación {item.get('presentacion_id')} no encontrada"), 400
            precio_unit = float(presentacion.precio_final)
            subtotal = precio_unit * item['cantidad']
            total += subtotal
            nuevo_item = ItemPedido(
                pedido_id=pedido.id,
                producto_id=presentacion.producto_id,
                presentacion_id=presentacion.id,
                cantidad=item['cantidad'],
                precio_unitario=precio_unit,
                subtotal=subtotal
            )
            db.session.add(nuevo_item)
        pedido.monto_total = total

    db.session.commit()
    return jsonify(mensaje='Pedido actualizado')

@pedidos_bp.route('/pedidos/<int:id>', methods=['DELETE'])
@admin_requerido
def eliminar_pedido(id):
    pedido = Pedido.query.get_or_404(id)
    db.session.delete(pedido)
    db.session.commit()
    return jsonify(mensaje='Pedido eliminado')