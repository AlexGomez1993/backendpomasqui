import { Op, fn, col, where } from "sequelize";

export const getFilters = (query) => {
    const { search, activo, ruc, estadoFactura, cliente_id, searchClient } = query;
    const whereCondition = {};

    if (search) {
        whereCondition.nombre = { [Op.like]: `%${search}%` };
    }

    if (activo) {
        whereCondition.activo = activo;
    }

    if (ruc) {
        whereCondition.ruc = { [Op.like]: `%${ruc}%` };
    }

    if (cliente_id) {
        whereCondition.cliente_id = cliente_id;
    }

    if (estadoFactura) {
        whereCondition.estado = estadoFactura;
    }

    if (searchClient) {
        whereCondition[Op.and] = [
            ...(whereCondition[Op.and] || []),
            where(
                fn('LOWER', fn('CONCAT', col('cliente.nombre'), ' ', col('apellidos'))),
                {
                    [Op.like]: `%${searchClient.toLowerCase()}%`
                }
            )
        ];
    }

    return whereCondition;
};
