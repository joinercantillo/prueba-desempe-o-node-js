#!/bin/sh
# Wait until the DB at host:port is accepting TCP connections
host=db
port=5432
echo "Waiting for $host:$port..."
while ! nc -z $host $port; do
  sleep 1
done
echo "$host:$port is available"
exec "$@"
