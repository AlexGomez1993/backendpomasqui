import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Factura = db.define(
    "factura",
    {
        numero: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        monto: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        campania_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        promocion_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        tienda_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: 1,
        },
        formapago_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        respuesta: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        ruc: {
            type: DataTypes.STRING(13),
            allowNull: true,
        },
        cliente_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        imagen: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        voucher: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        estado: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fechaRegistro: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        observacion: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
    },
    {
        tableName: "factura",
        timestamps: false,
    }
);

export default Factura;
