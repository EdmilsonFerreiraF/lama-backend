import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export default class BaseDatabase {
  protected static uri: any =
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}.mongodb.net/${process.env.DB_NAME}`;

   protected static connection: any = 
       mongoose.createConnection(BaseDatabase.uri,
      { useNewUrlParser: true, useUnifiedTopology: true });
}; 