import express from "express";
import {
    crearClienteWeb,
    login,
    loginCliente,
    validarCliente,
} from "../controller/authController.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/loginCliente", loginCliente);
authRouter.post("/validarCliente", validarCliente);
authRouter.post("/ingresarClienteWeb", crearClienteWeb);

export default authRouter;
