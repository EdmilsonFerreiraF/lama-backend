import BaseDatabase from "./BaseDatabase";
import { User } from "./model/User";

export class UserDatabase extends BaseDatabase {
   protected tableName: string = "User";

   private toModel(dbModel?: any): User | undefined {
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

   public async createUser(user: User): Promise<void> {
      try {
         await BaseDatabase.connection.raw(`
            INSERT INTO ${this.tableName} (id, name, email, nickname, password)
            VALUES (
            '${user.getId()}', 
            '${user.getName()}', 
            '${user.getEmail()}',
            '${user.getNickname()}',
            '${user.getPassword()}'
            )`
         );
      } catch (error) {
         throw new Error(error.sqlMessage || error.message);
      };
   };

   public async getUserByEmail(emailOrNickname: string): Promise<User | undefined> {
      try {
         const result = await BaseDatabase.connection.raw(`
            SELECT * from ${this.tableName} WHERE ${emailOrNickname.includes("@") ? "email" : "nickname"} = '${emailOrNickname}'
         `);
         return this.toModel(result[0][0]);
      } catch (error) {
         throw new Error(error.sqlMessage || error.message);
      };
   };

   public async getUserById(id: string): Promise<User | undefined> {
      try {
         const result = await BaseDatabase.connection.raw(`
            SELECT * from ${this.tableName} WHERE id = '${id}'
         `);
         return this.toModel(result[0][0]);
      } catch (error) {
         throw new Error(error.sqlMessage || error.message);
      };
   };

   public async getAllUsers(): Promise<User[]> {
      try {
         const result = await BaseDatabase.connection.raw(`
            SELECT * from ${this.tableName}
         `);
         return result[0].map((res: any) => {
            return this.toModel(res);
         });
      } catch (error) {
         throw new Error(error.sqlMessage || error.message);
      };
   };
};

export default new UserDatabase();