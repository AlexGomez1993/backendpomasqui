import { Promocion } from "../models/index.js";
import { getFilters } from "../helpers/filtros.js";
import { getPagination } from "../helpers/paginacion.js";

const listarPromocion = async (req, res) => {
    try {
        const filtros = getFilters(req.query);
        const paginacion = getPagination(req.query);

        let queryOptions = {
            where: filtros,
            order: [["id", "DESC"]],
        };

        if (paginacion.limit) {
            queryOptions.limit = paginacion.limit;
            queryOptions.offset = paginacion.offset;
        }

        const { count, rows } = await Promocion.findAndCountAll(queryOptions);

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
            error: "Error al obtener las promociones",
            message: error.message,
        });
    }
};

const activarPromocion = async (req, res) => {
    try {
        const { idPromocion } = req.body;

        if (!idPromocion) {
            const error = new Error("El id de la promocion es necesario");
            return res.status(400).json({ msg: error.message });
        }

        const promocion = await Promocion.findOne({
            where: { id: idPromocion },
        });

        if (!promocion) {
            const error = new Error("promocion no encontrada");
            return res.status(404).json({ msg: error.message });
        }

        promocion.activo = !promocion.activo ? true : false;

        await promocion.save();

        return res.status(200).json({
            msg: `Promocion actualizada correctamente`,
            promocion: promocion.nombre,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al activar la promocion",
            message: error.message,
        });
    }
};

const crearPromocion = async (req, res) => {
    try {
        const { nombre, descripcion, montominimo, fecha_inicio, fecha_fin } =
            req.body;

        const promocion = await Promocion.create({
            nombre,
            descripcion,
            montominimo,
            fecha_inicio,
            fecha_fin,
        });

        return res.status(201).json({
            msg: `promocion creada correctamente`,
            promocion: promocion.nombre,
            id: promocion.id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al crear la promocion",
            message: error.message,
        });
    }
};

const editarPromocion = async (req, res) => {
    try {
        const { idPromocion } = req.params;
        const {
            nombre,
            descripcion,
            montominimo,
            fecha_inicio,
            fecha_fin,
            activo,
        } = req.body;

        const promocion = await Promocion.findByPk(idPromocion);
        if (!promocion) {
            return res.status(404).json({ msg: "promocion no encontrada" });
        }

        promocion.nombre = nombre || promocion.nombre;
        promocion.descripcion = descripcion || promocion.descripcion;
        promocion.montominimo = montominimo || promocion.montominimo;
        promocion.fecha_inicio = fecha_inicio || promocion.fecha_inicio;
        promocion.fecha_fin = fecha_fin || promocion.fecha_fin;
        promocion.activo = activo !== undefined ? activo : promocion.activo;

        await promocion.save();

        return res.status(200).json({
            msg: `Promocion actualizada correctamente`,
            tienda: promocion.nombre,
            id: promocion.id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al actualizar la promocion",
            message: error.message,
        });
    }
};

const obtenerPromocion = async (req, res) => {
    try {
        const { idPromocion } = req.params;

        const promocion = await Promocion.findByPk(idPromocion);

        if (!promocion) {
            return res.status(404).json({ msg: "Promoción no encontrada" });
        }

        return res.status(200).json({
            promocion,
        });
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener la promoción",
            message: error.message,
        });
    }
};

export {
    listarPromocion,
    activarPromocion,
    crearPromocion,
    editarPromocion,
    obtenerPromocion,
};
