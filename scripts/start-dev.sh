#!/usr/bin/env sh
set -e

# Cargar variables de entorno desde .env si existe
[ -f .env ] && export $(grep -v '^#' .env | xargs) || true

PORT=${PORT:-3001}

echo "Releasing port $PORT if already in use..."
# Intentar matar proceso que escucha en el puerto (lsof o ss)
PID="$(lsof -t -i :$PORT -sTCP:LISTEN -Pn 2>/dev/null || true)"
if [ -z "$PID" ]; then
  PID="$(ss -ltnp 2>/dev/null | awk -v p=:$PORT '$4~p{gsub(/.*pid=/,"",$0); gsub(/,.*/,"",$0); print $0; exit}')"
fi
if [ -n "$PID" ]; then
  echo "Killing process on port $PORT: $PID"
  kill $PID || kill -9 $PID || true
fi

echo "Killing leftover ts-node-dev processes (if any)"
pkill -f ts-node-dev || true

echo "Starting development server with ts-node-dev"
exec npx ts-node-dev --respawn --transpile-only src/index.ts
