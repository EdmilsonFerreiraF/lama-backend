import { CustomError } from "../errors/CustomError";
import { Music } from "../data/model/Music";
import { MusicDatabase } from "../data/MusicDatabase";
import { HashGenerator } from "./services/hashGenerator";
import { IdGenerator } from "./services/idGenerator";
import { TokenGenerator } from "./services/tokenGenerator";
import dayjs from 'dayjs';
// import { Music } from "./entities/music";
import fs from 'fs';

export class MusicBusiness {
   constructor(
      private idGenerator: IdGenerator,
      private hashGenerator: HashGenerator,
      private musicDatabase: MusicDatabase,
      private tokenGenerator: TokenGenerator
   ){};

   public async createMusic(
      music: any,
      token: string | undefined
   ) {
      try {
         if (  !music.title ||
               !music.author ||
               !music.date ||
               !music.file ||
               !music.genre ||
               !music.album)
            {
            throw new CustomError(422, "Missing input");
         };

         if (!music.file) {
            throw new CustomError(422, "Please upload a file")
        }
         
         if (!token) {
            throw new CustomError(422, "Missing token");
         };
         
         const id = await this.idGenerator.generate();

         music = { 
            id,
            title: music.title,
            author: music.author,
            date: music.date,
            file: music.file,
            genre: music.genre,
            album: music.album
          };

         console.log(music);
         const accessToken = await this.tokenGenerator.verify(token);
         
         if (!accessToken) {
            throw new CustomError(409, "Invalid token");
         }

         if (!dayjs(music.date).isValid()) {
            throw new CustomError(409, "Invalid date");
         }

         console.log("file - MusicBusiness", music.file)

         var musicFile = fs.readFileSync(music.file.path);
         var encodeMusic = musicFile.toString('base64');
         // Define a JSONobject for the image attributes for saving to database
          
         var finalMusicFile = Buffer.from(encodeMusic, 'base64')
         // var finalMusicFile = {
         //      contentType: music.file.mimetype,
         //      image: Buffer.from(encodeMusic, 'base64')
         // };
         console.log("finalMusicFile", finalMusicFile)
         
         await this.musicDatabase.createMusic(
            new Music(
               music.id,
               music.title,
               music.author,
               music.date,
               finalMusicFile,
               music.genre,
               music.album
            )
         );
      } catch (error) {
         if (error.message.includes("music")) {
            throw new CustomError(409, "Music already exists");
         };

         console.log(
            "music.id", music.id,
               "music.title", music.title,
               "music.author", music.author,
               "music.date", music.date,
               "music.file", music.file,
               "music.genre", music.genre,
               "music.album", music.album
               )
               console.log(error.message || error.sqlMessage)
         throw new CustomError(error.statusCode, error.message);
      };
   };

   public async getAllMusics(
      token: string | undefined
   ) {
      try {
         if (!token) {
            console.log("token", token)
            throw new CustomError(422, "Missing token");
         };
         
         const accessToken = await this.tokenGenerator.verify(token);
         
         if (!accessToken) {
            throw new CustomError(409, "Invalid token");
         }
         
         const result: any = await this.musicDatabase.getAllMusics(accessToken.id);

         console.log("token", token)

         return result;
      } catch (error) {
         throw new CustomError(error.statusCode, error.message);
      };
   };

   public async getMusicById(
      id: string,
      token: string | undefined
   ) {
      try {
         if (!id) {
            console.log("id", id)
            throw new CustomError(422, "Missing input");
         };
         
         // if (!token) {
         //    console.log("token", token)
         //    throw new CustomError(422, "Missing token");
         // };
         
         // const accessToken = await this.tokenGenerator.verify(token);
         
         // if (!accessToken) {
         //    throw new CustomError(409, "Invalid token");
         // }
         
         const result: any = await this.musicDatabase.getMusicById(id);

         console.log("token", token)

         return result.file;
      } catch (error) {
         if (error.message.includes("music")) {
            throw new CustomError(409, "Music already exists");
         };
         console.log(error)
         throw new CustomError(error.statusCode, error.message);
      };
   };

   public async getMusicDetailsById(
      id: string,
      token: string | undefined
   ) {
      try {
         if (!id) {
            console.log("id", id)
            throw new CustomError(422, "Missing input");
         };
         
         if (!token) {
            console.log("token", token)
            throw new CustomError(422, "Missing token");
         };
         
         const accessToken = await this.tokenGenerator.verify(token);
         
         if (!accessToken) {
            throw new CustomError(409, "Invalid token");
         }
         
         const result: any = await this.musicDatabase.getMusicDetailsById(id);

         console.log("token", token)

         return result;
      } catch (error) {
         if (error.message.includes("music")) {
            throw new CustomError(409, "Music already exists");
         };
         console.log(error)
         throw new CustomError(error.statusCode, error.message);
      };
   };
};

export default new MusicBusiness(new IdGenerator(), new HashGenerator(), new MusicDatabase(), new TokenGenerator());