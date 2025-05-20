import express from "express";
import {
    cambiarContrasena,
    crearClienteIsla,
    editarCliente,
    listarClientes,
    obtenerCliente,
    obtenerClienteId,
} from "../controller/clienteController.js";

const clienteRouter = express.Router();

clienteRouter.get("/", listarClientes);
clienteRouter.get("/:rucCliente", obtenerCliente);
clienteRouter.post("/isla", crearClienteIsla);
clienteRouter.put("/:idCliente", editarCliente);
clienteRouter.get("/:idCliente", obtenerClienteId);
clienteRouter.post("/cambioContrasenia", cambiarContrasena);

export default clienteRouter;
