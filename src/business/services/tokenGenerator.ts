import dotenv from "dotenv";
import * as jwt from "jsonwebtoken";

dotenv.config();

export class TokenGenerator {
  private static expiresIn: number = Number(process.env.ACCESS_TOKEN_EXPIRES_IN);

  public generate = (input: AuthenticationData): string => {
    const newToken = jwt.sign(
      {
        id: input.id,
        nickname: input.nickname
      },
      process.env.JWT_KEY as string,
      {
        expiresIn: TokenGenerator.expiresIn,
      }
    );
    
    return newToken;
  };

  public verify(token: string) {
    const payload = jwt.verify(token, process.env.JWT_KEY as string) as any;
    const result = { id: payload.id, nickname: payload.nickname };

    return result;
  };
};

export interface AuthenticationData {
  id: string,
  nickname: string
};

export default new TokenGenerator();