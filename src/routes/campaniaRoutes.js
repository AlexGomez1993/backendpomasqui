import express from "express";
import {
    listarCampania,
    activarCampania,
    crearCampania,
    agregarTiendas,
    agregarPromociones,
    editarCampania,
    obtenerCampania,
    agregarFormasPago,
} from "../controller/campaniaController.js";

const campaniaRouter = express.Router();

campaniaRouter.get("/", listarCampania);
campaniaRouter.post("/activarCampania", activarCampania);
campaniaRouter.post("/", crearCampania);
campaniaRouter.post("/agregarTiendas", agregarTiendas);
campaniaRouter.post("/agregarPromociones", agregarPromociones);
campaniaRouter.post("/agregarFormasPago", agregarFormasPago);
campaniaRouter.put("/:idCampania", editarCampania);
campaniaRouter.get("/:idCampania", obtenerCampania);

export default campaniaRouter;
