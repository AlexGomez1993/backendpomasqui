import { DataTypes } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcryptjs";

const Cliente = db.define(
    "cliente",
    {
        provincia_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        ciudad_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        apellidos: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        direccion: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        fecha_nacimiento: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        ruc: {
            type: DataTypes.STRING(13),
            allowNull: true,
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
        saldo: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        slug: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        pasaporte: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        sexo: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sector: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        edad: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        contrasena: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        estado: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        codigoTemporal: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        codigoExpiracion: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "cliente",
        timestamps: false,
    },
    
);

Cliente.beforeCreate(async (cliente, options) => {
    if (cliente.contrasena) {
        const salt = await bcrypt.genSalt(12);
        cliente.contrasena = await bcrypt.hash(cliente.contrasena, salt);
    }
});

Cliente.beforeUpdate(async (cliente, options) => {
    if (cliente.contrasena) {
        const salt = await bcrypt.genSalt(12);
        cliente.contrasena = await bcrypt.hash(cliente.contrasena, salt);
    }
});

export default Cliente;
