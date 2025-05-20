import { DataTypes } from "sequelize";
import db from "../config/db.js";

const ConfigSaldo = db.define(
    "configsaldo",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
        campania_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        descripcion: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        observacion: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        user: {
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
        tableName: "configsaldo",
        timestamps: false,
    }
);


export default ConfigSaldo;
