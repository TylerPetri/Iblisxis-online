-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."game_status_enum" AS ENUM('ongoing', 'finished');--> statement-breakpoint
CREATE TYPE "public"."looking_for_game_status_enum" AS ENUM('idle', 'waiting', 'playing');--> statement-breakpoint
CREATE TYPE "public"."player_order_enum" AS ENUM('player', 'opponent');--> statement-breakpoint
CREATE TYPE "public"."player_shot_result_enum" AS ENUM('miss', 'hit', 'sunk', 'won', 'ERROR');--> statement-breakpoint
CREATE TYPE "public"."ship_color_enum" AS ENUM('orange', 'red', 'grey', 'green', 'purple');--> statement-breakpoint
CREATE TYPE "public"."ship_name_enum" AS ENUM('aircraftCarrier', 'battleship', 'cruiser', 'submarine', 'destroyer');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spatial_ref_sys" (
	"srid" integer NOT NULL,
	"auth_name" varchar(256),
	"auth_srid" integer,
	"srtext" varchar(2048),
	"proj4text" varchar(2048),
	CONSTRAINT "spatial_ref_sys_srid_check" CHECK ((srid > 0) AND (srid <= 998999))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "game_player_ships" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" bigint NOT NULL,
	"player_id" bigint NOT NULL,
	"ship_id" bigint NOT NULL,
	"line" "geometry" NOT NULL,
	"hits" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "game_player_shots" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" bigint NOT NULL,
	"player_id" bigint NOT NULL,
	"point" "geometry" NOT NULL,
	"result" "player_shot_result_enum" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lu_ships" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" "ship_name_enum" NOT NULL,
	"size" bigint NOT NULL,
	"color" "ship_color_enum" NOT NULL,
	"points" bigint NOT NULL,
	CONSTRAINT "lu_ships_name_key" UNIQUE("name"),
	CONSTRAINT "lu_ships_color_key" UNIQUE("color"),
	CONSTRAINT "lu_ships_size_check" CHECK ((size <= 5) AND (size >= 2))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "games" (
	"id" serial PRIMARY KEY NOT NULL,
	"winner_player_id" bigint,
	"status" "game_status_enum" DEFAULT 'ongoing' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"password" varchar(255),
	"looking_for_game_status" "looking_for_game_status_enum" DEFAULT 'idle' NOT NULL,
	"logged_in" boolean DEFAULT false NOT NULL,
	"user_token" varchar(255),
	"token_expiration" timestamp,
	CONSTRAINT "players_name_key" UNIQUE("name"),
	CONSTRAINT "players_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "game_players" (
	"game_id" bigint NOT NULL,
	"player_id" bigint NOT NULL,
	"score" bigint NOT NULL,
	"player_order" "player_order_enum" NOT NULL,
	CONSTRAINT "game_players_pkey" PRIMARY KEY("game_id","player_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_player_ships" ADD CONSTRAINT "game_player_ships_fk1" FOREIGN KEY ("game_id","player_id") REFERENCES "public"."game_players"("game_id","player_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_player_ships" ADD CONSTRAINT "game_player_ships_fk2" FOREIGN KEY ("ship_id") REFERENCES "public"."lu_ships"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_player_shots" ADD CONSTRAINT "game_player_shots_fk1" FOREIGN KEY ("game_id","player_id") REFERENCES "public"."game_players"("game_id","player_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_players" ADD CONSTRAINT "game_players_fk0" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_players" ADD CONSTRAINT "game_players_fk1" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE VIEW "public"."geography_columns" AS (SELECT current_database() AS f_table_catalog, n.nspname AS f_table_schema, c.relname AS f_table_name, a.attname AS f_geography_column, postgis_typmod_dims(a.atttypmod) AS coord_dimension, postgis_typmod_srid(a.atttypmod) AS srid, postgis_typmod_type(a.atttypmod) AS type FROM pg_class c, pg_attribute a, pg_type t, pg_namespace n WHERE t.typname = 'geography'::name AND a.attisdropped = false AND a.atttypid = t.oid AND a.attrelid = c.oid AND c.relnamespace = n.oid AND (c.relkind = ANY (ARRAY['r'::"char", 'v'::"char", 'm'::"char", 'f'::"char", 'p'::"char"])) AND NOT pg_is_other_temp_schema(c.relnamespace) AND has_table_privilege(c.oid, 'SELECT'::text));--> statement-breakpoint
CREATE VIEW "public"."geometry_columns" AS (SELECT current_database()::character varying(256) AS f_table_catalog, n.nspname AS f_table_schema, c.relname AS f_table_name, a.attname AS f_geometry_column, COALESCE(postgis_typmod_dims(a.atttypmod), sn.ndims, 2) AS coord_dimension, COALESCE(NULLIF(postgis_typmod_srid(a.atttypmod), 0), sr.srid, 0) AS srid, replace(replace(COALESCE(NULLIF(upper(postgis_typmod_type(a.atttypmod)), 'GEOMETRY'::text), st.type, 'GEOMETRY'::text), 'ZM'::text, ''::text), 'Z'::text, ''::text)::character varying(30) AS type FROM pg_class c JOIN pg_attribute a ON a.attrelid = c.oid AND NOT a.attisdropped JOIN pg_namespace n ON c.relnamespace = n.oid JOIN pg_type t ON a.atttypid = t.oid LEFT JOIN ( SELECT s.connamespace, s.conrelid, s.conkey, replace(split_part(s.consrc, ''''::text, 2), ')'::text, ''::text) AS type FROM ( SELECT pg_constraint.connamespace, pg_constraint.conrelid, pg_constraint.conkey, pg_get_constraintdef(pg_constraint.oid) AS consrc FROM pg_constraint) s WHERE s.consrc ~~* '%geometrytype(% = %'::text) st ON st.connamespace = n.oid AND st.conrelid = c.oid AND (a.attnum = ANY (st.conkey)) LEFT JOIN ( SELECT s.connamespace, s.conrelid, s.conkey, replace(split_part(s.consrc, ' = '::text, 2), ')'::text, ''::text)::integer AS ndims FROM ( SELECT pg_constraint.connamespace, pg_constraint.conrelid, pg_constraint.conkey, pg_get_constraintdef(pg_constraint.oid) AS consrc FROM pg_constraint) s WHERE s.consrc ~~* '%ndims(% = %'::text) sn ON sn.connamespace = n.oid AND sn.conrelid = c.oid AND (a.attnum = ANY (sn.conkey)) LEFT JOIN ( SELECT s.connamespace, s.conrelid, s.conkey, replace(replace(split_part(s.consrc, ' = '::text, 2), ')'::text, ''::text), '('::text, ''::text)::integer AS srid FROM ( SELECT pg_constraint.connamespace, pg_constraint.conrelid, pg_constraint.conkey, pg_get_constraintdef(pg_constraint.oid) AS consrc FROM pg_constraint) s WHERE s.consrc ~~* '%srid(% = %'::text) sr ON sr.connamespace = n.oid AND sr.conrelid = c.oid AND (a.attnum = ANY (sr.conkey)) WHERE (c.relkind = ANY (ARRAY['r'::"char", 'v'::"char", 'm'::"char", 'f'::"char", 'p'::"char"])) AND NOT c.relname = 'raster_columns'::name AND t.typname = 'geometry'::name AND NOT pg_is_other_temp_schema(c.relnamespace) AND has_table_privilege(c.oid, 'SELECT'::text));
*/