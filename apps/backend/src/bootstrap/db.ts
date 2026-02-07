import mongoose from "mongoose";

export const makeMongoDBConnection = async () => {
  try {
    // TODO: add env variables (bun)
    const conn = await mongoose.connect(
      "mongodb://syntaxlab:syntaxlab@127.0.0.1:27017/syntaxlab_db?authSource=admin&directConnection=true"
    );
    console.log("MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error(error);
  }
};
