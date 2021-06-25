import express from "express";
import multer from "multer";

import musicController from "../MusicController";

const storage = multer.memoryStorage()
const upload = multer({ storage: storage, limits: { fileSize: 6000000}});

export const musicRouter = express.Router();

musicRouter.post("/create", upload.single('file'), musicController.createMusic);
musicRouter.get("/all", musicController.getAllMusics);
musicRouter.get("/:id", musicController.getMusicById);
musicRouter.get("/:id/details", musicController.getMusicDetailsById);
musicRouter.get("/title/:title", musicController.getMusicByName);