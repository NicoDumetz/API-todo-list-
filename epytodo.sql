CREATE DATABASE IF NOT EXISTS epytodo;
USE epytodo;

CREATE TABLE IF NOT EXISTS user (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email varchar(255) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  firstname varchar(255) NOT NULL,
  name varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS todo (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title varchar(255) NOT NULL,
  description text NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  due_time datetime NOT NULL,
  user_id int NOT NULL,
  status ENUM('not started', 'todo', 'in progress', 'done') NOT NULL DEFAULT 'not started',
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);
