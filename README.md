# User Service Challenge

Este es un servicio de API de usuarios construido con NestJS, implementando CQRS (Command Query Responsibility Segregation) con PostgreSQL como base de datos, completamente containerizado con Docker y desplegado en Google Cloud Run.

## Características

* **NestJS**: Un framework progresivo de Node.js para construir aplicaciones del lado del servidor eficientes, confiables y escalables.
* **Patrón CQRS**: Usando `@nestjs/cqrs` para una clara separación de comandos y consultas.
* **PostgreSQL**: Base de datos relacional para persistencia de datos.
* **Google Cloud Run**: Plataforma de contenedores sin servidor totalmente gestionada.
* **ESLint y Prettier**: Calidad de código y formateo.
* **Pruebas de Integración**: Configurado con Jest para pruebas automatizadas.
* **GitHub Actions**: CI/CD con despliegue automático a Google Cloud Run.

## URL del Proyecto

[User Service Challenge API](https://user-service-challenge-999022673097.us-central1.run.app/)

## URL de Swagger

[Documentación Swagger](https://user-service-challenge-999022673097.us-central1.run.app/api)

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/your-username/user-service-challenge.git

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar localmente
npm run start:dev
```

## Variables de Entorno

Asegúrate de tener un archivo `.env` con los siguientes valores:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=db
PORT=3000
```

## Endpoints

### Usuarios

* **Crear Usuario**

  * `POST /users`
  * Cuerpo: `{ "name": "string", "age": "number" }`

* **Listar Usuarios**

  * `GET /users`

* **Obtener Usuario por ID**

  * `GET /users/:id`

* **Actualizar Usuario**

  * `PUT /users/:id`
  * Cuerpo: `{ "name": "string", "email": "number" }`

* **Eliminar Usuario**

  * `DELETE /users/:id`

## Pruebas

```bash
# Ejecutar pruebas unitarias
npm run test
```

```bash
# Ejecutar pruebas de integración
npm run test:integration
```

## Despliegue

Este proyecto está desplegado en Google Cloud Run utilizando GitHub Actions para despliegue automático. La configuración se encuentra en `.github/workflows/deploy.yml`.

## Colección de Postman

Se proporciona una colección de Postman en la raíz del proyecto llamada `User-Service-Collection.postman_collection.json`.

## Licencia

MIT
