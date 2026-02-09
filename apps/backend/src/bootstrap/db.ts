import { config } from "@/shared/infra/config";
import mongoose from "mongoose";

export const makeMongoDBConnection = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbConnectURL);
    console.log("MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error(error);
  }
};
