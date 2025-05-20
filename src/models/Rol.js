import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Rol = db.define(
    "roles",
    {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            require: true,
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        rol: {
            type: DataTypes.STRING,
            allowNull: false,
            require: true,
        },
    },
    {
        tableName: "roles",
        timestamps: false,
    }
);

export default Rol;
