require('dotenv').config();
const connection = require('./config/db');
const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT;
const HOST = process.env.MYSQL_HOST;
const USER = process.env.MYSQL_USER;
const PASSWORD = process.env.MYSQL_ROOT_PASSWORD;
const DATABASE = process.env.MYSQL_DATABASE;

app.listen(PORT, () => {
    console.log(`Serveur open on the port: ${PORT}`);
});
