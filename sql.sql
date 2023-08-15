CREATE TABLE mypick.users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  status  VARCHAR(10) NOT NULL ,
  password VARCHAR(255) NOT NULL,
  photo BYTEA,
  token TEXT
);
