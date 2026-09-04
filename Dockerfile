FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./

# Instala todas las dependencias necesarias para compilar (incluye devDependencies)
RUN npm install

# Copia el resto del código y compila TypeScript
COPY . .
RUN npm run build && npm prune --production

EXPOSE 3000
CMD ["node", "dist/index.js"]
