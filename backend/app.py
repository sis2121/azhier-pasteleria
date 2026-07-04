from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from sqlalchemy import inspect, text
from config import Config
from modelos import db, Administrador
import cloudinary
import os

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

app = Flask(__name__)
app.config.from_object(Config)

cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME') or app.config.get('CLOUDINARY_CLOUD_NAME')
api_key = os.getenv('CLOUDINARY_API_KEY') or app.config.get('CLOUDINARY_API_KEY')
api_secret = os.getenv('CLOUDINARY_API_SECRET') or app.config.get('CLOUDINARY_API_SECRET')

cloudinary.config(
    cloud_name=cloud_name,
    api_key=api_key,
    api_secret=api_secret,
    secure=True,
)

CORS(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
db.init_app(app)

# Asegurar carpeta de uploads
os.makedirs(app.config['CARPETA_SUBIDAS'], exist_ok=True)

# Inicializar la base de datos y crear admin por defecto
with app.app_context():
    def migrar_esquema():
        inspector = inspect(db.engine)
        tablas = set(inspector.get_table_names())

        if 'categorias' in tablas:
            with db.engine.begin() as conn:
                conn.execute(text('DROP TABLE IF EXISTS categorias CASCADE'))

        if 'productos' in tablas:
            columnas = {col['name'] for col in inspector.get_columns('productos')}
            if 'categoria_id' in columnas:
                with db.engine.begin() as conn:
                    conn.execute(text('ALTER TABLE productos DROP COLUMN IF EXISTS categoria_id'))

    migrar_esquema()
    db.create_all()

    # Crear admin por defecto si no existe
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
