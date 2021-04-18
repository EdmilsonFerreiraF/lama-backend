import express from "express";
import musicController from "../MusicController";
import multer from "multer";

const upload = multer({ dest: 'uploads/' })

export const musicRouter = express.Router();

musicRouter.post("/create", upload.single('file'), musicController.createMusic);
musicRouter.get("/", musicController.getAllMusics);
musicRouter.get("/:id", musicController.getMusicById);
musicRouter.get("/:id/details", musicController.getMusicDetailsById);