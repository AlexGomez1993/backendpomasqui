import { Noticia } from "../models/index.js";

const listarNoticias = async (req, res) => {
    try {
        const noticias = await Noticia.findAll({
            where: { activo: 1 },
        });

        if (noticias.length === 0) {
            const error = new Error("No tienes noticias registradas");
            return res.status(404).json({ msg: error.message });
        }
        return res.status(200).json(noticias);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener las noticias",
            message: error.message,
        });
    }
};

export { listarNoticias };
