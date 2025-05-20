const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
    create: async (user, callback) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.salt = salt;
        const sql = 'INSERT INTO usuario SET ?';
        db.query(sql, user, callback);
    },
    findByEmail: (email, callback) => {
        const sql = 'SELECT * FROM usuario WHERE email = ?';
        db.query(sql, [email], callback);
    },
    findAll: (callback) => {
        const sql = 'SELECT * FROM usuario';
        db.query(sql, callback);
    },
    findById: (id, callback) => {
        const sql = 'SELECT * FROM usuario WHERE id = ?';
        db.query(sql, [id], callback);
    },
    update: (id, user, callback) => {
        const sql = 'UPDATE usuario SET ? WHERE id = ?';
        db.query(sql, [user, id], callback);
    },
    delete: (id, callback) => {
        const sql = 'DELETE FROM usuario WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = User;