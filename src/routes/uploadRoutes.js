import express from "express";
const uploadRouter = express.Router();
import upload from "../middleware/upload.js";
import { uploadImage } from "../controller/uploadController.js";

uploadRouter.post("/uploadImage", upload.single("imagen"), uploadImage);

export default uploadRouter;
