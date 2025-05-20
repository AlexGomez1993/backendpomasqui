import { Formapago } from "../models/index.js";
import { getFilters } from "../helpers/filtros.js";
import { getPagination } from "../helpers/paginacion.js";

const listarFormaPago = async (req, res) => {
    try {
        const filtros = getFilters(req.query);
        const paginacion = getPagination(req.query);

        let queryOptions = {
            where: filtros,
            order: [["activo", "DESC"]],
        };

        if (paginacion.limit) {
            queryOptions.limit = paginacion.limit;
            queryOptions.offset = paginacion.offset;
        }

        const { count, rows } = await Formapago.findAndCountAll(queryOptions);

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
            error: "Error al obtener las formas de pago",
            message: error.message,
        });
    }
};

const crearFormaPago = async (req, res) => {
    try {
        const { nombre, descripcion, factor } = req.body;

        if (!nombre) {
            return res.status(400).json({ msg: "El nombre es obligatorio" });
        }

        const nuevaFormaPago = await Formapago.create({
            nombre,
            descripcion,
            factor,
        });

        return res.status(201).json(nuevaFormaPago);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al agregar la forma de pago",
            message: error.message,
        });
    }
};

const editarFormaPago = async (req, res) => {
    try {
        const { idFormaPago } = req.params;
        const { nombre, descripcion, factor, activo } = req.body;

        const formaPago = await Formapago.findByPk(idFormaPago);
        if (!formaPago) {
            return res.status(404).json({ msg: "Forma de pago no encontrada" });
        }

        formaPago.nombre = nombre || formaPago.nombre;
        formaPago.descripcion = descripcion || formaPago.descripcion;
        formaPago.factor = factor || formaPago.factor;
        formaPago.activo = activo !== undefined ? activo : formaPago.activo;

        await formaPago.save();

        return res.status(200).json(formaPago);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al editar la forma de pago",
            message: error.message,
        });
    }
};

const activarFormaPago = async (req, res) => {
    try {
        const { idFormaPago } = req.body;

        if (!idFormaPago) {
            const error = new Error("El id de la forma de pago es necesario");
            return res.status(400).json({ msg: error.message });
        }

        const formapago = await Formapago.findOne({
            where: { id: idFormaPago },
        });

        if (!formapago) {
            const error = new Error("Forma de pago no encontrada");
            return res.status(404).json({ msg: error.message });
        }

        formapago.activo = !formapago.activo ? true : false;

        await formapago.save();

        return res.status(200).json({
            msg: `Forma de pago actualizada correctamente`,
            formaPago: formapago.nombre,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al activar la forma de pago",
            message: error.message,
        });
    }
};

const obtenerFormaPago = async (req, res) => {
    try {
        const { idFormaPago } = req.params;

        const formaPago = await Formapago.findByPk(idFormaPago);

        if (!formaPago) {
            return res.status(404).json({ msg: "Forma de pago no encontrada" });
        }

        return res.status(200).json({
            formaPago,
        });
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener la forma de pago",
            message: error.message,
        });
    }
};

export {
    listarFormaPago,
    crearFormaPago,
    editarFormaPago,
    activarFormaPago,
    obtenerFormaPago,
};
