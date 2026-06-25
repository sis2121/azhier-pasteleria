from flask import Blueprint, request, jsonify, current_app
from utilidades import admin_requerido, subir_imagen_a_cloudinary
from modelos import db, Producto, Presentacion, Categoria
import json

productos_bp = Blueprint('admin_productos', __name__)

@productos_bp.route('/productos', methods=['GET'])
@admin_requerido
def obtener_todos():
    productos = Producto.query.all()
    resultado = []
    for p in productos:
        resultado.append({
            'id': p.id,
            'categoria_id': p.categoria_id,
            'nombre': p.nombre,
            'descripcion': p.descripcion,
            'imagen': p.imagen,
            'precio_porcion': float(p.precio_porcion),
            'es_destacado': p.es_destacado,
            'presentaciones': [{
                'id': pr.id,
                'porciones': pr.porciones,
                'porcentaje_descuento': float(pr.porcentaje_descuento),
                'precio_final': float(pr.precio_final)
            } for pr in p.presentaciones]
        })
    return jsonify(resultado)

@productos_bp.route('/productos', methods=['POST'])
@admin_requerido
def crear_producto():
    datos = request.form
    nombre = datos.get('nombre')
    categoria_id = datos.get('categoria_id')
    descripcion = datos.get('descripcion', '')
    precio_porcion = datos.get('precio_porcion')
    es_destacado = datos.get('es_destacado', 'false').lower() == 'true'
    presentaciones_json = request.form.get('presentaciones')  # JSON string

    if not nombre or not categoria_id or not precio_porcion:
        return jsonify(mensaje='Campos obligatorios: nombre, categoria_id, precio_porcion'), 400

    archivo_imagen = request.files.get('imagen')
    url_imagen = None
    if archivo_imagen and archivo_imagen.filename:
        url_imagen = subir_imagen_a_cloudinary(archivo_imagen)

    precio_porcion_float = float(precio_porcion)

    producto = Producto(
        categoria_id=int(categoria_id),
        nombre=nombre,
        descripcion=descripcion,
        imagen=url_imagen,
        precio_porcion=precio_porcion_float,
        es_destacado=es_destacado
    )
    db.session.add(producto)
    db.session.flush()

    if presentaciones_json:
        presentaciones = json.loads(presentaciones_json)
        for pres in presentaciones:
            precio_final = precio_porcion_float * int(pres['porciones']) * (1 - float(pres.get('porcentaje_descuento', 0))/100)
            pp = Presentacion(
                producto_id=producto.id,
                porciones=int(pres['porciones']),
                porcentaje_descuento=float(pres.get('porcentaje_descuento', 0)),
                precio_final=precio_final
            )
            db.session.add(pp)

    db.session.commit()
    return jsonify(mensaje='Producto creado'), 201

@productos_bp.route('/productos/<int:id>', methods=['PUT'])
@admin_requerido
def actualizar_producto(id):
    producto = Producto.query.get_or_404(id)
    datos = request.form
    producto.nombre = datos.get('nombre', producto.nombre)
    producto.categoria_id = int(datos.get('categoria_id', producto.categoria_id))
    producto.descripcion = datos.get('descripcion', producto.descripcion)
    producto.precio_porcion = float(datos.get('precio_porcion', producto.precio_porcion))
    producto.es_destacado = datos.get('es_destacado', str(producto.es_destacado)).lower() == 'true'

    archivo_imagen = request.files.get('imagen')
    if archivo_imagen and archivo_imagen.filename:
        url_imagen = subir_imagen_a_cloudinary(archivo_imagen)
        if url_imagen:
            producto.imagen = url_imagen

    presentaciones_json = request.form.get('presentaciones')
    if presentaciones_json is not None:
        # Eliminar las existentes
        Presentacion.query.filter_by(producto_id=producto.id).delete()
        presentaciones = json.loads(presentaciones_json)
        for pres in presentaciones:
            precio_final = float(producto.precio_porcion) * int(pres['porciones']) * (1 - float(pres.get('porcentaje_descuento', 0))/100)
            pp = Presentacion(
                producto_id=producto.id,
                porciones=int(pres['porciones']),
                porcentaje_descuento=float(pres.get('porcentaje_descuento', 0)),
                precio_final=precio_final
            )
            db.session.add(pp)

    db.session.commit()
    return jsonify(mensaje='Producto actualizado')

@productos_bp.route('/productos/<int:id>', methods=['DELETE'])
@admin_requerido
def eliminar_producto(id):
    producto = Producto.query.get_or_404(id)
    db.session.delete(producto)
    db.session.commit()
    return jsonify(mensaje='Producto eliminado')