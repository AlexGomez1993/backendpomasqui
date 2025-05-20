import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Cupon = db.define(
    "cupon",
    {
        numcupones: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        valorcompra: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        montominimo: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        cliente_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        campania_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        formapago_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        promocion_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        factura_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "cupon",
        timestamps: false,
    }
);

export default Cupon;
