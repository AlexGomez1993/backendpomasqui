import express from "express";
import {
    listarCampania,
    activarCampania,
    crearCampania,
    agregarTiendas,
    agregarPromociones,
    editarCampania,
    obtenerCampania,
} from "../controller/campaniaController.js";

const campaniaRouter = express.Router();

campaniaRouter.get("/", listarCampania);
campaniaRouter.post("/activarCampania", activarCampania);
campaniaRouter.post("/", crearCampania);
campaniaRouter.post("/agregarTiendas", agregarTiendas);
campaniaRouter.post("/agregarPromociones", agregarPromociones);
campaniaRouter.put("/:idCampania", editarCampania);
campaniaRouter.get("/:idCampania", obtenerCampania);

export default campaniaRouter;
