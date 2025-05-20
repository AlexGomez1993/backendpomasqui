// src/config/db.js - Configuración de la base de datos
//const mysql = require('mysql2');
import Sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config();


const db = new Sequelize(
    process.env.BD_NOMBRE,
    process.env.BD_USER,
    process.env.BD_PASS,
    {
        host: process.env.BD_HOST,
        port: process.env.BD_PORTDB,
        dialect: "mysql",
        define: {
            timestamps: true,
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 1000,
        },
    }
);

export default db;

/* const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '12345',
    database: process.env.DB_NAME || 'scalacanjes_canjes'
});

module.exports = connection; */