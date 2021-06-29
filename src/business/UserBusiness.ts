import { HashGenerator } from "./services/hashGenerator";
import { IdGenerator } from "./services/idGenerator";
import { TokenGenerator } from "./services/tokenGenerator";

import { User } from "../data/model/User";
import { UserDatabase } from "../data/UserDatabase";

import { CustomError } from "../errors/CustomError";
import { LoginInputDTO, SignupInputDTO } from "./entities/user";

export class UserBusiness {
   constructor(
      private idGenerator: IdGenerator,
      private hashGenerator: HashGenerator,
      private userDatabase: UserDatabase,
      private tokenGenerator: TokenGenerator
   ){};

   public async createUser(
      input: SignupInputDTO
   ) {
      try {
         if (
            !input.name ||
            !input.email ||
            !input.nickname ||
            !input.password
         ) {
            throw new CustomError(422, "Missing input");
         };

         if (input.email.indexOf("@") === -1) {
            throw new CustomError(422, "Invalid email address");
         };

         if (input.password.length < 6) {
            throw new CustomError(422, "Password must be more or equal than 6 characters length");
         };

         const id = this.idGenerator.generate();

         const cypherPassword = await this.hashGenerator.hash(input.password);

         await this.userDatabase.createUser(
            new User(
               id,
               input.name,
               input.email,
               input.nickname,
               cypherPassword
            )
         );

         const token = this.tokenGenerator.generate({
            id,
            nickname: input.nickname
         });

         return { token };
      } catch (error) {
         throw new CustomError(error.statusCode, error.message);
      };
   };

   public async getUserByEmail(input: LoginInputDTO) {
      try {
         if (!input.email || !input.password) {
            throw new CustomError(422, "Missing input");
         };

         const user = await this.userDatabase.getUserByEmail(input);

         if (!user) {
            throw new CustomError(401, "Invalid credentials");
         };

         const isPasswordCorrect = await this.hashGenerator.compareHash(
            input.password,
            user.getPassword()
         );

         if (!isPasswordCorrect) {
            throw new CustomError(401, "Invalid credentials");
         };

         const token = this.tokenGenerator.generate({
            id: user.getId(),
            nickname: user.getNickname()
         });

         return { token };
      } catch (error) {
         throw new CustomError(error.statusCode, error.message);
      };
   };
};

export default new UserBusiness(new IdGenerator(), new HashGenerator(), new UserDatabase(), new TokenGenerator());