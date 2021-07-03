"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
class BaseDatabase {
}
exports.default = BaseDatabase;
BaseDatabase.uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}.mongodb.net/${process.env.DB_NAME}`;
BaseDatabase.connection = mongoose_1.default.createConnection(BaseDatabase.uri, { useNewUrlParser: true, useUnifiedTopology: true });
;
