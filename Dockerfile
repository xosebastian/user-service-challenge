# Usamos una imagen oficial de Node como base
FROM node:18-alpine AS builder

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de configuración
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Compilamos el proyecto
RUN npm run build

# Configuramos la imagen final para producción
FROM node:18-alpine
WORKDIR /app

# Copiamos los archivos compilados
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Instalamos las dependencias de producción
RUN npm install --production

# Definimos la variable de entorno
ENV PORT=8080

# Exponemos el puerto
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["node", "dist/main"]