FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./


RUN npm install --ignore-scripts


COPY . .
RUN npm run build && npm prune --production

RUN chmod +x ./scripts/wait-for-db.sh || true

EXPOSE 3000
CMD ["node", "dist/index.js"]
