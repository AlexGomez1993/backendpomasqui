import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Saldo = db.define(
    "saldo",
    {
        saldo: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "saldo",
        timestamps: false,
    }
);

export default Saldo;
