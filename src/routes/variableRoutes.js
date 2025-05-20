import express from "express";
import { listarVariables, crearVariable, editarVariable } from "../controller/variableController.js";

const variableRouter = express.Router();

variableRouter.get("/", listarVariables);
variableRouter.post("/", crearVariable);
variableRouter.put("/:idVariable", editarVariable);

export default variableRouter;
