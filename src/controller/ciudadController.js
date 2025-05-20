import { getFilters } from "../helpers/filtros.js";
import { getPagination } from "../helpers/paginacion.js";
import { Ciudad, Provincia } from "../models/index.js";

const listarCiudades = async (req, res) => {
    try {
        const ciudades = await Ciudad.findAll({
            order: [["nombre", "ASC"]],
        });

        if (ciudades.length === 0) {
            const error = new Error("No tienes ciudades registradas");
            return res.status(404).json({ msg: error.message });
        }
        return res.status(200).json(ciudades);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener las ciudades",
            message: error.message,
        });
    }
};

export { listarCiudades };
