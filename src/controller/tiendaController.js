import { Tienda, Campania } from "../models/index.js";
import { getFilters } from "../helpers/filtros.js";
import { getPagination } from "../helpers/paginacion.js";

const listarTiendas = async (req, res) => {
    try {
        const filtros = getFilters(req.query);
        const paginacion = getPagination(req.query);

        let queryOptions = {
            where: filtros,
            distinct: true,
        };

        if (req.query.campania_id) {
            queryOptions.include = {
                model: Campania,
                where: {
                    id: req.query.campania_id,
                },
                through: { attributes: [] },
            };
        }
        if (paginacion.limit) {
            queryOptions.limit = paginacion.limit;
            queryOptions.offset = paginacion.offset;
        }
        const { count, rows } = await Tienda.findAndCountAll(queryOptions);

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
            error: "Error al obtener las tiendas",
            message: error.message,
        });
    }
};

const activarTienda = async (req, res) => {
    try {
        const { idTienda } = req.body;

        if (!idTienda) {
            const error = new Error("El id de la tienda es necesario");
            return res.status(400).json({ msg: error.message });
        }

        const tienda = await Tienda.findOne({
            where: { id: idTienda },
        });

        if (!tienda) {
            const error = new Error("tienda no encontrada");
            return res.status(404).json({ msg: error.message });
        }

        tienda.activo = !tienda.activo ? true : false;

        await tienda.save();

        return res.status(200).json({
            msg: `tienda actualizada correctamente`,
            tienda: tienda.nombre,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al activar la tienda",
            message: error.message,
        });
    }
};

const crearTienda = async (req, res) => {
    try {
        const { nombre, descripcion, numcupones } = req.body;

        const tienda = await Tienda.create({
            nombre,
            descripcion,
            numcupones,
        });

        return res.status(201).json({
            msg: `tienda creada correctamente`,
            tienda: tienda.nombre,
            id: tienda.id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al crear la tienda",
            message: error.message,
        });
    }
};

const editarTienda = async (req, res) => {
    try {
        const { idTienda } = req.params;
        const { nombre, descripcion, numcupones, activo } = req.body;

        const tienda = await Tienda.findByPk(idTienda);
        if (!tienda) {
            return res.status(404).json({ msg: "Tienda no encontrada" });
        }

        tienda.nombre = nombre || tienda.nombre;
        tienda.descripcion = descripcion || tienda.descripcion;
        tienda.numcupones = numcupones || tienda.numcupones;
        tienda.activo = activo !== undefined ? activo : tienda.activo;

        await tienda.save();

        return res.status(200).json({
            msg: `Tienda actualizada correctamente`,
            tienda: tienda.nombre,
            id: tienda.id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al actualizar la tienda",
            message: error.message,
        });
    }
};

const obtenerTienda = async (req, res) => {
    try {
        const { idTienda } = req.params;

        const tienda = await Tienda.findByPk(idTienda);

        if (!tienda) {
            return res.status(404).json({ msg: "Tienda no encontrada" });
        }

        return res.status(200).json({
            tienda,
        });
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener la tienda",
            message: error.message,
        });
    }
};

export {
    listarTiendas,
    activarTienda,
    crearTienda,
    editarTienda,
    obtenerTienda,
};
