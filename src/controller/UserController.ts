import { Request, Response } from "express";

import { IdGenerator } from "../business/services/idGenerator";
import { HashGenerator } from "../business/services/hashGenerator";
import { TokenGenerator } from "../business/services/tokenGenerator";

import { UserBusiness } from "../business/UserBusiness";
import { UserDatabase } from "../data/UserDatabase";

import { LoginInputDTO, SignupInputDTO } from "../business/entities/user";

const userBusiness =
 new UserBusiness(new IdGenerator(),
                  new HashGenerator(),
                  new UserDatabase(),
                  new TokenGenerator()
                  );

export class UserController {
   public async signup(req: Request, res: Response) {
      try {
         const { name, email, nickname, password } = req.body;

         const input: SignupInputDTO = {
            name,
            email,
            nickname,
            password
         }

         const result = await userBusiness.signup(
            input
         );

         res.status(200).send(result);
      } catch (error) {
         const { statusCode, message } = error;
         res.status(statusCode || 400).send({ message });
      };
   };

   public async login(req: Request, res: Response) {
      try {
         const { email, password } = req.body;

         const input: LoginInputDTO = {
            email,
            password
         }

         const result = await userBusiness.login(input);

         res.status(200).send(result);
      } catch (error) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message });
      };
   };
};

export default new UserController();