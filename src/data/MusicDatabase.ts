
import mongoose from "mongoose";

import BaseDatabase from "./BaseDatabase";
import { Music } from "./model/Music";

const { Schema } = mongoose;

export class MusicDatabase extends BaseDatabase {
   protected blogSchema = new Schema({
      id: String,
      title: String,
      author: String,
      date: Date,
      file: {
         fieldname: String,
         originalname: String,
         encoding: String,
         mimetype: String,
         buffer: Buffer,
         size: Number,
     },
      genre: [],
      album: String
   });

   private toModel(dbModel?: any): Music {
      return (
         dbModel &&
         new Music(
            dbModel.id,
            dbModel.title,
            dbModel.author,
            dbModel.date,
            dbModel.file,
            dbModel.genre,
            dbModel.album
         )
      );
   };

   public async createMusic(music: Music): Promise<void> {
      try {
         const musicDocument = {
            id: music.getId(),
            title: music.getTitle(),
            author: music.getAuthor(),
            date: music.getDate(),
            file: music.getFile(),
            genre: music.getGenre(),
            album: music.getAlbum()
         };
               
         const conn = await BaseDatabase.connection;
         const MusicModel = conn.model('musics2', this.blogSchema);
         const NewMusic = new MusicModel(musicDocument);

         NewMusic.save();
      } catch(error) {
         throw new Error(error.statusCode || error.message);
      }
   };
   
   public async getAllMusics(nickname: string): Promise<Music[]> {
      try {
         const conn = await BaseDatabase.connection;
         const MusicModel = conn.model('musics2', this.blogSchema);
         const music = await MusicModel.find({"author": nickname}, 'id title author').exec();
         
         return music.map((music: Music) => this.toModel(music));
      } catch (error) {
         throw new Error(error.statusCode || error.message);
      };
   };

   public async getMusicById(id: string): Promise<Music> {
      try {
         const conn = await BaseDatabase.connection;
         const MusicModel = conn.model('musics2', this.blogSchema);
         const music = await MusicModel.findOne({ id }, 'file').exec();

         return this.toModel(music);
      } catch (error) {
         throw new Error(error.statusCode || error.message);
      };
   };
   
   public async getMusicDetailsById(id: string, nickname: string): Promise<Music> {
      try {
         const conn = await BaseDatabase.connection;
         const MusicModel = conn.model('musics2', this.blogSchema);
         const music = await MusicModel.findOne({"author": nickname, id}, 'id title author date genre album').exec();

         return this.toModel(music);
      } catch (error) {
         throw new Error(error.statusCode || error.message);
      };
   };

   public async getMusicByName(input: any, nickname: string): Promise<any> {
      try {
         const conn = await BaseDatabase.connection;
         const MusicModel = conn.model('musics2', this.blogSchema);
         const music = await MusicModel.find({"author": nickname, "title": input.title}, 'id title author').exec();

         return music.map((music: Music) => this.toModel(music));
      } catch (error) {
         throw new Error(error.statusCode || error.message);
      };
   };

   public async deleteMusicById(id: string, nickname: string): Promise<void> {
      try {
         const conn = await BaseDatabase.connection;
         const MusicModel = conn.model('musics2', this.blogSchema);
         await MusicModel.deleteOne({"author": nickname, id});
      } catch (error) {
         throw new Error(error.statusCode || error.message);
      };
   };
};

export default new MusicDatabase();