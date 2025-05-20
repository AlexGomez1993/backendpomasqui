import { DataTypes } from "sequelize";
import db from "../config/db.js";

const SecuencialCampania = db.define(
    "secuencial_campania",
    {
        variable_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        campania_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: 1,
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        tableName: "secuencial_campania",
        timestamps: false,
    }
);
export default SecuencialCampania;
