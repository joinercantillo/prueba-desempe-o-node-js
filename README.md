# FHL Delivery API

API REST para la gestión de órdenes de entrega (Prueba de desempeño - Módulo 5.2 Node.js).

**Resumen**: Esta API permite registrar clientes, gestionar bodegas y productos, crear órdenes de entrega, asignarlas a bodegas, controlar su estado y consultar el historial por cliente. Autenticación basada en JWT con roles `admin` y `analyst`.

**Requisitos**
- Node.js >= 18
- PostgreSQL (local o vía Docker Compose)

**Archivos importantes**
- `src/` : código fuente TypeScript.
- `src/models` : modelos Sequelize.
- `src/routes` : rutas Express (auth, clients, products, warehouses, orders).
- `.env.example` : ejemplo de variables de entorno.
- `docker-compose.yml` : orquesta API + Postgres.

**Variables de entorno (ejemplo)**
Copiar `.env.example` a `.env` y ajustar si es necesario.

```
PORT=3000
DATABASE_URL=postgres://postgres:postgres@db:5432/fhldb
JWT_SECRET=supersecretkey
```

**Instalación de dependencias y ejecución (local)**

Requisitos previos:
- Node.js >= 18 (recomendado usar `nvm` para gestionar versiones)
- npm, yarn o pnpm
- PostgreSQL (local) o Docker (se incluye `docker-compose.yml`)

1) Clonar el repositorio (si aplica):

```bash
git clone <repo-url>
cd prueba_desempeño_nodejs
```

2) Instalar dependencias (elige uno):

```bash
# Con npm
npm install

# Con yarn
yarn install

# Con pnpm
pnpm install
```

3) Configurar variables de entorno:

```bash
cp .env.example .env
# Edita .env según tu entorno (DATABASE_URL, JWT_SECRET, PORT...)
```

**Configurar `.env` y la base de datos**

`DATABASE_URL` debe tener el formato: `postgres://<user>:<password>@<host>:<port>/<database>`.
Ejemplos recomendados:

```bash
# Postgres local con usuario y contraseña por defecto (recomendado para desarrollo)
DATABASE_URL=postgres://postgres:postgres@localhost:5432/fhldb

# Si usas Docker Compose y el servicio de Postgres se llama 'db'
DATABASE_URL=postgres://postgres:postgres@db:5432/fhldb

# Si tu Postgres local usa autenticación peer (sin contraseña)
DATABASE_URL=postgres://postgres@localhost:5432/fhldb
```

Cómo preparar Postgres local (Ubuntu / Debian):

```bash
# Asegúrate de tener Postgres instalado
sudo apt update && sudo apt install -y postgresql

# Establecer contraseña para el usuario 'postgres' (opcional)
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"

# Crear la base de datos requerida
sudo -u postgres createdb fhldb
```

Si prefieres usar Docker Compose (archivo incluido):

```bash
# Levanta los contenedores (puede requerir sudo si tu usuario no está en el grupo docker)
sudo docker-compose up -d --build

# Alternativa (agrega tu usuario al grupo docker y vuelve a iniciar sesión):
sudo usermod -aG docker $USER
# cierra sesión y vuelve a entrar para aplicar el cambio
```

Si al ejecutar `docker-compose` obtienes "permission denied" para `/var/run/docker.sock`, usa `sudo` o añade tu usuario al grupo `docker`.

Después de preparar la base de datos, ejecuta el seeder:

```bash
npm run seed
```


4) Inicializar y poblar la base de datos de desarrollo:

```bash
# Ejecuta el seeder (recrea tablas y carga datos de ejemplo)
npm run seed
```

5) Ejecutar la API en desarrollo o producción:

```bash
# Modo desarrollo (recarga automática)
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar versión compilada
npm start
```

6) Acceder a la API

La API estará disponible en `http://localhost:3000` por defecto cuando se ejecute en Docker, o en `http://localhost:3001` cuando se ejecute en modo desarrollo local con `npm run dev`.

Notas sobre puertos (este repositorio usa puertos alternativos para evitar conflictos en el host):

