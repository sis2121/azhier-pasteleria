from app import app, db, bcrypt
from modelos import Administrador

with app.app_context():
    db.create_all()  # por si acaso
    if not Administrador.query.filter_by(usuario='admin').first():
        hash_con = bcrypt.generate_password_hash('admin123').decode('utf-8')
        admin = Administrador(usuario='admin', hash_contrasena=hash_con)
        db.session.add(admin)
        db.session.commit()
        print("Administrador creado (admin / admin123)")
    else:
        print("El admin ya existe")