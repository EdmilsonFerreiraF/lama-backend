"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const UserRouter_1 = require("./controller/routes/UserRouter");
const MusicRouter_1 = require("./controller/routes/MusicRouter");
const app = express_1.default();
app.use(express_1.default.json());
app.use(cors_1.default());
app.use('/user', UserRouter_1.userRouter);
app.use('/music', MusicRouter_1.musicRouter);
app.listen(process.env.PORT || 3003, () => {
    console.log("Servidor rodando na porta 3003");
});
