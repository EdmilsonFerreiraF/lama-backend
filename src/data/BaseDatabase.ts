import dotenv from "dotenv";
import mongoose from "mongoose";
const { MongoClient } = require("mongodb");

dotenv.config();

export default class BaseDatabase {
   protected static connection: any = 
       mongoose.createConnection(`mongodb+srv://Edmilson:Z6cTrRWMQsECiHGc@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}`,
      { useNewUrlParser: true, useUnifiedTopology: true });

  protected static uri: any =
  `mongodb+srv://Edmilson:Z6cTrRWMQsECiHGc@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}`;

  protected static client: any = new MongoClient(BaseDatabase.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}; 