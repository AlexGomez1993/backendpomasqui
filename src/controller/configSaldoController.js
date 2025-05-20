import { Campania, ConfigSaldo } from "../models/index.js";
import moment from "moment";
import { getFilters } from "../helpers/filtros.js";
import { getPagination } from "../helpers/paginacion.js";

const listarConfigSaldo = async (req, res) => {
    try {
        const filtros = getFilters(req.query);
        const paginacion = getPagination(req.query);

        let queryOptions = {
            where: filtros,
            order: [["id", "DESC"]],
            include: [
                {
                    model: Campania,
                    as: "campanias",
                },
            ],
        };

        if (paginacion.limit) {
            queryOptions.limit = paginacion.limit;
            queryOptions.offset = paginacion.offset;
        }

        const { count, rows } = await ConfigSaldo.findAndCountAll(queryOptions);

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
            error: "Error al obtener los saldos configurados",
            message: error.message,
        });
    }
};

const crearConfigSaldo = async (req, res) => {
    try {
        const { observacion, descripcion, user, campania_id } = req.body;

        const configSaldo = await ConfigSaldo.create({
            observacion,
            descripcion,
            fecha: moment().subtract(5, "hours").format("YYYY-MM-DD HH:mm:ss"),
            user,
            campania_id,
        });

        if (!configSaldo) {
            const error = new Error(
                "Error al configurar el saldo de la campaña"
            );
            return res.status(404).json({ msg: error.message });
        }

        return res.status(201).json({
            msg: `saldo de la campaña configurada correctamente`,
            campania: configSaldo.nombre,
            id: configSaldo.id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al crear la variable",
            message: error.message,
        });
    }
};

const editarConfigSaldo = async (req, res) => {
    try {
        const { idConfigSaldo } = req.params;
        const { observacion, descripcion, activo } = req.body;

        const configSaldo = await ConfigSaldo.findByPk(idConfigSaldo);
        if (!configSaldo) {
            return res.status(404).json({ msg: "Campaña no encontrada" });
        }

        configSaldo.observacion = observacion || configSaldo.observacion;
        configSaldo.descripcion = descripcion || configSaldo.descripcion;
        configSaldo.activo = activo !== undefined ? activo : configSaldo.activo;

        await configSaldo.save();

        return res.status(200).json({
            msg: `Saldo configurado fue actualizado correctamente`,
            saldo: configSaldo.nombre,
            idCampaña: configSaldo.campania_id,
            id: configSaldo.id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al actualizar el saldo configurado",
            message: error.message,
        });
    }
};

export { listarConfigSaldo, crearConfigSaldo, editarConfigSaldo };
