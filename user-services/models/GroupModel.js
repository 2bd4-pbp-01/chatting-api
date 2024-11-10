import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Groups = db.define(
  "groups",
  {
    id_group: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        max: 50,
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  },
);

export default Groups;
