"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.musicRouter = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const MusicController_1 = __importDefault(require("../MusicController"));
const storage = multer_1.default.memoryStorage();
const upload = multer_1.default({ storage: storage, limits: { fileSize: 6000000 } });
exports.musicRouter = express_1.default.Router();
exports.musicRouter.post("/create", upload.single('file'), MusicController_1.default.createMusic);
exports.musicRouter.get("/all", MusicController_1.default.getAllMusics);
exports.musicRouter.get("/:id", MusicController_1.default.getMusicById);
exports.musicRouter.get("/:id/details", MusicController_1.default.getMusicDetailsById);
exports.musicRouter.delete("/:id", MusicController_1.default.deleteMusicById);
exports.musicRouter.get("/title/:title", MusicController_1.default.getMusicByName);
