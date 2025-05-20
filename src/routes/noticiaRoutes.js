import express from "express";
import { listarNoticias } from "../controller/noticiaController.js";

const noticiaRouter = express.Router();

noticiaRouter.get("/", listarNoticias);

export default noticiaRouter;
