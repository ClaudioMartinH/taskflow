#!/bin/sh

# Esperar a que PostgreSQL esté listo
until psql "postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME" -c '\q'; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

>&2 echo "PostgreSQL is up - executing command"
echo "PostgreSQL está listo."

# Ejecutar el archivo init_db.sql
psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -f /app/init_db.sql

echo "Script init_db.sql ejecutado correctamente."

# Iniciar la aplicación en modo desarrollo
npm run dev
