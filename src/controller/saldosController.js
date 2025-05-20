import { Saldo, Campania, Promocion } from "../models/index.js";

const listarSaldosCliente = async (req, res) => {
    try {
        const { cliente_id } = req.body;

        const saldosCliente = await Saldo.findAll({
            where: {
                cliente_id: cliente_id,
            },
            include: [
                {
                    model: Campania,
                    as: "campania",
                    where: {
                        activo: 1,
                    },
                    required: true,
                },
                {
                    model: Promocion,
                    as: "promocion",
                    required: true,
                },
            ],
        });

        res.status(200).json({ data: saldosCliente });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener los saldos",
            message: error.message,
        });
    }
};

export { listarSaldosCliente };
