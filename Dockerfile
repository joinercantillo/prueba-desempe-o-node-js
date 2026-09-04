FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./

# Instala todas las dependencias necesarias para compilar (incluye devDependencies)
RUN npm install --ignore-scripts

# Copia el resto del código y compila TypeScript
COPY . .
RUN npm run build && npm prune --production
# A small helper script is used to wait for DB availability when running in compose
RUN chmod +x ./scripts/wait-for-db.sh || true

EXPOSE 3000
CMD ["node", "dist/index.js"]
