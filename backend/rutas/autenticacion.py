from flask import Blueprint, request, jsonify
from flask_bcrypt import check_password_hash
from flask_jwt_extended import create_access_token
from modelos import db, Administrador

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    datos = request.get_json()
    usuario = datos.get('usuario')
    contrasena = datos.get('contrasena')
    admin = Administrador.query.filter_by(usuario=usuario).first()
    if admin and check_password_hash(admin.hash_contrasena, contrasena):
        token = create_access_token(identity=str(admin.id))
        return jsonify(token=token), 200
    return jsonify(mensaje='Credenciales inválidas'), 401