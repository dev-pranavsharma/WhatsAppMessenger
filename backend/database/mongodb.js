
import mongoose from "mongoose"
import { MongoClient } from "mongodb";

// Global variables
global.mongoClient = null;
global.mongooseConnection = null;

async function mongoDB() {
  try {
    // 1. Connect using Mongoose
    if (!global.mongooseConnection) {
      global.mongooseConnection = await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
         console.log("Connected DB:", mongoose.connection.name);
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
      console.log("✅ Mongoose connected");
    }

    // 2. Connect using Native MongoDB Driver
    if (!global.mongoClient) {
      global.mongoClient = new MongoClient(process.env.MONGODB_URL);
      await global.mongoClient.connect();
      console.log("✅ Native MongoDB client connected");
    }

    return {
      mongoose: global.mongooseConnection,
      mongodb: global.mongoClient.db("mydatabase"),
    };
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
    process.exit(1);
  }
}

export default mongoDB;
