import express from "express";
import {
    listarTiendas,
    activarTienda,
    crearTienda,
    editarTienda,
    obtenerTienda,
} from "../controller/tiendaController.js";

const tiendasRouter = express.Router();

tiendasRouter.get("/", listarTiendas);
tiendasRouter.post("/activarTienda", activarTienda);
tiendasRouter.post("/", crearTienda);
tiendasRouter.put("/:idTienda", editarTienda);
tiendasRouter.get("/:idTienda", obtenerTienda);

export default tiendasRouter;
