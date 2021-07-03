"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicController = void 0;
const idGenerator_1 = require("../business/services/idGenerator");
const tokenGenerator_1 = require("../business/services/tokenGenerator");
const MusicBusiness_1 = require("../business/MusicBusiness");
const MusicDatabase_1 = require("../data/MusicDatabase");
const musicBusiness = new MusicBusiness_1.MusicBusiness(new idGenerator_1.IdGenerator(), new MusicDatabase_1.MusicDatabase(), new tokenGenerator_1.TokenGenerator());
class MusicController {
    createMusic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, author, date, genre, album } = req.body;
                const file = req.file;
                const token = req.headers.authorization;
                const input = {
                    title,
                    author,
                    date,
                    file,
                    genre,
                    album
                };
                yield musicBusiness.createMusic(input, token);
                res.status(201).send("Music created successfully");
            }
            catch (error) {
                const { statusCode, message } = error;
                res.status(statusCode || 400).send({ message });
            }
            ;
        });
    }
    ;
    getAllMusics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization;
                const result = yield musicBusiness.getAllMusics(token);
                res.send(result);
            }
            catch (error) {
                const { statusCode, message } = error;
                res.status(statusCode || 400).send({ message });
            }
            ;
        });
    }
    getMusicById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield musicBusiness.getMusicById(id);
                res.send(result.file.buffer);
            }
            catch (error) {
                const { statusCode, message } = error;
                res.status(statusCode || 400).send({ message });
            }
            ;
        });
    }
    ;
    getMusicDetailsById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const token = req.headers.authorization;
                const result = yield musicBusiness.getMusicDetailsById(id, token);
                res.send(result);
            }
            catch (error) {
                const { statusCode, message } = error;
                res.status(statusCode || 400).send({ message });
            }
            ;
        });
    }
    ;
    getMusicByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title } = req.params;
                const token = req.headers.authorization;
                const result = yield musicBusiness.getMusicByName(title, token);
                res.send(result);
            }
            catch (error) {
                const { statusCode, message } = error;
                res.status(statusCode || 400).send({ message });
            }
            ;
        });
    }
    ;
    deleteMusicById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const token = req.headers.authorization;
                const result = yield musicBusiness.deleteMusicById(id, token);
                res.send(result);
            }
            catch (error) {
                const { statusCode, message } = error;
                res.status(statusCode || 400).send({ message });
            }
            ;
        });
    }
    ;
}
exports.MusicController = MusicController;
;
exports.default = new MusicController();
