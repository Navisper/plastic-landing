# ESTO INSTALA NODE.JS AUTOMÁTICAMENTE
FROM node:18-alpine

# Crea directorio de trabajo
WORKDIR /app

# Copia archivos de dependencias
COPY package.json package-lock.json ./

# INSTALA DEPENDENCIAS DEL PROYECTO (no Node.js)
RUN npm ci

# Copia el resto del código
COPY . .

# Expone el puerto de Astro
EXPOSE 4321

# Comando por defecto
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]