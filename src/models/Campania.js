import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Campania = db.define(
    "campania",
    {
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: 1,
        },
        logo: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        slug: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        banner: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        reglamento: {
            type: DataTypes.STRING(255),
            allowNull: true,
        }
    },
    {
        tableName: "campania",
        timestamps: false,
    }
);

export default Campania;
