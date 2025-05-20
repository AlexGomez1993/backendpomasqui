import { Cliente, Ciudad, Provincia } from "../models/index.js";
import { getFilters } from "../helpers/filtros.js";
import { getPagination } from "../helpers/paginacion.js";

const listarClientes = async (req, res) => {
    try {
        const filtros = getFilters(req.query);
        const paginacion = getPagination(req.query);
        let queryOptions = {
            where: filtros,
            include: [
                {
                    model: Ciudad,
                    as: "ciudad",
                },
                {
                    model: Provincia,
                    as: "provincia",
                },
            ],
            attributes: {
                exclude: [
                    "contrasena",
                    "salt",
                    "saldo",
                    "sector",
                    "sexo",
                    "slug",
                    "edad",
                ],
            },
            order: [["id", "ASC"]],
        };

        if (paginacion.limit) {
            queryOptions.limit = paginacion.limit;
            queryOptions.offset = paginacion.offset;
        }

        const { count, rows } = await Cliente.findAndCountAll(queryOptions);

        return res.status(200).json({
            total: count,
            pagina: paginacion.page,
            limit: paginacion.limit,
            totalPaginas: paginacion.limit
                ? Math.ceil(count / paginacion.limit)
                : 1,
            data: rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener los clientes",
            message: error.message,
        });
    }
};

const obtenerCliente = async (req, res) => {
    try {
        const { ruc, pasaporte } = req.query;

        const whereCondition = {};
        if (ruc) whereCondition.ruc = ruc;
        if (pasaporte) whereCondition.pasaporte = pasaporte;
        whereCondition.activo = 1;
        if (Object.keys(whereCondition).length > 0) {
            const clienteExistente = await Cliente.findOne({
                where: whereCondition,
                attributes: {
                    exclude: [
                        "contrasena",
                        "salt",
                        "saldo",
                        "sector",
                        "sexo",
                        "slug",
                        "edad",
                    ],
                },
            });
            if (clienteExistente) {
                return res.status(200).json({
                    clienteExistente,
                });
            }
        }

        if (!clienteExistente) {
            return res.status(404).json({ msg: "Cliente no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener al cliente",
            message: error.message,
        });
    }
};

const obtenerClienteId = async (req, res) => {
    try {
        const { idCliente } = req.params;

        const cliente = await Cliente.findByPk(idCliente,{
            attributes: {
                exclude: [
                    "contrasena",
                    "salt",
                    "saldo",
                    "sector",
                    "sexo",
                    "slug",
                    "edad",
                ],
            },
        })
        if (cliente) {
            return res.status(200).json({
                clienteExistente,
            });
        }
        if (!clienteExistente) {
            return res.status(404).json({ msg: "Cliente no encontrado" });
        }        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener al cliente",
            message: error.message,
        });
    }
};

const crearClienteIsla = async (req, res) => {
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
            edad,
            pasaporte,
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
            !edad
        ) {
            return res
                .status(400)
                .json({ msg: "Todos los campos son obligatorios" });
        }

        const whereCondition = {};
        if (ruc) whereCondition.ruc = ruc;
        if (pasaporte) whereCondition.pasaporte = pasaporte;

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
            slug: 0,
            sector: "Quito",
            edad,
            estado: 1,
        });

        return res.status(201).json({
            msg: "Cliente agregado correctamente",
            cliente: nuevoCliente,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al agregar el cliente",
            message: error.message,
        });
    }
};

const editarCliente = async (req, res) => {
    try {
        const { idCliente } = req.params;
        const {
            nombres,
            apellidos,
            ruc,
            email,
            direccion,
            telefono,
            celular,
            fecha_nacimiento,
            provincia_id,
            ciudad_id,
            activo,
        } = req.body;

        const cliente = await Cliente.findByPk(idCliente);
        if (!cliente) {
            return res.status(404).json({ msg: "cliente no encontrada" });
        }

        cliente.nombre = nombres || cliente.nombre;
        cliente.apellidos = apellidos || cliente.apellidos;
        cliente.ruc = ruc || cliente.ruc;
        cliente.email = email || cliente.email;
        cliente.direccion = direccion || cliente.direccion;
        cliente.telefono = telefono || cliente.telefono;
        cliente.celular = celular || cliente.celular;
        cliente.fecha_nacimiento = fecha_nacimiento || cliente.fecha_nacimiento;
        cliente.provincia_id = provincia_id || cliente.provincia_id;
        cliente.ciudad_id = ciudad_id || cliente.ciudad_id;
        cliente.activo = activo !== undefined ? activo : cliente.activo;

        await cliente.save();

        return res.status(200).json({
            msg: `Cliente actualizado correctamente`,
            cliente: cliente.nombre,
            id: cliente.id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al actualizar el cliente",
            message: error.message,
        });
    }
};

const cambiarContrasena = async (req, res) => {
    try {
        const { cliente_id, nuevaContrasena } = req.body;

        const clienteExistente = await Cliente.findByPk(cliente_id);

        if (!clienteExistente) {
            return res.status(404).json({ msg: "Cliente no encontrado" });
        }
        clienteExistente.contrasena =
            nuevaContrasena || clienteExistente.contrasena;

        await clienteExistente.save();

        return res.status(200).json({
            msg: `Contraseña actualizada correctamente`,
            cliente: clienteExistente.nombre,
            id: clienteExistente.id,
        });
    } catch (error) {
        console.error("Error al cambiar la contraseña del cliente:", error);
        return res.status(500).json({ msg: "Error al procesar la solicitud" });
    }
};

export {
    listarClientes,
    obtenerCliente,
    crearClienteIsla,
    editarCliente,
    cambiarContrasena,
    obtenerClienteId
};
