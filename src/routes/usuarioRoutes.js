import express from "express";
import {
    crearUsuario,
    editarUsuario,
    listarUsuarios,
} from "../controller/usuarioController.js";

const usuarioRouter = express.Router();

usuarioRouter.get("/", listarUsuarios);
usuarioRouter.post("/", crearUsuario);
usuarioRouter.put("/:idUsuario", editarUsuario);

export default usuarioRouter;
