import { Op } from "sequelize";

export const getFilters = (query) => {
    const { search, activo, ruc, estadoFactura, cliente_id } = query;
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

    return whereCondition;
};
