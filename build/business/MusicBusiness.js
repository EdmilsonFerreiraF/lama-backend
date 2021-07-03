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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicBusiness = void 0;
const idGenerator_1 = require("./services/idGenerator");
const tokenGenerator_1 = require("./services/tokenGenerator");
const CustomError_1 = require("../errors/CustomError");
const MusicDatabase_1 = require("../data/MusicDatabase");
const Music_1 = require("../data/model/Music");
const dayjs_1 = __importDefault(require("dayjs"));
class MusicBusiness {
    constructor(idGenerator, musicDatabase, tokenGenerator) {
        this.idGenerator = idGenerator;
        this.musicDatabase = musicDatabase;
        this.tokenGenerator = tokenGenerator;
    }
    ;
    createMusic(music, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!music.title ||
                    !music.date ||
                    !music.file ||
                    !music.genre ||
                    !music.album) {
                    throw new CustomError_1.CustomError(422, "Missing input");
                }
                ;
                if (!token) {
                    throw new CustomError_1.CustomError(422, "Missing token");
                }
                ;
                const id = this.idGenerator.generate();
                const isTokenValid = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
                if (!isTokenValid) {
                    throw new CustomError_1.CustomError(409, "Invalid token");
                }
                music = {
                    id,
                    title: music.title,
                    author: isTokenValid.nickname,
                    date: music.date,
                    file: music.file,
                    genre: music.genre,
                    album: music.album
                };
                if (!dayjs_1.default(music.date).isValid()) {
                    throw new CustomError_1.CustomError(409, "Invalid date");
                }
                yield this.musicDatabase.createMusic(new Music_1.Music(music.id, music.title, music.author, music.date, music.file, music.genre, music.album));
            }
            catch (error) {
                if (error.message.includes("music")) {
                    throw new CustomError_1.CustomError(409, "Music already exists");
                }
                ;
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
            ;
        });
    }
    ;
    getAllMusics(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!token) {
                    throw new CustomError_1.CustomError(422, "Missing token");
                }
                ;
                const isTokenValid = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
                if (!isTokenValid) {
                    throw new CustomError_1.CustomError(409, "Invalid token");
                }
                const result = yield this.musicDatabase.getAllMusics(isTokenValid.nickname);
                return result;
            }
            catch (error) {
                if (error.message.includes("jwt expired")) {
                    throw new CustomError_1.CustomError(401, error.message);
                }
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
            ;
        });
    }
    ;
    getMusicById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    throw new CustomError_1.CustomError(422, "Missing input");
                }
                ;
                const result = yield this.musicDatabase.getMusicById(id);
                return result;
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
            ;
        });
    }
    ;
    getMusicDetailsById(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    throw new CustomError_1.CustomError(422, "Missing input");
                }
                ;
                if (!token) {
                    throw new CustomError_1.CustomError(422, "Missing token");
                }
                ;
                const isTokenValid = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
                if (!isTokenValid) {
                    throw new CustomError_1.CustomError(409, "Invalid token");
                }
                const result = yield this.musicDatabase.getMusicDetailsById(id, isTokenValid.nickname);
                result.date = dayjs_1.default(result.date).format('DD/MM/YYYY');
                return result;
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
            ;
        });
    }
    ;
    getMusicByName(title, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!title) {
                    throw new CustomError_1.CustomError(422, "Missing input");
                }
                ;
                const isTokenValid = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
                if (!isTokenValid) {
                    throw new CustomError_1.CustomError(409, "Invalid token");
                }
                const result = yield this.musicDatabase.getMusicByName(title, isTokenValid.nickname);
                return result;
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
            ;
        });
    }
    ;
    deleteMusicById(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    throw new CustomError_1.CustomError(422, "Missing input");
                }
                ;
                if (!token) {
                    throw new CustomError_1.CustomError(422, "Missing token");
                }
                ;
                const isTokenValid = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
                if (!isTokenValid) {
                    throw new CustomError_1.CustomError(409, "Invalid token");
                }
                yield this.musicDatabase.deleteMusicById(id, isTokenValid.nickname);
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
            ;
        });
    }
    ;
}
exports.MusicBusiness = MusicBusiness;
;
exports.default = new MusicBusiness(new idGenerator_1.IdGenerator(), new MusicDatabase_1.MusicDatabase(), new tokenGenerator_1.TokenGenerator());
