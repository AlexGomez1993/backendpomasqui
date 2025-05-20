import express from "express";
import {
    listarFacturas,
    ingresarFacturasIsla,
    ingresarFacturasWeb,
    rechazarFacturaWeb,
    procesarFacturaWeb,
    validarFactura,
} from "../controller/facturasController.js";

const facturasRouter = express.Router();

facturasRouter.get("/", listarFacturas);
facturasRouter.post("/facturasIsla", ingresarFacturasIsla);
facturasRouter.post("/facturasWeb", ingresarFacturasWeb);
facturasRouter.put("/rechazarFacturaWeb", rechazarFacturaWeb);
facturasRouter.put("/procesarFacturaWeb", procesarFacturaWeb);
facturasRouter.get("/validarFactura", validarFactura);

export default facturasRouter;
