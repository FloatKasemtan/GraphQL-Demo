const { Pool, Client } = require("pg");
require("dotenv").config();

const db = {
  user: process.env.DATABASE,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.SERVER_PORT,
};

const client = new Client(db);

try {
  console.log("Database connection is available!");
  client.connect();
} catch (error) {
  console.log(error);
}

module.exports = client;
