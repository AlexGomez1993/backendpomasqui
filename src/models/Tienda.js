import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Tienda = db.define(
    "tienda",
    {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            require: true,
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
            require: true,
        },
        numcupones: {
            type: DataTypes.INTEGER,
            allowNull: false,
            require: true,
        },
        logo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: 1,
        },
    },
    {
        tableName: "tienda",
        timestamps: false,
    }
);

export default Tienda;
