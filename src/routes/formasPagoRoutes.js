import express from "express";
import {
    activarFormaPago,
    crearFormaPago,
    editarFormaPago,
    listarFormaPago,
    obtenerFormaPago,
} from "../controller/formaPagoController.js";

const formaPagoRouter = express.Router();

formaPagoRouter.get("/", listarFormaPago);
formaPagoRouter.post("/", crearFormaPago);
formaPagoRouter.put("/:idFormaPago", editarFormaPago);
formaPagoRouter.post("/activarFormaPago", activarFormaPago);
formaPagoRouter.get("/:idFormaPago", obtenerFormaPago);

export default formaPagoRouter;
