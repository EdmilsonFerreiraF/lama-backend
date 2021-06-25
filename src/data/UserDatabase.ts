import mongoose from "mongoose";
import { LoginInputDTO } from "../business/entities/user";
const { Schema } = mongoose;

import BaseDatabase from "./BaseDatabase";
import { User } from "./model/User";

export class UserDatabase extends BaseDatabase {
   protected tableName: string = "User";

   protected blogSchema = new Schema({
      id: String,
      name: String,
      email: String,
      nickname: String,
      password: String
   });

   private toModel(dbModel?: any): User {
      return (
         dbModel &&
         new User(
            dbModel.id,
            dbModel.name,
            dbModel.email,
            dbModel.nickname,
            dbModel.password
         )
      );
   };

   public async createUser(input: User): Promise<void> {
      try {
            const userDocument = {
               id: input.getId(),
               name: input.getName(),
               email: input.getEmail(),
               nickname: input.getNickname(),
               password: input.getPassword(),
            };

            const conn = await BaseDatabase.connection;
            const UserModel = conn.model('users2', this.blogSchema);
            const NewUser = new UserModel(userDocument);

            NewUser.save();
      } catch (error) {
         throw new Error(error.sqlMessage || error.message);
      };
   };
   
   public async getUserByEmailOrNick(input: LoginInputDTO): Promise<User> {
      try {
         const conn = await BaseDatabase.connection;
         const UserModel = conn.model('users2', this.blogSchema);
         const user = await UserModel.where({email: input.email}).findOne({}).exec();

         return this.toModel(user);
      } catch (error) {
         throw new Error(error.sqlMessage || error.message);
      };
   };

   public async getUserById(id: string): Promise<User> {
      try {
         const conn = await BaseDatabase.connection;
         const UserModel = conn.model('users2', this.blogSchema);
         const user = await UserModel.findOne({id: id}).exec();

         return this.toModel(user);
      } catch (error) {
         throw new Error(error.sqlMessage || error.message);
      };
   };

   public async getAllUsers(): Promise<User[]> {
      try {
         const conn = await BaseDatabase.connection;
         const UserModel = conn.model('users2', this.blogSchema);
         const allUsers = await UserModel.find({}).exec();

         return allUsers.map((user: User) => {
            return this.toModel(user);
         });
      } catch (error) {
         throw new Error(error.sqlMessage || error.message);
      };
   };
};

export default new UserDatabase();