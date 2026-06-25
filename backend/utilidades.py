from functools import wraps
from flask_jwt_extended import verify_jwt_in_request
from flask import current_app
import cloudinary.uploader


def admin_requerido(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        return fn(*args, **kwargs)
    return wrapper


def subir_imagen_a_cloudinary(archivo):
    if not archivo or not getattr(archivo, 'filename', None):
        return None

    if not current_app.config.get('CLOUDINARY_CLOUD_NAME'):
        raise RuntimeError('Faltan credenciales de Cloudinary')

    resultado = cloudinary.uploader.upload(
        archivo.stream,
        folder=current_app.config.get('CLOUDINARY_FOLDER', 'azhier'),
        resource_type='image',
    )
    return resultado.get('secure_url')