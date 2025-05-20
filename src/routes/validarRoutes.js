import express from "express";
import {
    validarMail,
    cambiarContrasena,
} from "../controller/validarController.js";

const validarRouter = express.Router();

validarRouter.post("/validarMail", validarMail);
validarRouter.post("/cambiarContrasena", cambiarContrasena);

export default validarRouter;
