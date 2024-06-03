const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const HOST = process.env.MYSQL_HOST;
const USER = process.env.MYSQL_USER;
const DATABASE = process.env.MYSQL_DATABASE;
const PASSWORD = process.env.MYSQL_ROOT_PASSWORD;

const connection = mysql.createConnection({
  host: HOST,
  user: USER,
  database: DATABASE,
  password: PASSWORD,
});

connection.connect((err) => {
  if (err) {
    console.error(
      "Error with the connection of the database small bytes." + err
    );
    return;
  }
  console.log("You are conected to the database small bytes.");
});
module.exports = { connection };
