import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Noticia = db.define(
    "noticia",
    {
        nombre: {
            type: DataTypes.STRING(500),
            allowNull: false, 
        },
        descripcion: {
            type: DataTypes.STRING,
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
        tableName: "noticia",
        timestamps: false,
    }
);

export default Noticia;
