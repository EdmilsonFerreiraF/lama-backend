"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Music = void 0;
class Music {
    constructor(id, title, author, date, file, genre, album) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.date = date;
        this.file = file;
        this.genre = genre;
        this.album = album;
    }
    ;
    getId() {
        return this.id;
    }
    ;
    getTitle() {
        return this.title;
    }
    ;
    getAuthor() {
        return this.author;
    }
    ;
    getFile() {
        return this.file;
    }
    ;
    getDate() {
        return this.date;
    }
    ;
    getGenre() {
        return this.genre;
    }
    ;
    getAlbum() {
        return this.album;
    }
    ;
}
exports.Music = Music;
;
