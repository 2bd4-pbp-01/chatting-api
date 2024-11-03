import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();

const connection = {
  dbName: String(process.env.DB_NAME),
  dbUser: String(process.env.DB_USER),
  dbPass: String(process.env.DB_PASS),
  host: String(process.env.DB_HOST) || "localhost",
  dialect: String(process.env.DB_DRIVER) || "mysql",
};

const db = new Sequelize(
  connection.dbName,
  connection.dbUser,
  connection.dbPass,
  {
    host: connection.host,
    dialect: connection.dialect,
  },
);

export default db;

