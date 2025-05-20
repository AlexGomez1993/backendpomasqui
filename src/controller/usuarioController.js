import { Rol, Usuario } from "../models/index.js";
import { getFilters } from "../helpers/filtros.js";
import { getPagination } from "../helpers/paginacion.js";
import moment from "moment";

const listarUsuarios = async (req, res) => {
    try {
        const filtros = getFilters(req.query);
        const paginacion = getPagination(req.query);
        let queryOptions = {
            where: filtros,
            include: [
                {
                    model: Rol,
                    as: "rol",
                },
            ],
            attributes: { exclude: ["password", "salt"] },
            order: [["id", "ASC"]],
        };

        if (paginacion.limit) {
            queryOptions.limit = paginacion.limit;
            queryOptions.offset = paginacion.offset;
        }

        const { count, rows } = await Usuario.findAndCountAll(queryOptions);

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
            error: "Error al obtener los usuarios",
            message: error.message,
        });
    }
};

const crearUsuario = async (req, res) => {
    try {
        const {
            nombres,
            apellidos,
            email,
            telefono,
            celular,
            login,
            password,
            rol_id,
        } = req.body;

        if (
            !nombres ||
            !apellidos ||
            !email ||
            !telefono ||
            !celular ||
            !login ||
            !password ||
            !rol_id
        ) {
            return res
                .status(400)
                .json({ msg: "Todos los campos son obligatorios" });
        }

        const usuario = await Usuario.findOne({
            where: { login },
        });

        if (usuario) {
            return res.status(400).json({
                msg: "El cliente con este login ya está registrado",
            });
        }
        const nuevoUsuario = await Usuario.create({
            nombre: nombres,
            apellidos,
            email,
            login,
            password,
            telefono,
            celular,
            rol_id,
            fecha_alta: moment()
                .subtract(5, "hours")
                .format("YYYY-MM-DD HH:mm:ss"),
        });

        return res.status(201).json({
            msg: "usuario agregado correctamente",
            user: nuevoUsuario,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al agregar el usuario",
            message: error.message,
        });
    }
};

const editarUsuario = async (req, res) => {
    try {
        const { idUsuario } = req.params;
        const {
            nombres,
            apellidos,
            email,
            telefono,
            celular,
            login,
            rol_id,
            activo,
            password,
        } = req.body;

        const usuario = await Usuario.findByPk(idUsuario);
        if (!usuario) {
            return res.status(404).json({ msg: "usuario no encontrada" });
        }

        usuario.nombre = nombres || usuario.nombre;
        usuario.apellidos = apellidos || usuario.apellidos;
        usuario.email = email || usuario.email;
        usuario.telefono = telefono || usuario.telefono;
        usuario.celular = celular || usuario.celular;
        usuario.login = login || usuario.login;
        usuario.rol_id = rol_id || usuario.rol_id;
        usuario.password = password || usuario.password;
        usuario.activo = activo !== undefined ? activo : usuario.activo;

        await usuario.save();

        return res.status(200).json({
            msg: `Usuario actualizado correctamente`,
            user: usuario.nombre,
            id: usuario.id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al actualizar el usuario",
            message: error.message,
        });
    }
};

export { listarUsuarios, crearUsuario, editarUsuario };
