import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Formapago = db.define(
    "formapago",
    {
        nombre: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        factor: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: 1,
        },
    },
    {
        tableName: "formapago",
        timestamps: false,
    }
);

export default Formapago;
