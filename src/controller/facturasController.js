import {
    Factura,
    Saldo,
    Campania,
    Variable,
    Promocion,
    Tienda,
    Cupon,
    SecuencialCampania,
    ConfigSaldo,
    Cliente,
    Formapago,
} from "../models/index.js";
import { getFilters } from "../helpers/filtros.js";
import { getPagination } from "../helpers/paginacion.js";
import moment from "moment";

const campaniaInclude = {
    model: Campania,
    as: "campanias",
    attributes: {
        exclude: ["activo", "slug", "descripcion"],
    },
    include: [
        {
            model: Promocion,
            as: "promociones",
            attributes: {
                exclude: ["activo", "descripcion"],
            },
        },
        {
            model: ConfigSaldo,
            as: "configuracion",
            attributes: {
                exclude: ["activo", "user", "fecha"],
            },
        },
    ],
    where: {},
};

const listarFacturas = async (req, res) => {
    try {
        const filtros = getFilters(req.query);
        const paginacion = getPagination(req.query);

        let queryOptions = {
            where: filtros,
            distinct: true,
            include: [
                {
                    model: Tienda,
                    attributes: {
                        exclude: ["activo", "slug", "descripcion", "logo"],
                    },
                },
                {
                    model: Cliente,
                    attributes: {
                        exclude: [
                            "activo",
                            "fecha_nacimiento",
                            "saldo",
                            "slug",
                            "sexo",
                            "sector",
                            "edad",
                            "contrasena",
                            "estado",
                        ],
                    },
                },
                {
                    model: Cupon,
                    as: "cupones",
                    attributes: {
                        exclude: ["id", "valorcompra"],
                    },
                },
                {
                    model: Formapago,
                    attributes: {
                        exclude: ["slug","descripcion"],
                    },
                },
            ],
            order: [["fechaRegistro", "ASC"]],
        };
            if (req.query.campania_id) {
                campaniaInclude.where.id = req.query.campania_id;
            }
            
            if (req.query.campanias_activas !== undefined) {
                campaniaInclude.where.activo = req.query.campanias_activas === "true";
            }
            
            if (Object.keys(campaniaInclude.where).length > 0) {
                queryOptions.include.push(campaniaInclude);
            }
        if (paginacion.limit) {
            queryOptions.limit = paginacion.limit;
            queryOptions.offset = paginacion.offset;
        }

        const { count, rows } = await Factura.findAndCountAll(queryOptions);

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
            error: "Error al obtener las facturas",
            message: error.message,
        });
    }
};

const ingresarFacturasIsla = async (req, res) => {
    try {
        const { facturasCliente } = req.body;
        const hoy = moment().subtract(5, "hours").format("YYYY-MM-DD HH:mm:ss");
        let cuponesImprimir = [];

        await Promise.all(
            facturasCliente.campanias.map(async (campania) => {
                await Promise.all(
                    campania.promociones.map(async (promocion) => {
                        await Promise.all(
                            promocion.facturas.map(async (factura) => {
                                const facturaIngresada = await Factura.create({
                                    numero: factura.numero,
                                    monto: factura.monto,
                                    campania_id: campania.id,
                                    promocion_id: promocion.id,
                                    tienda_id: factura.tienda_id,
                                    formapago_id: factura.formapago_id,
                                    createdAt: hoy,
                                    usuario_id: facturasCliente.usuario_id,
                                    ruc: facturasCliente.ruc,
                                    estado: 4,
                                    fechaRegistro: hoy,
                                    cliente_id: facturasCliente.cliente_id,
                                });

                                if (!facturaIngresada) {
                                    throw new Error(
                                        "No se pudo ingresar la factura"
                                    );
                                }

                                const cupon = await Cupon.create({
                                    numcupones: factura.numcupones,
                                    valorcompra: factura.monto,
                                    montominimo: promocion.montominimo,
                                    cliente_id: facturasCliente.cliente_id,
                                    campania_id: campania.id,
                                    formapago_id: factura.formapago_id,
                                    factura_id: facturaIngresada.id,
                                    createdAt: hoy,
                                    promocion_id: promocion.id,
                                });

                                if (!cupon) {
                                    throw new Error(
                                        "No se pudo ingresar el cupon"
                                    );
                                }
                                return cupon;
                            })
                        );

                        if (campania.tipo_configuracion == 1) {
                            const saldoCliente = await Saldo.findOne({
                                where: {
                                    campania_id: campania.id,
                                    promocion_id: promocion.id,
                                    cliente_id: facturasCliente.cliente_id,
                                },
                            });

                            if (saldoCliente) {
                                await saldoCliente.update({
                                    saldo: promocion.nuevoSaldo,
                                });
                            } else {
                                const nuevoSaldo = await Saldo.create({
                                    cliente_id: facturasCliente.cliente_id,
                                    campania_id: campania.id,
                                    promocion_id: promocion.id,
                                    saldo: promocion.nuevoSaldo,
                                });

                                if (!nuevoSaldo) {
                                    throw new Error(
                                        "No se pudo crear el saldo para el cliente"
                                    );
                                }
                            }
                        }
                    })
                );

                const secuencialCampania = await SecuencialCampania.findOne({
                    where: { campania_id: campania.id },
                });

                if (!secuencialCampania) {
                    throw new Error(
                        "No se encuentra el secuencial enlazado a la campaña"
                    );
                }

                const variableCampania = await Variable.findOne({
                    where: { id: secuencialCampania.variable_id },
                });

                if (!variableCampania) {
                    throw new Error(
                        "No se encuentra la variable enlazada a la campaña"
                    );
                }

                const cuponesActual = parseInt(variableCampania.valoractual);
                const totalCuponesActualizado =
                    cuponesActual + campania.totalcupones;
                await variableCampania.update({
                    valoractual: totalCuponesActualizado,
                });

                cuponesImprimir.push({
                    campania: campania.nombre,               
                    ultimoCuponImpreso: cuponesActual,
                    ultimoCuponImprimir: totalCuponesActualizado,
                });
            })
        );

        res.status(201).json({
            msg: "Facturas ingresadas correctamente.",
            cuponesImprimir,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al ingresar las facturas",
            message: error.message,
        });
    }
};

