import { Request, Response } from "express";

import { IdGenerator } from "../business/services/idGenerator";
import { TokenGenerator } from "../business/services/tokenGenerator";

import { MusicBusiness } from "../business/MusicBusiness";
import { MusicDatabase } from "../data/MusicDatabase";
import { CreateMusicInputDTO } from "../business/entities/music";

const musicBusiness =
 new MusicBusiness(new IdGenerator(),
                  new MusicDatabase(),
                  new TokenGenerator()
                  );

export class MusicController {
    public async createMusic(req: Request, res: Response) {
       try {
         const { title, author, date, genre, album } = req.body;
         
         const file = req.file as File | undefined;
         const token = req.headers.authorization as string;

         const input: CreateMusicInputDTO = {
            title,
            author,
            date,
            file,
            genre,
            album
         }

         await musicBusiness.createMusic(
            input,
            token
         );
         
         res.status(201).send("Music created successfully");
      } catch (error) {
         const { statusCode, message } = error;
         res.status(statusCode || 400).send({ message });
      };
   };

   public async getAllMusics(req: Request, res: Response) {
      try {
         const token = req.headers.authorization as string;

         const result: any = await musicBusiness.getAllMusics(
            token
         );

         res.send(result)
      } catch (error) {
         const { statusCode, message } = error;
         res.status(statusCode || 400).send({ message });
      };
   }
   
   public async getMusicById(req: Request, res: Response) {
      try {
         const { id } = req.params;

         const result: any = await musicBusiness.getMusicById(
            id
         );

         res.send(result.file.buffer)
      } catch (error) {
         const { statusCode, message } = error;
         res.status(statusCode || 400).send({ message });
      };
   };
      
   public async getMusicDetailsById(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const token = req.headers.authorization as string;

         const result: any = await musicBusiness.getMusicDetailsById(
            id,
            token
         );

         res.send(result)
      } catch (error) {
         const { statusCode, message } = error;
         res.status(statusCode || 400).send({ message });
      };
   };
   
   public async getMusicByName(req: Request, res: Response) {
      try {
         const { title } = req.params;
         const token = req.headers.authorization as string;

         const result: any = await musicBusiness.getMusicByName(
            title,
            token
         );

         res.send(result)
      } catch (error) {
         const { statusCode, message } = error;
         res.status(statusCode || 400).send({ message });
      };
   };
   
   public async deleteMusicById(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const token: string = req.headers.authorization as string;

         const result: any = await musicBusiness.deleteMusicById(
            id,
            token
         );

         res.send(result)
      } catch (error) {
         const { statusCode, message } = error;
         res.status(statusCode || 400).send({ message });
      };
   };
};

export default new MusicController();