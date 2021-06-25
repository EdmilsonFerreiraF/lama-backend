import { IdGenerator } from "./services/idGenerator";
import { TokenGenerator } from "./services/tokenGenerator";

import { CustomError } from "../errors/CustomError";
import { MusicDatabase } from "../data/MusicDatabase";
import { Music } from "../data/model/Music";

import dayjs from 'dayjs';

export class MusicBusiness {
   constructor(
      private idGenerator: IdGenerator,
      private musicDatabase: MusicDatabase,
      private tokenGenerator: TokenGenerator
   ){};

   public async createMusic(
      music: any,
      token: string,
   ) {
      try {
         if (  !music.title ||
               !music.date ||
               !music.file ||
               !music.genre ||
               !music.album)
            {
            throw new CustomError(422, "Missing input");
         };
         
         if (!token) {
            throw new CustomError(422, "Missing token");
         };
         
         const id = this.idGenerator.generate();

         const isTokenValid = this.tokenGenerator.verify(token);
      
         if (!isTokenValid) {
            throw new CustomError(409, "Invalid token");
         }
         
         music = { 
            id,
            title: music.title,
            author: isTokenValid.nickname,
            date: music.date,
            file: music.file,
            genre: music.genre,
            album: music.album
          };

         if (!dayjs(music.date).isValid()) {
            throw new CustomError(409, "Invalid date");
         }

         await this.musicDatabase.createMusic(
            new Music(
               music.id,
               music.title,
               music.author,
               music.date,
               music.file,
               music.genre,
               music.album
            )
         );

      } catch (error) {
         if (error.message.includes("music")) {
            throw new CustomError(409, "Music already exists");
         };

         throw new CustomError(error.statusCode, error.message);
      };
   };

   public async getAllMusics(
      token: string
   ) {
      try {
         if (!token) {
            throw new CustomError(422, "Missing token");
         };
         
         const isTokenValid = this.tokenGenerator.verify(token);
         
         if (!isTokenValid) {
            throw new CustomError(409, "Invalid token");
         }
         
         const result: any = await this.musicDatabase.getAllMusics(isTokenValid.nickname);

         return result;
      } catch (error) {
         if (error.message.includes("jwt expired")) {
            throw new CustomError(401, error.message);
         }
         throw new CustomError(error.statusCode, error.message);
      };
   };

   public async getMusicById(
      id: string
   ) {
      try {
         if (!id) {
            throw new CustomError(422, "Missing input");
         };
         
         const result: any = await this.musicDatabase.getMusicById(id);
        
         return result
      } catch (error) {
         throw new CustomError(error.statusCode, error.message);
      };
   };
   
   public async getMusicDetailsById(
      id: string,
      token: string
   ) {
      try {
         if (!id) {
            throw new CustomError(422, "Missing input");
         };
         
         if (!token) {
            throw new CustomError(422, "Missing token");
         };
         
         const isTokenValid = this.tokenGenerator.verify(token);
         
         if (!isTokenValid) {
            throw new CustomError(409, "Invalid token");
         }
         
         const result: any = await this.musicDatabase.getMusicDetailsById(id, isTokenValid.nickname);

         result.date = dayjs(result.date).format('DD/MM/YYYY')

         return result;
      } catch (error) {
         throw new CustomError(error.statusCode, error.message);
      };
   };

   public async getMusicByName(
      input: any,
      token: string
   ) {
      try {
         if (!input.title) {
            throw new CustomError(422, "Missing input");
         };
                 
         const isTokenValid = await this.tokenGenerator.verify(token);
         
         if (!isTokenValid) {
            throw new CustomError(409, "Invalid token");
         }
     
         const result: any = await this.musicDatabase.getMusicByName(input, isTokenValid.nickname);

         return result
      } catch (error) {
         throw new CustomError(error.statusCode, error.message);
      };
   };
   
   public async deleteMusicById(
      input: any,
      token: string
   ) {
      try {
         if (!input.id) {
            throw new CustomError(422, "Missing input");
         };
                          
         const isTokenValid = await this.tokenGenerator.verify(token);
         
         if (!isTokenValid) {
            throw new CustomError(409, "Invalid token");
         }

         await this.musicDatabase.deleteMusicById(input.id, isTokenValid.nickname);
      } catch (error) {
         throw new CustomError(error.statusCode, error.message);
      };
   };
};

export default new MusicBusiness(new IdGenerator(), new MusicDatabase(), new TokenGenerator());