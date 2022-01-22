const { Pool, Client } = require("pg");
require("dotenv").config();

const db = {
  user: process.env.DATABASE,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.SERVER_PORT,
};

const pool = new Pool(db);
const client = new Client(db);

try {
  console.log("db connected");
  client.connect();
} catch (error) {
  console.log(error);
}

// getTest = (req, res) => {
//   pool.query("SELECT * FROM TESTTABLE", (error, result) => {
//     if (error) {
//     }
//     res.send(result.rows);
//   });
// };

module.exports = pool;
