import { Request, Response } from "express";
import { MusicBusiness } from "../business/MusicBusiness";
import { IdGenerator } from "../business/services/idGenerator";
import { HashGenerator } from "../business/services/hashGenerator";
import { MusicDatabase } from "../data/MusicDatabase";
import { TokenGenerator } from "../business/services/tokenGenerator";
var multer = require('multer')
import fs from 'fs';
const getStat = require('util').promisify(fs.stat);

const musicBusiness =
 new MusicBusiness(new IdGenerator(),
                  new HashGenerator(),
                  new MusicDatabase(),
                  new TokenGenerator()
                  );

export class MusicController {
   public async createMusic(req: Request, res: Response) {
      try {
         const { title, author, date, genre, album } = req.body;
         const file = req.file
         const token = req.headers.authorization;

         const music = {
            title,
            author,
            date,
            file,
            genre,
            album
         }

         var storage = multer.diskStorage({
               destination: function (req: Request, file: any, cb: any) {
               cb(null, 'uploads')
            },
            filename: function (req: Request, file: any, cb: any) {
               cb(null, Date.now() + '-' + file.originalname )
            }
         })

         var upload = multer({ storage: storage })

         const result = await musicBusiness.createMusic(
            music,
            token
         );

         return res.status(200).send(music.file);
      } catch (error) {
         const { statusCode, message } = error;

         res.status(statusCode || 400).send({ message });
      };
   };

   public async getAllMusics(req: Request, res: Response) {
      try {
         const token = req.headers.authorization;

         console.log("token - controller", token)
         
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
         const token = req.headers.authorization;

         console.log("token - controller", token)
         
         const result: any = await musicBusiness.getMusicById(
            id,
            token
         );

         res.send(result)
      } catch (error) {
         const { statusCode, message } = error;
         res.status(statusCode || 400).send({ message });
      };
   };
   
   public async getMusicDetailsById(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const token = req.headers.authorization;

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
};

export default new MusicController();