import { Campania, ConfigSaldo, Promocion, Tienda } from "../models/index.js";
import { getFilters } from "../helpers/filtros.js";
import { getPagination } from "../helpers/paginacion.js";

const listarCampania = async (req, res) => {
    try {
        const filtros = getFilters(req.query);
        const paginacion = getPagination(req.query);

        let queryOptions = {
            where: filtros,
            order: [["id", "DESC"]],
            include: [
                { model: Promocion, as: "promociones" },
                { model: ConfigSaldo, as: "configuracion" },
                { model: Tienda, as: "tiendas" },
            ],
            distinct: true,
        };

        if (paginacion.limit) {
            queryOptions.limit = paginacion.limit;
            queryOptions.offset = paginacion.offset;
        }
        const { count, rows } = await Campania.findAndCountAll(queryOptions);

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
            error: "Error al obtener las campañas",
            message: error.message,
        });
    }
};

const activarCampania = async (req, res) => {
    try {
        const { idCampania } = req.body;

        if (!idCampania) {
            const error = new Error("El id de la campaña es necesario");
            return res.status(400).json({ msg: error.message });
        }

        const campania = await Campania.findOne({
            where: { id: idCampania },
        });

        if (!campania) {
            const error = new Error("Campaña no encontrada");
            return res.status(404).json({ msg: error.message });
        }

        campania.activo = !campania.activo ? true : false;

        await campania.save();

        return res.status(200).json({
            msg: `Campaña actualizada correctamente`,
            campania: campania.nombre,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al activar la campaña",
            message: error.message,
        });
    }
};

const crearCampania = async (req, res) => {
    try {
        const { nombre, descripcion, logo } = req.body;

        const campania = await Campania.create({
            nombre,
            descripcion,
            logo,
        });

        return res.status(201).json({
            msg: `campaña creada correctamente`,
            campania: campania.nombre,
            id: campania.id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al crear la campaña",
            message: error.message,
        });
    }
};

const agregarTiendas = async (req, res) => {
    try {
        const { campaniaId, tiendasIds, eliminarTiendasIds } = req.body;

        const campania = await Campania.findByPk(campaniaId);
        if (!campania) {
            return res.status(404).json({ error: "Campaña no encontrada" });
        }
        if (tiendasIds && tiendasIds.length > 0) {
            const tiendasExistentes = await campania.getTiendas();
            const tiendasExistentesIds = tiendasExistentes.map((t) => t.id);

            const nuevasTiendasIds = tiendasIds.filter(
                (id) => !tiendasExistentesIds.includes(id)
            );

            if (nuevasTiendasIds.length > 0) {
                const nuevasTiendas = await Tienda.findAll({
                    where: { id: nuevasTiendasIds },
                });

                if (nuevasTiendas.length !== nuevasTiendasIds.length) {
                    return res.status(400).json({
                        error: "Algunas tiendas a agregar no existen en la base de datos",
                    });
                }

                await campania.addTiendas(nuevasTiendas);
            }
        }

        if (eliminarTiendasIds && eliminarTiendasIds.length > 0) {
            const tiendasAEliminar = await Tienda.findAll({
                where: { id: eliminarTiendasIds },
            });

            if (tiendasAEliminar.length > 0) {
                await campania.removeTiendas(tiendasAEliminar);
            }
        }

        return res.status(200).json({
            msg: `Tiendas actualizadas en la campaña ${campania.nombre} correctamente`,
            campania: campania.nombre,
            id: campania.id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al actualizar las tiendas en la campaña",
            message: error.message,
        });
    }
};

const agregarPromociones = async (req, res) => {
    try {
        const { campaniaId, promocionesIds, eliminarPromocionesIds } = req.body;

        const campania = await Campania.findByPk(campaniaId, {
            include: { model: Promocion, as: "promociones" },
        });
        if (!campania) {
            return res.status(404).json({ error: "Campaña no encontrada" });
        }

        if (promocionesIds && promocionesIds.length > 0) {
            const promocionesExistentes = await campania.getPromociones();

            const promocionesExistentesIds = promocionesExistentes.map(
                (t) => t.id
            );

            const nuevasPromocionesIds = promocionesIds.filter(
                (id) => !promocionesExistentesIds.includes(id)
            );

            if (nuevasPromocionesIds.length > 0) {
                const nuevasPromociones = await Promocion.findAll({
                    where: { id: nuevasPromocionesIds },
                });

                if (nuevasPromociones.length !== nuevasPromocionesIds.length) {
                    return res.status(400).json({
                        error: "Algunas promociones a agregar no existen en la base de datos",
                    });
                }

                await campania.addPromociones(nuevasPromociones);
            }
        }

        if (eliminarPromocionesIds && eliminarPromocionesIds.length > 0) {
            const promocionesAEliminar = await Promocion.findAll({
                where: { id: eliminarPromocionesIds },
            });

            if (promocionesAEliminar.length > 0) {
                await campania.removePromociones(promocionesAEliminar);
            }
        }

        return res.status(200).json({
            msg: `Promociones actualizadas en la campaña ${campania.nombre} correctamente`,
            campania: campania.nombre,
            id: campania.id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al actualizar las promociones en la campaña",
            message: error.message,
        });
    }
};

const editarCampania = async (req, res) => {
    try {
        const { idCampania } = req.params;
        const { nombre, descripcion, activo, logo } = req.body;

        const campania = await Campania.findByPk(idCampania);
        if (!campania) {
            return res.status(404).json({ msg: "Campaña no encontrada" });
        }

        campania.nombre = nombre || campania.nombre;
        campania.descripcion = descripcion || campania.descripcion;
        campania.logo = logo || campania.logo;
        campania.activo = activo !== undefined ? activo : campania.activo;

        await campania.save();

        return res.status(200).json({
            msg: `Campaña actualizada correctamente`,
            campania: campania.nombre,
            id: campania.id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al actualizar la campaña",
            message: error.message,
        });
    }
};

const obtenerCampania = async (req, res) => {
    try {
        const { idCampania } = req.params;

        const campania = await Campania.findByPk(idCampania, {
            include: [
                { model: Tienda },
                { model: Promocion, as: "promociones" },
                { model: ConfigSaldo, as: "configuracion" },
            ],
            distinct: true,
        });

        if (!campania) {
            return res.status(404).json({ msg: "Campaña no encontrada" });
        }

        return res.status(200).json({
            campania,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener la campaña",
            message: error.message,
        });
    }
};

export {
    listarCampania,
    activarCampania,
    crearCampania,
    agregarTiendas,
    agregarPromociones,
    editarCampania,
    obtenerCampania,
};
