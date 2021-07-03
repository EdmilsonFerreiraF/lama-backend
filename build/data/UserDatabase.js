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
exports.UserDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const BaseDatabase_1 = __importDefault(require("./BaseDatabase"));
const User_1 = require("./model/User");
class UserDatabase extends BaseDatabase_1.default {
    constructor() {
        super(...arguments);
        this.tableName = "User";
        this.blogSchema = new Schema({
            id: String,
            name: String,
            email: {
                type: String,
                unique: true
            },
            nickname: String,
            password: String
        });
    }
    toModel(dbModel) {
        return (dbModel &&
            new User_1.User(dbModel.id, dbModel.name, dbModel.email, dbModel.nickname, dbModel.password));
    }
    ;
    createUser(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDocument = {
                    id: input.getId(),
                    name: input.getName(),
                    email: input.getEmail(),
                    nickname: input.getNickname(),
                    password: input.getPassword(),
                };
                const conn = yield BaseDatabase_1.default.connection;
                const UserModel = conn.model('users2', this.blogSchema);
                const NewUser = new UserModel(userDocument);
                NewUser.save();
            }
            catch (error) {
                throw new Error(error.statusCode);
            }
            ;
        });
    }
    ;
    getUserByEmail(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield BaseDatabase_1.default.connection;
                const UserModel = conn.model('users2', this.blogSchema);
                const user = yield UserModel.where({ email: input.email }).findOne({}).exec();
                return this.toModel(user);
            }
            catch (error) {
                throw new Error(error.statusCode);
            }
            ;
        });
    }
    ;
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield BaseDatabase_1.default.connection;
                const UserModel = conn.model('users2', this.blogSchema);
                const user = yield UserModel.findOne({ id: id }).exec();
                return this.toModel(user);
            }
            catch (error) {
                throw new Error(error.statusCode);
            }
            ;
        });
    }
    ;
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield BaseDatabase_1.default.connection;
                const UserModel = conn.model('users2', this.blogSchema);
                const allUsers = yield UserModel.find({}).exec();
                return allUsers.map((user) => {
                    return this.toModel(user);
                });
            }
            catch (error) {
                throw new Error(error.statusCode);
            }
            ;
        });
    }
    ;
}
exports.UserDatabase = UserDatabase;
;
exports.default = new UserDatabase();