- Docker Compose mapea:
	- Postgres: host `5434` -> container `5432` (use `DATABASE_URL=postgres://postgres:postgres@localhost:5434/fhldb` para acceder desde el host)
	- API: host `3002` -> container `3000` (acceso vía http://localhost:3002)
- Desarrollo local (npm run dev) usa `PORT` desde `.env` — por defecto `3001` en este proyecto.

Consejos útiles:
- Para cambiar la versión de Node use `nvm install <version>` y `nvm use <version>`.
- Si usas Docker, la forma más sencilla es usar `docker-compose up --build` (ver sección "Con Docker").
- Para revisar y corregir linter: `npm run lint`.

**Con Docker (opcional)**
Levanta Postgres y la API con Docker Compose:

```bash
docker-compose up --build
```

La cadena de conexión por defecto en `docker-compose.yml` es `postgres://postgres:postgres@db:5432/fhldb`.

**Seed y volcado de la BD**
- El script `npm run seed` recrea las tablas y carga usuarios, clientes, bodegas y productos de ejemplo.
- Para generar un dump SQL para entrega (archivo .sql):

```bash
# desde el host, si la base está en Docker
pg_dump -h localhost -p 5432 -U postgres -Fc -d fhldb > fhldb.dump
```

O bien usar `pg_dump` para generar SQL plano:

```bash
pg_dump -h localhost -p 5432 -U postgres -d fhldb > fhldb.sql
```

Incluye ese archivo `.sql` en la entrega para Moodle.

**Documentación (Swagger/OpenAPI)**
Cuando la API esté corriendo, la documentación está disponible en:

```
http://localhost:3002/api-docs  # (cuando usas Docker Compose)

Si ejecutas la API en modo desarrollo local (`npm run dev`) la UI estará en `http://localhost:3001/api-docs`.
```

**Rutas principales y permisos**
- `POST /api/auth/register` — Registrar usuario (`name`, `email`, `password`, `role`)
- `POST /api/auth/login` — Login -> devuelve `token`

Nota: todas las rutas bajo `/api` requieren el header `Authorization: Bearer <token>` salvo `/api/auth/*`.

- Clientes
	- `GET /api/clients` — Listar clientes (auth required)
	- `POST /api/clients/search` — Buscar por `cedula` (auth required)
	- `POST /api/clients` — Crear cliente (admin)

- Bodegas
	- `GET /api/warehouses` — Listar bodegas activas con su stock (auth required)
	- `PATCH /api/warehouses/:id/active` — Activar/Inactivar (admin)

- Productos
	- `GET /api/products/:code` — Obtener por código (auth required)
	- `DELETE /api/products/:id` — Eliminación lógica (admin)

- Órdenes
	- `POST /api/orders` — Crear orden (admin). Body: `{ clientId, warehouseId, items: [{productId, quantity}] }`
		- Valida: cliente existe, bodega activa, producto en la bodega y stock suficiente.
	- `PATCH /api/orders/:id/status` — Cambiar estado (admin, analyst). Body: `{ status: 'pending'|'in_transit'|'delivered' }`
	- `GET /api/orders/history` — Historial de órdenes (auth required)
	- `GET /api/orders/client/:clientId` — Órdenes por cliente (auth required)

**Ejemplos rápidos (curl)**

Registrar usuario (ejemplo admin):

```bash
curl -X POST http://localhost:3000/api/auth/register \
	-H "Content-Type: application/json" \
	-d '{"name":"Admin","email":"admin@fhl.com","password":"password123","role":"admin"}'
```

Login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"admin@fhl.com","password":"password123"}'
```

Usar token en peticiones protegidas:

```bash
curl http://localhost:3000/api/clients \
	-H "Authorization: Bearer <TOKEN>"
```

Crear una orden (admin):

```bash
curl -X POST http://localhost:3000/api/orders \
	-H "Authorization: Bearer <TOKEN>" \
	-H "Content-Type: application/json" \
	-d '{"clientId":1,"warehouseId":1,"items":[{"productId":1,"quantity":2}] }'
```

**Validaciones de negocio implementadas**
- No crear órdenes si no hay stock suficiente en la bodega seleccionada.
- No registrar clientes con la misma cédula (único).
- Solo administradores pueden crear/editar recursos CRUD completos; analistas pueden actualizar el estado de órdenes y consultar.

**Gitflow y commits convencionales**
- Branches: `main`, `develop`, `feature/<desc>`.
- Mensajes de commit: usar Conventional Commits, por ejemplo: `feat(clients): add search by cedula` o `fix(orders): validate stock before create`.


**Contacto / Autor**
- Nombre: Joiner Cantillo Camargo
- Clan: clan 11 - Centurion RUTA AVANZADA nodejs + nestjs

**Dump SQL para Moodle**

El entregable para Moodle debe incluir un volcado SQL (`.sql`) con la estructura y datos usados en la prueba. Hay dos opciones recomendadas:

- Generar el volcado desde el host con `pg_dump` (si la base de datos está en Docker o local). Ejemplo:

```bash
# Dump en formato SQL plano (recomendado para Moodle)
pg_dump -h localhost -p 5434 -U postgres -d fhldb > moodle_dump/fhldb.sql

# o con puerto por defecto 5432
pg_dump -h localhost -p 5432 -U postgres -d fhldb > moodle_dump/fhldb.sql
```

- Usar el script incluido (`npm run dump`) que invoca `pg_dump` usando `DATABASE_URL` de tu `.env` y escribe `moodle_dump/fhldb.sql`.

Notas:
- Asegúrate de que la base de datos que estés volcándo contiene los datos del `seed` (ejecuta `npm run seed` primero si corresponde).
- Incluye el archivo resultante `moodle_dump/fhldb.sql` en el ZIP/subida a Moodle.

La carpeta `moodle_dump/` se usa por convención para almacenar el volcado listo para subir.