const ingresarFacturasWeb = async (req, res) => {
    try {
        const { facturasCliente } = req.body;
        const hoy = moment().subtract(5, "hours").format("YYYY-MM-DD HH:mm:ss");
        let cuponesImprimir = [];

        await Promise.all(
            facturasCliente.campanias.map(async (campania) => {
                const facturaIngresada = await Factura.create({
                    numero: campania.factura.numero,
                    monto: campania.factura.monto,
                    tienda_id: campania.factura.tienda_id,
                    campania_id: campania.id,
                    formapago_id: campania.factura.formapago_id,
                    promocion_id: 0,
                    imagen: campania.factura.imagen,
                    voucher: campania.factura.voucher,
                    createdAt: "0000-00-00 00:00:00",
                    fechaRegistro: hoy,
                    usuario_id: 0,
                    ruc: facturasCliente.ruc,
                    estado: 1,
                    cliente_id: facturasCliente.cliente_id,
                });

                if (!facturaIngresada) {
                    throw new Error("No se pudo ingresar la factura");
                }
            })
        );

        res.status(201).json({
            msg: "Facturas ingresadas correctamente.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al ingresar las facturas",
            message: error.message,
        });
    }
};

const rechazarFacturaWeb = async (req, res) => {
    try {
        const { factura_id, observacion, usuario_id } = req.body;
        const hoy = moment().subtract(5, "hours").format("YYYY-MM-DD HH:mm:ss");
        const facturaRechazada = await Factura.findByPk(factura_id, {
            include: [
                {
                    model: Cliente,
                    attributes: {
                        exclude: [
                            "activo",
                            "fecha_nacimiento",
                            "saldo",
                            "slug",
                            "sexo",
                            "sector",
                            "edad",
                            "contrasena",
                            "estado",
                        ],
                    },
                },
                {
                    model: Tienda,
                    attributes: {
                        exclude: ["activo", "slug", "descripcion", "logo"],
                    },
                },
                {
                    model: Campania,
                    as: "campanias",
                    attributes: {
                        exclude: ["activo", "slug", "descripcion", "logo"],
                    },
                },
            ],
        });

        if (!facturaRechazada) {
            throw new Error(`No se encontro la factura con id ${factura_id}`);
        }

        await facturaRechazada.update({
            estado: 3,
            createdAt: hoy,
            observacion: observacion,
            usuario_id: usuario_id,
        });

/*         const contenido = `
		
					<p style="text-align:center;">
					    <h3 style="text-align:center;">SISTEMA DE CANJES SCALA SHOPPING</h3>
					</p>
					<br>
					<br>
					<p style="text-align:center;">
						Estimado <strong> ${facturaRechazada.cliente.nombre} ${facturaRechazada.cliente.apellidos}  </strong>,
					
					</p>
					<br>
					<p>
						Tu factura Nro. <strong>${facturaRechazada.numero}</strong>, de <strong>${facturaRechazada.tienda.nombre}</strong> registrada en la campa&ntilde;a <strong>${facturaRechazada.campanias.nombre}</strong> por un monto de <strong>${facturaRechazada.monto}</strong> ha sido RECHAZADA. 					</p>
					<br>
					<p>
						<strong>Motivo: </strong>${observacion} 
					</p>
					<br>
					<p>
						Verifica los datos de tu factura y registrala nuevamente.
						
					</p>
					<br>
					<br>
					<p style="text-align:center;">
						Este correo ha sido generado autom&aacute;ticamente, favor no responder al mismo.<br>
						Gracias por su atenci&oacute;n!
					</p>
				`; */
/*         const transporter = nodemailer.createTransport({
            host: "mail.plazapomasqui.com",
            port: 465,
            secure: true,
            auth: {
                user: "scalacanjes@plazapomasqui.com",
                pass: "tqom]@S#u3G1",
            },
        });

        const mailOptions = {
            from: "scalacanjes@plazapomasqui.com",
            to: facturaRechazada.cliente.email,
            subject: `${facturaRechazada.campanias.nombre} - Factura ${facturaRechazada.numero} Rechazada`,
            html: contenido,
        };

        await transporter.sendMail(mailOptions); */

        res.status(200).json({
            msg: "Factura rechazada correctamente.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al rechazar las facturas",
            message: error.message,
        });
    }
};

