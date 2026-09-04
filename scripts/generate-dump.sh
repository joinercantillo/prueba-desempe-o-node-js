#!/usr/bin/env sh
# Genera un volcado SQL plano en moodle_dump/fhldb.sql usando pg_dump.
# Requiere: pg_dump en PATH y que DATABASE_URL en .env apunte a la BD a volcár.

set -e

# Cargar .env si existe
[ -f .env ] && export $(grep -v '^#' .env | xargs) || true

OUT_DIR="moodle_dump"
OUT_FILE="$OUT_DIR/fhldb.sql"

mkdir -p "$OUT_DIR"

if [ -n "$DATABASE_URL" ]; then
  echo "Generando dump desde DATABASE_URL..."
  # Convertir DATABASE_URL a parámetros para pg_dump
  # Esperamos formato: postgres://user:pass@host:port/dbname
  TMP=$(echo "$DATABASE_URL" | sed -e 's,postgres://,,')
  USERPASS=$(echo "$TMP" | cut -d@ -f1)
  HOSTPORTDB=$(echo "$TMP" | cut -d@ -f2)
  USER=$(echo "$USERPASS" | cut -d: -f1)
  PASS=$(echo "$USERPASS" | cut -d: -f2)
  HOST=$(echo "$HOSTPORTDB" | cut -d: -f1)
  PORT_DB=$(echo "$HOSTPORTDB" | cut -d: -f2 | cut -d/ -f1)
  DBNAME=$(echo "$HOSTPORTDB" | cut -d/ -f2)

  export PGPASSWORD="$PASS"
  echo "pg_dump -h $HOST -p ${PORT_DB:-5432} -U $USER -d $DBNAME > $OUT_FILE"
  pg_dump -h "$HOST" -p "${PORT_DB:-5432}" -U "$USER" -d "$DBNAME" > "$OUT_FILE"
  unset PGPASSWORD
  echo "Dump escrito en $OUT_FILE"
else
  echo "DATABASE_URL no definido. Define .env con DATABASE_URL o exporta la variable y vuelve a ejecutar."
  exit 1
fi
