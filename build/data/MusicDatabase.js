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
exports.MusicDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const BaseDatabase_1 = __importDefault(require("./BaseDatabase"));
const Music_1 = require("./model/Music");
const { Schema } = mongoose_1.default;
class MusicDatabase extends BaseDatabase_1.default {
    constructor() {
        super(...arguments);
        this.blogSchema = new Schema({
            id: String,
            title: String,
            author: String,
            date: Date,
            file: {},
            genre: [],
            album: String
        });
    }
    toModel(dbModel) {
        return (dbModel &&
            new Music_1.Music(dbModel.id, dbModel.title, dbModel.author, dbModel.date, dbModel.file, dbModel.genre, dbModel.album));
    }
    ;
    createMusic(music) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const musicDocument = {
                    id: music.getId(),
                    title: music.getTitle(),
                    author: music.getAuthor(),
                    date: music.getDate(),
                    file: music.getFile(),
                    genre: music.getGenre(),
                    album: music.getAlbum()
                };
                const conn = yield BaseDatabase_1.default.connection;
                const MusicModel = conn.model('musics2', this.blogSchema);
                const NewMusic = new MusicModel(musicDocument);
                NewMusic.save();
            }
            catch (error) {
                throw new Error(error.statusCode || error.message);
            }
        });
    }
    ;
    getAllMusics(nickname) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield BaseDatabase_1.default.connection;
                const MusicModel = conn.model('musics2', this.blogSchema);
                const music = yield MusicModel.find({ "author": nickname }, 'id title author').exec();
                return music.map((music) => this.toModel(music));
            }
            catch (error) {
                throw new Error(error.statusCode || error.message);
            }
            ;
        });
    }
    ;
    getMusicById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield BaseDatabase_1.default.connection;
                const MusicModel = conn.model('musics2', this.blogSchema);
                const music = yield MusicModel.findOne({ id }, 'file').exec();
                return this.toModel(music);
            }
            catch (error) {
                throw new Error(error.statusCode || error.message);
            }
            ;
        });
    }
    ;
    getMusicDetailsById(id, nickname) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield BaseDatabase_1.default.connection;
                const MusicModel = conn.model('musics2', this.blogSchema);
                const music = yield MusicModel.findOne({ "author": nickname, id }, 'id title author date genre album').exec();
                return this.toModel(music);
            }
            catch (error) {
                throw new Error(error.statusCode || error.message);
            }
            ;
        });
    }
    ;
    getMusicByName(title, nickname) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield BaseDatabase_1.default.connection;
                const MusicModel = conn.model('musics2', this.blogSchema);
                const music = yield MusicModel.find({ "author": nickname, "title": title }, 'id title author').exec();
                return music.map((music) => this.toModel(music));
            }
            catch (error) {
                throw new Error(error.statusCode || error.message);
            }
            ;
        });
    }
    ;
    deleteMusicById(id, nickname) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield BaseDatabase_1.default.connection;
                const MusicModel = conn.model('musics2', this.blogSchema);
                yield MusicModel.deleteOne({ "author": nickname, id });
            }
            catch (error) {
                throw new Error(error.statusCode || error.message);
            }
            ;
        });
    }
    ;
}
exports.MusicDatabase = MusicDatabase;
;
exports.default = new MusicDatabase();