const procesarFacturaWeb = async (req, res) => {
    try {
        const { factura_id, promocion, usuario_id, numcupones, campania } =
            req.body;
        const hoy = moment().subtract(5, "hours").format("YYYY-MM-DD HH:mm:ss");
        const facturaIngresada = await Factura.findByPk(factura_id);
        let cuponesImprimir = [];

        if (!facturaIngresada) {
            throw new Error(`No se encontro la factura con id ${factura_id}`);
        }

        await facturaIngresada.update({
            promocion_id: promocion.id,
            createdAt: hoy,
            usuario_id: usuario_id,
            estado: 2,
        });

        const cupon = await Cupon.create({
            numcupones,
            valorcompra: facturaIngresada.monto,
            montominimo: promocion.montominimo,
            cliente_id: facturaIngresada.cliente_id,
            campania_id: facturaIngresada.campania_id,
            formapago_id: facturaIngresada.formapago_id,
            promocion_id: promocion.id,
            factura_id: facturaIngresada.id,
            createdAt: hoy,
        });

        if (!cupon) {
            throw new Error("No se pudo ingresar el cupon");
        }

        if (campania.tipo_configuracion == 1) {
            const saldoCliente = await Saldo.findOne({
                where: {
                    campania_id: facturaIngresada.campania_id,
                    promocion_id: promocion.id,
                    cliente_id: facturaIngresada.cliente_id,
                },
            });

            if (saldoCliente) {
                await saldoCliente.update({
                    saldo: promocion.nuevoSaldo,
                });
            } else {
                const saldoCliente = await Saldo.create({
                    cliente_id: facturaIngresada.cliente_id,
                    campania_id: facturaIngresada.campania_id,
                    promocion_id: promocion.id,
                    saldo: promocion.nuevoSaldo,
                });

                if (!saldoCliente) {
                    throw new Error(
                        "No se pudo crear el saldo para el cliente"
                    );
                }
            }
        }

        const secuencialCampania = await SecuencialCampania.findOne({
            where: { campania_id: facturaIngresada.campania_id },
        });

        if (!secuencialCampania) {
            throw new Error(
                "No se encuentra el secuencial enlazado a la campaña"
            );
        }

        const variableCampania = await Variable.findOne({
            where: { id: secuencialCampania.variable_id },
        });

        if (!variableCampania) {
            throw new Error(
                "No se encuentra la variable enlazada a la campaña"
            );
        }

        const cuponesActual = parseInt(variableCampania.valoractual);
        const totalCuponesActualizado = cuponesActual + numcupones;
        await variableCampania.update({
            valoractual: totalCuponesActualizado,
        });

        cuponesImprimir.push({
            campania: campania.nombre,
            ultimoCuponImpreso: cuponesActual,
            ultimoCuponImprimir: totalCuponesActualizado,
        });

        res.status(200).json({
            msg: "Factura procesada correctamente.",
            cuponesImprimir,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al procesar las facturas",
            message: error.message,
        });
    }
};

const validarFactura = async (req, res) => {
    try {
        const { numeroFactura, tienda_id } = req.body;

        const facturaEncontrada = await Factura.findOne({
            where: {
                tienda_id,
                numero: numeroFactura,
            },
        });
        if (facturaEncontrada) {
            return res.status(200).json({
                msg: "Factura encontrada",
                id: facturaEncontrada.id,
            });
        }
        return res.status(404).json({
            msg: "Factura no encontrada",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Error al procesar las facturas",
            message: error.message,
        });
    }
};

export {
    listarFacturas,
    ingresarFacturasIsla,
    ingresarFacturasWeb,
    rechazarFacturaWeb,
    procesarFacturaWeb,
    validarFactura,
};
