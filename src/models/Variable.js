import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Variable = db.define(
    "variables",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        valor: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        valoractual: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        tableName: "variables",
        timestamps: false,
    }
);

export default Variable;
