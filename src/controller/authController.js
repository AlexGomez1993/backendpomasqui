import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usuario, Cliente } from "../models/index.js";

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await Usuario.findOne({
            where: { login: username, activo: 1 },
            attributes: {
                exclude: [
                    "salt",
                    "direccion",
                    "fecha_alta",
                    "activo",
                    "telefono",
                ],
            },
        });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { id: user.id, login: user.login },
            process.env.JWT_SECRET,
            { expiresIn: "3h" }
        );

        return res.status(200).json({
            token,
            loginStatus: "success",
            message: "Login exitoso",
            user,
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "Error en el servidor", message: error.message });
    }
};

const validarCliente = async (req, res) => {
    try {
        const { ruc, pasaporte } = req.body;

        const whereCondition = {};
        if (ruc) whereCondition.ruc = ruc;
        if (pasaporte) whereCondition.pasaporte = pasaporte;
        whereCondition.activo = 1;

        if (Object.keys(whereCondition).length > 0) {
            const clienteExistente = await Cliente.findOne({
                where: whereCondition,
            });

            if (clienteExistente) {
                if (clienteExistente.estado === 1) {
                    await clienteExistente.update({
                        contrasena: ruc ? ruc : pasaporte,
                        estado: 3,
                    });

                    return res.status(200).json({
                        msg: "Usuario encontrado y actualizado correctamente",
                        estado: 1,
                    });
                }
                return res.status(200).json({
                    msg: "Usuario encontrado",
                    estado: clienteExistente.estado,
                });
            }
        }

        return res.status(404).json({
            msg: "Usuario no encontrado",
            estado: 2,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener al cliente",
            message: error.message,
        });
    }
};

const loginCliente = async (req, res) => {
    try {
        const { ruc, pasaporte, password } = req.body;
        const whereCondition = {};
        if (ruc) whereCondition.ruc = ruc;
        if (pasaporte) whereCondition.pasaporte = pasaporte;
        whereCondition.activo = 1;

        var cliente = await Cliente.findOne({
            where: whereCondition,
            attributes: {
                exclude: ["saldo", "slug", "sector", "edad"],
            },
        });

        if (!cliente) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        const validPassword = await bcrypt.compare(
            password,
            cliente.contrasena
        );
        if (!validPassword) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { ruc: cliente.ruc, email: cliente.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            token,
            loginStatus: "success",
            message: "Login exitoso",
            user: cliente,
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "Error en el servidor", message: error.message });
    }
};

const crearClienteWeb = async (req, res) => {
    try {
        const {
            ruc,
            nombre,
            apellidos,
            email,
            direccion,
            fecha_nacimiento,
            telefono,
            celular,
            ciudad_id,
            provincia_id,
            sexo,
            pasaporte,
            contrasena,
        } = req.body;

        if (
            !nombre ||
            !apellidos ||
            !email ||
            !direccion ||
            !fecha_nacimiento ||
            !telefono ||
            !celular ||
            !ciudad_id ||
            !provincia_id ||
            !sexo ||
            !contrasena
        ) {
            return res
                .status(400)
                .json({ msg: "Todos los campos son obligatorios" });
        }

        const whereCondition = {};
        if (ruc) whereCondition.ruc = ruc;
        if (pasaporte) whereCondition.pasaporte = pasaporte;
        whereCondition.activo = 1;

        if (Object.keys(whereCondition).length > 0) {
            const clienteExistente = await Cliente.findOne({
                where: whereCondition,
            });

            if (clienteExistente) {
                return res.status(400).json({
                    msg: "El cliente con este RUC o pasaporte ya está registrado",
                });
            }
        }
        const nuevoCliente = await Cliente.create({
            ruc: ruc ? ruc : pasaporte,
            nombre,
            apellidos,
            email,
            direccion,
            fecha_nacimiento,
            telefono,
            celular,
            ciudad_id,
            provincia_id,
            sexo,
            contrasena,
            estado: 3,
        });

        const token = jwt.sign(
            { ruc: nuevoCliente.ruc, email: nuevoCliente.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(201).json({
            token,
            msg: "Cliente agregado correctamente",
            cliente: nuevoCliente,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al crear el cliente",
            message: error.message,
        });
    }
};

export { login, validarCliente, loginCliente, crearClienteWeb };
