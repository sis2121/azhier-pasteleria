from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from config import Config
from modelos import db, Administrador
import os

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
db.init_app(app)

# Asegurar carpeta de uploads
os.makedirs(app.config['CARPETA_SUBIDAS'], exist_ok=True)

# Inicializar la base de datos y crear el admin por defecto
with app.app_context():
    db.create_all()
    # Si no existe el usuario 'admin', lo crea
    if not Administrador.query.filter_by(usuario='admin').first():
        hash_con = bcrypt.generate_password_hash('admin123').decode('utf-8')
        admin = Administrador(usuario='admin', hash_contrasena=hash_con)
        db.session.add(admin)
        db.session.commit()
        print("Administrador creado automáticamente (admin / admin123)")

# Registrar blueprints
from rutas.autenticacion import auth_bp
from rutas.productos import productos_bp
from rutas.pedidos import pedidos_bp
from rutas.publico import publico_bp
from rutas.analitica import analitica_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(productos_bp, url_prefix='/api/admin')
app.register_blueprint(pedidos_bp, url_prefix='/api/admin')
app.register_blueprint(publico_bp, url_prefix='/api')
app.register_blueprint(analitica_bp, url_prefix='/api/admin')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
