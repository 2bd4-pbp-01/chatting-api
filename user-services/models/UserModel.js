import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Department from "./DepartmentModel.js";

const {DataTypes} = Sequelize;

const Users = db.define('users',{
    id_users: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    tipe_user: {
        type: DataTypes.ENUM('anggota', 'manager', 'operator'),
        allowNull: false,
        validate: {
            notEmpty: true,
            isIn: [['anggota', 'manager', 'operator']]
        }
    },
},{
    freezeTableName: true,
    timestamps: false
});

// Define the relationship
Users.belongsTo(Department, {
    foreignKey: 'id_department',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE'
});

Department.hasMany(Users, {
    foreignKey: 'id_department'
});

export default Users;