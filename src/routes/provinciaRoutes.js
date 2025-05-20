import express from "express";
import { listarProvincias } from "../controller/provinciaController.js";

const provinciaRouter = express.Router();

provinciaRouter.get("/", listarProvincias);

export default provinciaRouter;
