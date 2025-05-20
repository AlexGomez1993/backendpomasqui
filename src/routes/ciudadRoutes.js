import express from "express";
import { listarCiudades } from "../controller/ciudadController.js";

const ciudadRouter = express.Router();

ciudadRouter.get("/", listarCiudades);

export default ciudadRouter;
