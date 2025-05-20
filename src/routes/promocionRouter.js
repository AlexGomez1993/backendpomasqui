import express from "express";
import {
    listarPromocion,
    activarPromocion,
    crearPromocion,
    editarPromocion,
    obtenerPromocion,
} from "../controller/promocionController.js";

const promocionRouter = express.Router();

promocionRouter.get("/", listarPromocion);
promocionRouter.post("/activarPromocion", activarPromocion);
promocionRouter.post("/", crearPromocion);
promocionRouter.put("/:idPromocion", editarPromocion);
promocionRouter.get("/:idPromocion", obtenerPromocion);

export default promocionRouter;
