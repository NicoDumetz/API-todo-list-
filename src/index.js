require('dotenv').config();
const connection = require('./config/db');
const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());
app.use(express.raw());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT;
require('./routes/auth/auth')(app);

app.listen(PORT, () => {
    console.log(`Serveur open on the port: ${PORT}`);
});