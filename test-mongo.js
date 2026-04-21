const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://Inoscence_db_user:7YF213u1xSK8Jb7a@cluster0.u1czg6n.mongodb.net/ecoscience?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function run() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db('ecoscience');
    const users = await db.collection('User').find({}).toArray();
    console.log(`Found ${users.length} users in the database.`);
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
