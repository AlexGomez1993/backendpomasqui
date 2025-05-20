import { Provincia } from "../models/index.js";

const listarProvincias = async (req, res) => {
    try {
        const provincias = await Provincia.findAll({
            order: [["nombre", "ASC"]],
        });

        if (provincias.length === 0) {
            const error = new Error("No tienes provincias registradas");
            return res.status(404).json({ msg: error.message });
        }
        return res.status(200).json(provincias);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener las provincias",
            message: error.message,
        });
    }
};

export { listarProvincias };
