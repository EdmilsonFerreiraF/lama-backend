import { CustomError } from "../errors/CustomError";
import { User } from "../data/model/User";
import { UserDatabase } from "../data/UserDatabase";
import { HashGenerator } from "./services/hashGenerator";
import { IdGenerator } from "./services/idGenerator";
import { TokenGenerator } from "./services/tokenGenerator";

export class UserBusiness {
   constructor(
      private idGenerator: IdGenerator,
      private hashGenerator: HashGenerator,
      private userDatabase: UserDatabase,
      private tokenGenerator: TokenGenerator
   ){};

   public async signup(
      name: string,
      email: string,
      nickname: string,
      password: string
   ) {
      try {
         if (!name || !email || !nickname || !password) {
            throw new CustomError(422, "Missing input");
         };

         if (email.indexOf("@") === -1) {
            throw new CustomError(422, "All addresses must have an @");
         };

         if (password.length < 6) {
            throw new CustomError(422, "Invalid password");
         };

         const id = this.idGenerator.generate();

         const cypherPassword = await this.hashGenerator.hash(password);

         await this.userDatabase.createUser(
            new User(id, name, email, nickname, cypherPassword)
         );

         const accessToken = this.tokenGenerator.generate({
            id
         });

         return { accessToken };
      } catch (error) {
         if (error.message.includes("email")) {
            throw new CustomError(409, "Email already in use");
         };

         throw new CustomError(error.statusCode, error.message);
      };
   };

   public async login(emailOrNickname: string, password: string) {
      try {
         if (!emailOrNickname || !password) {
            throw new CustomError(422, "Missing input");
         };

         const user = await this.userDatabase.getUserByEmail(emailOrNickname);

         if (!user) {
            throw new CustomError(401, "Invalid credentials");
         };

         const isPasswordCorrect = await this.hashGenerator.compareHash(
            password,
            user.getPassword()
         );

         if (!isPasswordCorrect) {
            throw new CustomError(401, "Invalid credentials");
         };

         const accessToken = this.tokenGenerator.generate({
            id: user.getId()
         });

         return { accessToken };
      } catch (error) {
         throw new CustomError(error.statusCode, error.message);
      };
   };
};

export default new UserBusiness(new IdGenerator(), new HashGenerator(), new UserDatabase(), new TokenGenerator());