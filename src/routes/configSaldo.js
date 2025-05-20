import express from "express";
import {
    listarConfigSaldo,
    crearConfigSaldo,
    editarConfigSaldo,
} from "../controller/configSaldoController.js";

const configSaldoRouter = express.Router();

configSaldoRouter.get("/", listarConfigSaldo);
configSaldoRouter.post("/", crearConfigSaldo);
configSaldoRouter.put("/:idConfigSaldo", editarConfigSaldo);

export default configSaldoRouter;
