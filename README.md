# FHL Delivery API

API REST for the managment of delivery orders prueba de desempeño nodeJs - Cohorte 5

**Resumen**: This API allows to register clients, gestionar warehouses and products, make delivery orders, asing to a warehouses, controller the statatus and queryest the history for all clients. Autentication based on JWT with rols `admin` and `analyst`.

**Requuest**
- Node.js >= 18
- PostgreSQL (local or using Docker Compose)

**important warnings**
- `src/` : base code TypeScript.
- `src/models` : Sequelize models.
- `src/routes` : express routes (auth, clients, products, warehouses, orders).
- `.env.example` : exmaple for environment variables.
- `docker-compose.yml` : orquesta API + Postgres.

**environment variables (example)**
Copy `.env.example` a `.env` and adjust if you need this.

```
PORT=3000
DATABASE_URL=postgres://postgres:postgres@db:5432/fhldb
JWT_SECRET=123456
```

**installation and dev dependencies (local)**

Previous request:
- Node.js >= 18 (is recomended use `nvm` to manage node versions)
- npm, yarn o pnpm
- PostgreSQL (local) or Docker (in this project i'm incluided `docker-compose.yml` file)

1) CLone this repository (if is your first time using this app):

```bash
git clone <https://github.com/joinercantillo/prueba-desempe-o-node-js>
cd prueba_desempeño_nodejs
```

2) Install dependencies:

```bash
# Con npm
npm install

```

3) configure the enviroment variables:

```bash
cp .env.example .env
# Edit .env in acord of your enviroment (DATABASE_URL, JWT_SECRET, PORT...)
```

**Configure `.env` and data bases**

`DATABASE_URL` is request the format: `postgres://<user>:<password>@<host>:<port>/<database>`.
Examples recomended:

```bash
# Postgres local with user and password by default 
DATABASE_URL=postgres://postgres:postgres@localhost:5432/fhldb

# if you uses Docker Compose and Postgres services is called 'db'
DATABASE_URL=postgres://postgres:postgres@db:5432/fhldb

```

How to prepare local postgres (Ubuntu):

```bash
# If you have istalled postgres on your device
sudo apt update && sudo apt install -y postgresql

# Chose a password for the user 'postgres' (optional)
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"

# Create the database
sudo -u postgres createdb fhldb
```

if you prefer Docker Compose (incluided file):

```bash
# Up the containers 
sudo docker-compose up -d --build

sudo usermod -aG docker $USER

```

if to excecute `docker-compose` you see the message "permission denied" for `/var/run/docker.sock`, use `sudo` or add your user to the team `docker`.

After that prepare the database, execute the seeder.

```bash
npm run seed
```


4) Inicializar y poblar la base de datos de desarrollo:

```bash
# Ejecuta el seeder (recrea tablas y carga datos de ejemplo)
npm run seed
```

5) Execute the api

```bash

npm run dev

# Compile typescript
npm run build

# Execute complete version
npm start
```

6) Access to the api

The api is aviable on `http://localhost:3000` by default when you exceute the docker, or in `http://localhost:3001` hwen you run this api in local mode using  `npm run dev`.


- Docker Compose mapea:
	- Postgres: host `5434` -> container `5432` (use `DATABASE_URL=postgres://postgres:postgres@localhost:5434/fhldb` para acceder desde el host)
	- API: host `3002` -> container `3000` (acceso vía http://localhost:3002)
- Desarrollo local (npm run dev) usa `PORT` desde `.env` — por defecto `3001` en este proyecto.

Hints:
- To change the node version use `nvm install <version>` and `nvm use <version>`.
- if you uses docker, the most simplest way is `docker-compose up --build`.
- To review and fix linter: `npm run lint`.

**Con Docker (opcional)**
Up the Postgres and the API with Docker Compose:

```bash
docker-compose up --build
```

the supply chain by default in docker `docker-compose.yml` is `postgres://postgres:postgres@db:5432/fhldb`.

**Seed y volcado de la BD**
- The script `npm run seed` recreate the tables and load all users, clients, warehouses and products for test that aplication.
- Para generar un dump SQL para entrega (archivo .sql):

```bash
# if the database is in docker use this code
pg_dump -h localhost -p 5432 -U postgres -Fc -d fhldb > fhldb.dump
```

Or use `pg_dump` to generate SQL plain text:

```bash
pg_dump -h localhost -p 5432 -U postgres -d fhldb > fhldb.sql
```

**Documentación (Swagger/OpenAPI)**
When the api i running, the documentation is aviable on:

```
http://localhost:3002/api-docs  # (when you uses docker compose)

if you uses that api in your local place use (`npm run dev`) and the UI is in `http://localhost:3001/api-docs`.
```

**Main routes and permissions**
- `POST /api/auth/register` — Register a new usser (`name`, `email`, `password`, `role`)
- `POST /api/auth/login` — Login -> return `token`

Note: all routs wiht `/api` it required the header `Authorization: Bearer <token>` except `/api/auth/*`.

- Clients
	- `GET /api/clients` — Client list (auth required)
	- `POST /api/clients/search` — Find by `cedula` (auth required)
	- `POST /api/clients` — Create client (admin)

- warehouses
	- `GET /api/warehouses` — warehoueses list with that stock (auth required)
	- `PATCH /api/warehouses/:id/active` — Activate/Inactivate (admin)

- Products
	- `GET /api/products/:code` — get products by ID (auth required)
	- `DELETE /api/products/:id` — Delete products (admin)

- Órders
	- `POST /api/orders` — Create order (admin). Body: `{ clientId, warehouseId, items: [{productId, quantity}] }`
		- Validate: existent client, active warehouse, warehouse products and aviable stock.
	- `PATCH /api/orders/:id/status` — Change status (admin, analyst). Body: `{ status: 'pending'|'in_transit'|'delivered' }`
	- `GET /api/orders/history` — Order History(auth required)
	- `GET /api/orders/client/:clientId` — Órder by client (auth required)

**Quick examples (curl)**

Create a new user (admin example):

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

Use token in safe querys:

```bash
curl http://localhost:3000/api/clients \
	-H "Authorization: Bearer <TOKEN>"
```

Create an order (admin):

```bash
curl -X POST http://localhost:3000/api/orders \
	-H "Authorization: Bearer <TOKEN>" \
	-H "Content-Type: application/json" \
	-d '{"clientId":1,"warehouseId":1,"items":[{"productId":1,"quantity":2}] }'
```

**Validations for busyness**
- not create orders if don't have avaibale stock in the werehouese for this order.
- Dont registera more of one user with the same cedula (unique).
- Only the administrator can create/edit  completely CRUD resources; analyst can be update the orders status and read.


**Contacto / Autor**
- Nombre: Joiner Cantillo Camargo
- Clan: clan 11 - Centurion RUTA AVANZADA nodejs + nestjs

**Dump SQL para Moodle**

Dump file is in dump folder, wiht the name FHLDATABASE.sql; whit the database for all the dates.
```bash
# Dump  
pg_dump -h localhost -p 5434 -U postgres -d fhldb > moodle_dump/fhldb.sql

# or with default port 5432
pg_dump -h localhost -p 5432 -U postgres -d fhldb > moodle_dump/fhldb.sql
```

- Using scripts (`npm run dump`) to make `pg_dump` using `DATABASE_URL` of your `.env` and write `moodle_dump/fhldb.sql`.