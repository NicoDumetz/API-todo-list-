require('dotenv').config();
var bcrypt = require('bcryptjs');
const connection = require('./config/db');
const mysql = require('mysql2');
const express = require('express');
const auth = require('./routes/auth/auth');
const user = require('./routes/user/user');


const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.raw());
app.use(express.urlencoded({extended:true}));

auth.register(app, bcrypt);
auth.login(app, bcrypt);
user.user(app);

app.listen(PORT, () => {
    console.log(`Serveur open on the port: ${PORT}`);
});