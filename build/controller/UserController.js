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
exports.UserController = void 0;
const idGenerator_1 = require("../business/services/idGenerator");
const hashGenerator_1 = require("../business/services/hashGenerator");
const tokenGenerator_1 = require("../business/services/tokenGenerator");
const UserBusiness_1 = require("../business/UserBusiness");
const UserDatabase_1 = require("../data/UserDatabase");
const userBusiness = new UserBusiness_1.UserBusiness(new idGenerator_1.IdGenerator(), new hashGenerator_1.HashGenerator(), new UserDatabase_1.UserDatabase(), new tokenGenerator_1.TokenGenerator());
class UserController {
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, nickname, password } = req.body;
                const input = {
                    name,
                    email,
                    nickname,
                    password
                };
                const result = yield userBusiness.createUser(input);
                res.status(200).send(result);
            }
            catch (error) {
                const { statusCode, message } = error;
                res.status(statusCode || 400).send({ message });
            }
            ;
        });
    }
    ;
    getUserByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const input = {
                    email,
                    password
                };
                const result = yield userBusiness.getUserByEmail(input);
                res.status(200).send(result);
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
exports.UserController = UserController;
;
exports.default = new UserController();
