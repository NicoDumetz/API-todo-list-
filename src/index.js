require("dotenv").config();
let bcrypt = require("bcryptjs");
const { connection: db } = require("./config/db");
const mysql = require("mysql2");
const express = require("express");
const auth = require("./routes/auth/auth");
const user = require("./routes/user/user");
const todos = require("./routes/todos/todos");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.raw());
app.use(express.urlencoded({ extended: true }));

auth.register(app, bcrypt);
auth.login(app, bcrypt);
user.user_todos(app);
user.user(app);
user.user_with_data(app);
user.delete_user(app);
user.update_user(app, bcrypt);
todos.todo_init(app);
todos.todo_delete(app);
todos.todo_query(app);
todos.todo_with_id(app);
todos.update_todo(app);

app.listen(PORT, () => {
  console.log(`Serveur open on the port: ${PORT}`);
});
