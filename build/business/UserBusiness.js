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
exports.UserBusiness = void 0;
const hashGenerator_1 = require("./services/hashGenerator");
const idGenerator_1 = require("./services/idGenerator");
const tokenGenerator_1 = require("./services/tokenGenerator");
const User_1 = require("../data/model/User");
const UserDatabase_1 = require("../data/UserDatabase");
const CustomError_1 = require("../errors/CustomError");
class UserBusiness {
    constructor(idGenerator, hashGenerator, userDatabase, tokenGenerator) {
        this.idGenerator = idGenerator;
        this.hashGenerator = hashGenerator;
        this.userDatabase = userDatabase;
        this.tokenGenerator = tokenGenerator;
    }
    ;
    createUser(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!input.name ||
                    !input.email ||
                    !input.nickname ||
                    !input.password) {
                    throw new CustomError_1.CustomError(422, "Missing input");
                }
                ;
                if (input.email.indexOf("@") === -1) {
                    throw new CustomError_1.CustomError(422, "Invalid email address");
                }
                ;
                if (input.password.length < 6) {
                    throw new CustomError_1.CustomError(422, "Password must be more or equal than 6 characters length");
                }
                ;
                const id = this.idGenerator.generate();
                const cypherPassword = yield this.hashGenerator.hash(input.password);
                yield this.userDatabase.createUser(new User_1.User(id, input.name, input.email, input.nickname, cypherPassword));
                const token = this.tokenGenerator.generate({
                    id,
                    nickname: input.nickname
                });
                return { token };
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
            ;
        });
    }
    ;
    getUserByEmail(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!input.email || !input.password) {
                    throw new CustomError_1.CustomError(422, "Missing input");
                }
                ;
                const user = yield this.userDatabase.getUserByEmail(input);
                if (!user) {
                    throw new CustomError_1.CustomError(401, "Invalid credentials");
                }
                ;
                const isPasswordCorrect = yield this.hashGenerator.compareHash(input.password, user.getPassword());
                if (!isPasswordCorrect) {
                    throw new CustomError_1.CustomError(401, "Invalid credentials");
                }
                ;
                const token = this.tokenGenerator.generate({
                    id: user.getId(),
                    nickname: user.getNickname()
                });
                return { token };
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
            ;
        });
    }
    ;
}
exports.UserBusiness = UserBusiness;
;
exports.default = new UserBusiness(new idGenerator_1.IdGenerator(), new hashGenerator_1.HashGenerator(), new UserDatabase_1.UserDatabase(), new tokenGenerator_1.TokenGenerator());
