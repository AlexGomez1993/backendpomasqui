import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Ciudad = db.define(
    "ciudad",
    {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            require: true,
        },
    },
    {
        tableName: "ciudad",
        timestamps: false,
    }
);

export default Ciudad;
