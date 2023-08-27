-- mypick.category definition

-- Drop table

-- DROP TABLE mypick.category;

CREATE TABLE mypick.category (
	id serial NOT NULL,
	"name" varchar(255) NOT NULL,
	status varchar(10) NOT NULL,
	picks varchar NULL,
	CONSTRAINT category_pkey PRIMARY KEY (id)
);
-- mypick.choice definition

-- Drop table

-- DROP TABLE mypick.choice;

CREATE TABLE mypick.choice (
	id_choice serial NOT NULL,
	name_choice varchar(255) NOT NULL,
	photo_choice text NULL,
	selected numeric NULL,
	origin text NULL,
	CONSTRAINT choice_pkey PRIMARY KEY (id_choice)
);
-- mypick."comments" definition

-- Drop table

-- DROP TABLE mypick."comments";

CREATE TABLE mypick."comments" (
	id_comments serial NOT NULL,
	id_pick varchar(10) NOT NULL,
	text_comments varchar(255) NULL,
	likes varchar(10) NOT NULL,
	status varchar(10) NOT NULL,
	id_reply varchar(10) NOT NULL,
	CONSTRAINT comments_pkey PRIMARY KEY (id_comments)
);
-- mypick.picks definition

-- Drop table

-- DROP TABLE mypick.picks;

CREATE TABLE mypick.picks (
	id_pick serial NOT NULL,
	id_category varchar(10) NOT NULL,
	id_choice1 int4 NOT NULL,
	id_choice2 int4 NOT NULL,
	likes varchar(10) NULL,
	status varchar(10) NULL,
	id_user int4 NULL,
	CONSTRAINT picks_pkey PRIMARY KEY (id_pick)
);

-- mypick.users definition

-- .
Drop table

-- DROP TABLE mypick.users;

CREATE TABLE mypick.users (
	id serial NOT NULL,
	full_name varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	status varchar(10) NOT NULL,
	"password" varchar(255) NOT NULL,
	photo text NULL,
	"token" text NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);


-- mypick.bookmarks definition

-- .
Drop table

-- DROP TABLE mypick.bookmarks;

CREATE TABLE mypick.bookmarks (
	id_bookmarks serial NOT NULL,
	id_pick  integer, 
	id_user int4 NULL,
	CONSTRAINT bookmarks_pkey PRIMARY KEY (id_bookmarks)
);
