from functools import wraps
from flask_jwt_extended import verify_jwt_in_request
from flask import current_app
import cloudinary.uploader
import os


def admin_requerido(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        return fn(*args, **kwargs)
    return wrapper


def subir_imagen_a_cloudinary(archivo):
    if not archivo or not getattr(archivo, 'filename', None):
        return None

    cloud_name = current_app.config.get('CLOUDINARY_CLOUD_NAME') or os.getenv('CLOUDINARY_CLOUD_NAME')
    api_key = current_app.config.get('CLOUDINARY_API_KEY') or os.getenv('CLOUDINARY_API_KEY')
    api_secret = current_app.config.get('CLOUDINARY_API_SECRET') or os.getenv('CLOUDINARY_API_SECRET')

    if not cloud_name or not api_key or not api_secret:
        raise RuntimeError('Faltan credenciales de Cloudinary en el entorno')

    resultado = cloudinary.uploader.upload(
        archivo.stream,
        folder=current_app.config.get('CLOUDINARY_FOLDER', 'azhier'),
        resource_type='image',
    )
    return resultado.get('secure_url')