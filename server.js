require('dotenv').config();

const { MongoClient } = require('mongodb');
const createServer = require('./app');
const client = new MongoClient(process.env.MONGO_URI || 'mongodb://localhost:27017');

async function start() {
  await client.connect();
  const db = client.db(process.env.DB_NAME || 'mydb');
  const app = createServer(db);
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`API running on port ${port}`));
}

start().catch(err => {
  console.error('Startup error:', err);
  process.exit(1);
});

