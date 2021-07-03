"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, name, email, nickname, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.nickname = nickname;
        this.password = password;
    }
    ;
    getId() {
        return this.id;
    }
    ;
    getName() {
        return this.name;
    }
    ;
    getEmail() {
        return this.email;
    }
    ;
    getNickname() {
        return this.nickname;
    }
    ;
    getPassword() {
        return this.password;
    }
    ;
}
exports.User = User;
;
