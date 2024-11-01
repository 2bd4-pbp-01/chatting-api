import {Sequelize} from "sequelize";

const db = new Sequelize('corpachat', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;