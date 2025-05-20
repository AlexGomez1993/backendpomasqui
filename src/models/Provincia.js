import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Provincia = db.define(
    "provincia",
    {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            require: true,
        },
    },
    {
        tableName: "provincia",
        timestamps: false,
    }
);

export default Provincia;
