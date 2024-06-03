const mysql = require('mysql2');
const HOST = process.env.MYSQL_HOST;
const USER = process.env.MYSQL_USER;
const PASSWORD = process.env.MYSQL_ROOT_PASSWORD;
const DATABASE = process.env.MYSQL_DATABASE;


const connection = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE
});

connection.connect((err) => {
    if (err) {
        console.error('Error with the connection of the database small bytes.');
        return;
    }
    console.log('You are conected to the database small bytes.');
});
module.exports = connection;