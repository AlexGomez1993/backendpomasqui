import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Promocion = db.define(
    "promocion",
    {
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        montominimo: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        fecha_inicio: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        fecha_fin: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: 1,
        },
    },
    {
        tableName: "promocion",
        timestamps: false,
    }
);

export default Promocion;
