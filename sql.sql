 -- mypick.bookmarks definition

-- Drop table

-- DROP TABLE mypick.bookmarks;

CREATE TABLE mypick.bookmarks (
	id_bookmarks serial NOT NULL,
	id_pick int4 NULL,
	id_user int4 NULL,
	update_at timestamptz(0) NOT NULL,
	CONSTRAINT bookmarks_pkey PRIMARY KEY (id_bookmarks)
);

-- Table Triggers

create trigger update_bookmark_trigger before
update
    on
    mypick.bookmarks for each row execute function mypick.update_bookmark_update_at();


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


-- mypick.comentario definition

-- Drop table

-- DROP TABLE mypick.comentario;

CREATE TABLE mypick.comentario (
	id serial NOT NULL,
	id_pick int4 NULL,
	id_user int4 NULL,
	contenido text NULL,
	username text NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT comentario_pkey PRIMARY KEY (id)
);


-- mypick.picks definition

-- Drop table

-- DROP TABLE mypick.picks;

CREATE TABLE mypick.picks (
	id_pick serial NOT NULL,
	id_category varchar(10) NOT NULL,
	id_choice1 int4 NOT NULL,
	id_choice2 int4 NOT NULL,
	likes int4 NULL,
	status varchar(10) NULL,
	id_user int4 NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	picks int4 NULL,
	update_at timestamptz(0) NULL,
	CONSTRAINT picks_pkey PRIMARY KEY (id_pick)
);

-- Table Triggers

create trigger update_picks_trigger before
update
    on
    mypick.picks for each row execute function mypick.update_picks_update_at();


-- mypick.users definition

-- Drop table

-- DROP TABLE mypick.users;

CREATE TABLE mypick.users (
	id serial NOT NULL,
	full_name varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	status varchar(10) NOT NULL,
	"password" varchar(255) NOT NULL,
	photo text NULL,
	"token" text NULL,
	username varchar NULL,
	origin varchar(50) NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);


-- mypick.vote_pick definition

-- Drop table

-- DROP TABLE mypick.vote_pick;

CREATE TABLE mypick.vote_pick (
	id serial NOT NULL,
	id_pick int4 NULL,
	id_choice int4 NULL,
	id_user int4 NULL,
	update_at timestamptz(0) NOT NULL,
	CONSTRAINT uc_vote_pick_user_pick UNIQUE (id_user, id_pick)
);


-- mypick.reply definition

-- Drop table

-- DROP TABLE mypick.reply;

CREATE TABLE mypick.reply (
	id serial NOT NULL,
	comentario_id int4 NULL,
	contenido text NULL,
	username text NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	foto varchar(100) NULL,
	CONSTRAINT reply_pkey PRIMARY KEY (id),
	CONSTRAINT reply_comentario_id_fkey FOREIGN KEY (comentario_id) REFERENCES mypick.comentario(id)
);

CREATE TABLE mypick.comments_like_byuser (
    id SERIAL PRIMARY KEY,
    id_pick INTEGER,
    id_user INTEGER,
    coment_id_like TEXT[]
);

  
CREATE TABLE mypick.pick_like_byuser (
	id serial NOT NULL,
	ip text NULL,
	id_user int4 NULL,
	id_pick_like _text NULL
);

CREATE OR REPLACE FUNCTION mypick.calcular_diferencia_(fecha2 timestamp without time zone, OUT dias integer, OUT horas integer, OUT minutos integer)
 RETURNS record
 LANGUAGE plpgsql
AS $function$
DECLARE
    fecha1 timestamp := now();
    diff_interval interval;
BEGIN
    diff_interval := fecha1- fecha2;
    dias := EXTRACT(DAY FROM diff_interval);
    horas := EXTRACT(HOUR FROM diff_interval);
    minutos := EXTRACT(MINUTE FROM diff_interval);
END;
$function$
;

CREATE OR REPLACE FUNCTION mypick.update_bookmark_update_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.update_at = now();
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION mypick.update_picks_update_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.update_at = now();
    RETURN NEW;
END;
$function$
;


CREATE OR REPLACE FUNCTION mypick.actualizar_coment_id_like(p_id_pick INTEGER, p_id_user INTEGER, p_coment_id_like TEXT[])
RETURNS VOID AS
$$
BEGIN
    UPDATE mypick.comments_like_byuser
    SET coment_id_like = p_coment_id_like
    WHERE id_pick = p_id_pick AND id_user = p_id_user;
    
    IF NOT FOUND THEN
        INSERT INTO mypick.comments_like_byuser (id_pick, id_user, coment_id_like)
        VALUES (p_id_pick, p_id_user, p_coment_id_like);
    END IF;
     
END;
$$
LANGUAGE plpgsql;

       
CREATE OR REPLACE FUNCTION mypick.actualizar_id_like(ip_en text, p_id_user integer, id_like text[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE mypick.pick_like_byuser
    SET  id_pick_like = id_like, id_user = p_id_user, ip = ip_en
    WHERE ip = ip_en OR id_user = p_id_user;
    
    IF NOT FOUND THEN
        INSERT INTO mypick.pick_like_byuser (ip, id_user, id_pick_like)
        VALUES (ip_en, p_id_user, id_like);
    END IF;
     
END;
$function$
;
