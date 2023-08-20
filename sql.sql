CREATE TABLE mypick.users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  status  VARCHAR(10) NOT NULL ,
  password VARCHAR(255) NOT NULL,
  photo BYTEA,
  token TEXT
);


CREATE TABLE mypick.category (
  id SERIAL PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  status  VARCHAR(10) NOT NULL 
);
