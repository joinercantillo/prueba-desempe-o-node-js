#!/bin/sh
# Kill any process listening on PORT (default 3001) and start dev server
PORT=${PORT:-3001}
# find PIDs listening on PORT and kill
PIDS=$(lsof -t -iTCP:${PORT} -sTCP:LISTEN -Pn || true)
if [ -n "$PIDS" ]; then
  echo "Killing processes on port ${PORT}: $PIDS"
  kill $PIDS || kill -9 $PIDS || true
  sleep 1
fi
# Kill any ts-node-dev leftover
pkill -f ts-node-dev || true
# Start dev server
exec ts-node-dev --respawn --transpile-only src/index.ts
