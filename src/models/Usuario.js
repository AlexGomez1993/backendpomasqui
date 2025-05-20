import { DataTypes } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcryptjs";

const Usuario = db.define(
    "usuario",
    {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            require: true,
        },
        apellidos: {
            type: DataTypes.STRING,
            allowNull: false,
            require: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            require: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            require: true,
        },
        salt: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        direccion: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        fecha_alta: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        telefono: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        celular: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: 1,
        },
    },
    {
        tableName: "usuario",
        timestamps: false,
    }
);

Usuario.beforeCreate(async (usuario, options) => {
    if (usuario.password) {
        const salt = await bcrypt.genSalt(12);
        usuario.password = await bcrypt.hash(usuario.password, salt);
    }
});

Usuario.beforeUpdate(async (usuario, options) => {
    if (usuario.password) {
        const salt = await bcrypt.genSalt(12);
        usuario.password = await bcrypt.hash(usuario.password, salt);
    }
});

export default Usuario;
