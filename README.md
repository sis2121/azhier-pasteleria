# 🎂 Sistema Web para Pastelería AZHIER

Sistema web integral para la gestión de la Pastelería AZHIER, desarrollado con arquitectura cliente-servidor utilizando React para el frontend, Flask para el backend y PostgreSQL como sistema de base de datos.

## 📋 Descripción

La aplicación permite administrar los principales procesos de la pastelería, facilitando la gestión de productos, pedidos y la información del negocio mediante una interfaz moderna y una API robusta.

El sistema está construido bajo una arquitectura desacoplada:

* **Frontend:** React.js
* **Backend:** Flask (Python)
* **Base de Datos:** PostgreSQL
* **Contenedores:** Docker y Docker Compose

---

## 🚀 Tecnologías Utilizadas

### Frontend

* React.js
* JavaScript (ES6+)
* HTML5
* CSS3

### Backend

* Python
* Flask
* Flask REST API
* SQLAlchemy (si aplica)
* Flask-CORS

### Base de Datos

* PostgreSQL

### DevOps

* Docker
* Docker Compose
* Git y GitHub

---

## 📁 Estructura del Proyecto

```text
azhier-pasteleria/
│
├── backend/          # API REST desarrollada con Flask
├── frontend/         # Aplicación web desarrollada con React
├── base_datos/       # Scripts y recursos de la base de datos
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## ⚙️ Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

* Git
* Docker
* Docker Compose
* Node.js (si ejecutarás el frontend manualmente)
* Python 3.10 o superior (si ejecutarás el backend manualmente)
* PostgreSQL

---

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/sis2121/azhier-pasteleria.git
cd azhier-pasteleria
```

---

## 🐳 Ejecución con Docker

Levantar todos los servicios:

```bash
docker-compose up --build
```

Ejecutar en segundo plano:

```bash
docker-compose up -d
```

Detener los servicios:

```bash
docker-compose down
```

---

## 💻 Ejecución Manual

### Backend

Ingresar al directorio:

```bash
cd backend
```

Crear entorno virtual:

```bash
python -m venv .venv
```

Activar entorno virtual:

**Linux/Mac**

```bash
source .venv/bin/activate
```

**Windows**

```bash
.venv\Scripts\activate
```

Instalar dependencias:

```bash
pip install -r requirements.txt
```

Ejecutar el servidor:

```bash
python app.py
```

---

### Frontend

Ingresar al directorio:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Ejecutar el proyecto:

```bash
npm run dev
```

o

```bash
npm start
```

según la configuración del proyecto.

---

## 🗄️ Base de Datos

El sistema utiliza PostgreSQL para el almacenamiento de la información.

La carpeta:

```text
base_datos/
```

contiene los scripts necesarios para la creación y configuración inicial de la base de datos.

---

## 🌐 Despliegue

Aplicación disponible en:

https://azhier-pasteleria.vercel.app

---

## 🎯 Funcionalidades Generales

* Gestión de productos de la pastelería.
* Administración de pedidos.
* Gestión de información del negocio.
* Consumo de API REST.
* Interfaz web moderna y responsiva.
* Persistencia de datos mediante PostgreSQL.

---

## 🔒 Variables de Entorno

Ejemplo:

```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/azhier
SECRET_KEY=tu_clave_secreta
FLASK_ENV=development
```

**Importante:** No subir archivos `.env` al repositorio.

---

## 👥 Autores

Proyecto desarrollado para la Pastelería AZHIER.

Repositorio oficial:

https://github.com/sis2121/azhier-pasteleria

---

## 📄 Licencia

Este proyecto tiene fines académicos y de desarrollo de software. La licencia puede ser modificada según las necesidades del proyecto.
