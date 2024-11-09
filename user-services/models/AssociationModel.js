import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Groups from "./GroupModel.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Association = db.define(
  "association",
  {
    id_association: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "addedAt",
    updatedAt: false,
  },
);

Groups.belongsToMany(Users, {
  through: Association,
  foreignKey: "id_group",
  otherKey: "id_users",
});

Users.belongsToMany(Groups, {
  through: Association,
  foreignKey: "id_users",
  otherKey: "id_group",
});

export default Association;
