BEGIN;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET row_security = off;

SET default_tablespace = '';
SET default_table_access_method = heap;

-- TABLES
CREATE TABLE user_account(
   id SERIAL,
   username VARCHAR(50)  NOT NULL,
   email VARCHAR(500)  NOT NULL,
   password VARCHAR(500)  NOT NULL,
   PRIMARY KEY(id),
   UNIQUE(username),
   UNIQUE(email)
);

CREATE TABLE code_language(
   name VARCHAR(50) ,
   PRIMARY KEY(name)
);

CREATE TABLE hashtag(
   name VARCHAR(100) ,
   PRIMARY KEY(name)
);

CREATE TABLE snippet(
   code_snippet SERIAL,
   private_url VARCHAR(500) ,
   title VARCHAR(500)  NOT NULL,
   code VARCHAR(8000)  NOT NULL,
   visibility BOOLEAN,
   description VARCHAR(5000) ,
   id INTEGER NOT NULL,
   name VARCHAR(50)  NOT NULL,
   PRIMARY KEY(code_snippet),
   UNIQUE(private_url),
   FOREIGN KEY(id) REFERENCES user_account(id),
   FOREIGN KEY(name) REFERENCES code_language(name)
);

CREATE TABLE user_likes_snippet(
   id INTEGER,
   code_snippet INTEGER,
   PRIMARY KEY(id, code_snippet),
   FOREIGN KEY(id) REFERENCES user_account(id),
   FOREIGN KEY(code_snippet) REFERENCES snippet(code_snippet)
);

CREATE TABLE filtrer(
   code_snippet INTEGER,
   name VARCHAR(100) ,
   PRIMARY KEY(code_snippet, name),
   FOREIGN KEY(code_snippet) REFERENCES snippet(code_snippet),
   FOREIGN KEY(name) REFERENCES hashtag(name)
);

CREATE TABLE user_comment_snippet(
   id INTEGER,
   code_snippet INTEGER,
   content VARCHAR(5000)  NOT NULL,
   comment_date DATE NOT NULL,
   PRIMARY KEY(id, code_snippet),
   FOREIGN KEY(id) REFERENCES user_account(id),
   FOREIGN KEY(code_snippet) REFERENCES snippet(code_snippet)
);


COMMIT;
