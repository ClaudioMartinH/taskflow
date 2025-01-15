import 'dotenv/config';
import process from 'process';

const config = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST ?? 'taskflow-postgres', // Valor por defecto
      user: process.env.DB_USER ?? 'taskflow_user', // Valor por defecto
      password: process.env.DB_PASSWORD ?? 'taskflow_password', // Valor por defecto
      database: process.env.DB_NAME ?? 'taskflow_db', // Valor por defecto
      port: parseInt(process.env.DB_PORT ?? '5432', 10), // Asegúrate de convertirlo a número
    },
    migrations: {
      directory: './src/infrastructure/DB/migrations', // Ruta a tus migraciones
      extension: 'ts',
    },
    seeds: {
      directory: './src/infrastructure/DB/seeds',
      extension: 'ts',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './src/infrastructure/DB/migrations',
    },
    seeds: {
      directory: './src/infrastructure/DB/seeds',
    },
  },
  default: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST ?? 'taskflow-postgres',
      user: process.env.DB_USER ?? 'taskflow_user',
      password: process.env.DB_PASSWORD ?? 'taskflow_password',
      database: process.env.DB_NAME ?? 'taskflow_db',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
    },
    migrations: {
      directory: './src/infrastructure/DB/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/infrastructure/DB/seeds',
      extension: 'ts',
    },
  },
  acquireConnectionTimeout: 10000,
};

export default config;
