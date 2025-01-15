import knex from "knex";
import config from "../../../knexfile.js";

const db = knex(config.development);

// Prueba la conexión
db.raw("SELECT 1")
  // eslint-disable-next-line no-console
  .then(() => console.log("PostgreSQL conectado correctamente"))
  .catch((err) => console.error("Error conectando a PostgreSQL:", err));

export default db;
