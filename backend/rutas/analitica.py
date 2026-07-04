from flask import Blueprint, jsonify
from utilidades import admin_requerido
from modelos import db, Pedido, ItemPedido, Producto
import networkx as nx
from collections import Counter

analitica_bp = Blueprint('admin_analitica', __name__)

@analitica_bp.route('/analitica', methods=['GET'])
@admin_requerido
def analitica():
    pedidos = Pedido.query.all()
    
    ventas_producto = Counter()
    for pedido in pedidos:
        for item in pedido.items:
            ventas_producto[item.producto_id] += item.cantidad
    
    productos_ordenados = sorted(ventas_producto.items(), key=lambda x: x[1], reverse=True)
    mas_vendidos = []
    for prod_id, cant in productos_ordenados[:5]:
        prod = Producto.query.get(prod_id)
        mas_vendidos.append({'producto_id': prod_id, 'nombre': prod.nombre, 'cantidad': cant})
    
    menos_vendidos = []
    for prod_id, cant in productos_ordenados[-5:] if len(productos_ordenados)>=5 else productos_ordenados:
        prod = Producto.query.get(prod_id)
        menos_vendidos.append({'producto_id': prod_id, 'nombre': prod.nombre, 'cantidad': cant})
    
    # Clientes frecuentes
    frecuencia_cliente = Counter()
    total_cliente = {}
    for pedido in pedidos:
        frecuencia_cliente[pedido.telefono] += 1
        total_cliente[pedido.telefono] = total_cliente.get(pedido.telefono, 0) + float(pedido.monto_total)
    
    frecuentes = frecuencia_cliente.most_common(5)
    clientes_frecuentes = [{'telefono': tel, 'pedidos': cont} for tel, cont in frecuentes]
    
    alto_valor = sorted(total_cliente.items(), key=lambda x: x[1], reverse=True)[:5]
    clientes_alto_valor = [{'telefono': tel, 'total_gastado': round(total,2)} for tel, total in alto_valor]
    
    # Grafo bipartito Cliente ↔ Producto
    B = nx.Graph()
    
    # Mapeo de ids a nombres reales
    nombres_clientes = {}
    nombres_productos = {}
    for pedido in pedidos:
        nombres_clientes[pedido.telefono] = pedido.nombre_cliente
        for item in pedido.items:
            if item.producto_id not in nombres_productos:
                prod = Producto.query.get(item.producto_id)
                if prod:
                    nombres_productos[item.producto_id] = prod.nombre
    
    B.add_nodes_from([f"c_{pedido.telefono}" for pedido in pedidos], bipartite=0)
    ids_productos = set()
    for pedido in pedidos:
        for item in pedido.items:
            ids_productos.add(item.producto_id)
    B.add_nodes_from([f"p_{pid}" for pid in ids_productos], bipartite=1)
    
    for pedido in pedidos:
        nodo_cliente = f"c_{pedido.telefono}"
        for item in pedido.items:
            nodo_producto = f"p_{item.producto_id}"
            if B.has_edge(nodo_cliente, nodo_producto):
                B[nodo_cliente][nodo_producto]['peso'] += item.cantidad
            else:
                B.add_edge(nodo_cliente, nodo_producto, peso=item.cantidad)
    
    # Construir nodos con etiqueta legible
    nodos = []
    for nodo in B.nodes():
        if nodo.startswith('c_'):
            telefono = nodo[2:]
            nombre_legible = nombres_clientes.get(telefono, telefono)
            nodos.append({
                'id': nodo,
                'etiqueta': nombre_legible,
                'tipo': 'cliente'
            })
        else:
            producto_id = int(nodo[2:])
            nombre_legible = nombres_productos.get(producto_id, f"Producto {producto_id}")
            nodos.append({
                'id': nodo,
                'etiqueta': nombre_legible,
                'tipo': 'producto'
            })
    
    aristas = [{'origen': u, 'destino': v, 'peso': d['peso']} for u, v, d in B.edges(data=True)]

    # Grafo clientes con más de un producto
    G_variedad = nx.Graph()
    for pedido in pedidos:
        productos_unicos = {item.producto_id for item in pedido.items}
        if len(productos_unicos) <= 1:
            continue

        nodo_cliente = f"c_{pedido.telefono}"
        G_variedad.add_node(nodo_cliente, bipartite=0)
        for producto_id in productos_unicos:
            nodo_producto = f"p_{producto_id}"
            G_variedad.add_node(nodo_producto, bipartite=1)
            if G_variedad.has_edge(nodo_cliente, nodo_producto):
                G_variedad[nodo_cliente][nodo_producto]['peso'] += 1
            else:
                G_variedad.add_edge(nodo_cliente, nodo_producto, peso=1)

    nodos_variedad = []
    for nodo in G_variedad.nodes():
        if nodo.startswith('c_'):
            telefono = nodo[2:]
            nombre_legible = nombres_clientes.get(telefono, telefono)
            nodos_variedad.append({'id': nodo, 'etiqueta': nombre_legible, 'tipo': 'cliente'})
        else:
            producto_id = int(nodo[2:])
            nombre_legible = nombres_productos.get(producto_id, f"Producto {producto_id}")
            nodos_variedad.append({'id': nodo, 'etiqueta': nombre_legible, 'tipo': 'producto'})

    aristas_variedad = [{'origen': u, 'destino': v, 'peso': d['peso']} for u, v, d in G_variedad.edges(data=True)]

    # Grafo clientes ↔ métodos de pago
    G_pagos = nx.Graph()
    for pedido in pedidos:
        nodo_cliente = f"c_{pedido.telefono}"
        nodo_pago = f"m_{pedido.metodo_pago or 'Sin dato'}"
        G_pagos.add_node(nodo_cliente, bipartite=0)
        G_pagos.add_node(nodo_pago, bipartite=1)
        if G_pagos.has_edge(nodo_cliente, nodo_pago):
            G_pagos[nodo_cliente][nodo_pago]['peso'] += 1
        else:
            G_pagos.add_edge(nodo_cliente, nodo_pago, peso=1)

    nodos_pagos = []
    for nodo in G_pagos.nodes():
        if nodo.startswith('c_'):
            telefono = nodo[2:]
            nombre_legible = nombres_clientes.get(telefono, telefono)
            nodos_pagos.append({'id': nodo, 'etiqueta': nombre_legible, 'tipo': 'cliente'})
        else:
            metodo = nodo[2:]
            nodos_pagos.append({'id': nodo, 'etiqueta': metodo, 'tipo': 'metodo_pago'})

    aristas_pagos = [{'origen': u, 'destino': v, 'peso': d['peso']} for u, v, d in G_pagos.edges(data=True)]
    
    ventas_totales = sum(float(p.monto_total) for p in pedidos if p.estado != 'Cancelado')
    pendientes = Pedido.query.filter_by(estado='Pendiente').count()
    
    return jsonify({
        'ventas_totales': round(ventas_totales, 2),
        'pedidos_pendientes': pendientes,
        'mas_vendidos': mas_vendidos,
        'menos_vendidos': menos_vendidos,
        'clientes_frecuentes': clientes_frecuentes,
        'clientes_alto_valor': clientes_alto_valor,
        'grafo_bipartito': {
            'nodos': nodos,
            'aristas': aristas
        },
        'grafo_clientes_multi_producto': {
            'nodos': nodos_variedad,
            'aristas': aristas_variedad
        },
        'grafo_clientes_metodos_pago': {
            'nodos': nodos_pagos,
            'aristas': aristas_pagos
        }
    })