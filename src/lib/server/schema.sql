CREATE EXTENSION postgis;

CREATE TYPE looking_for_game_status_enum AS ENUM ('idle', 'waiting', 'playing');
CREATE TYPE player_order_enum AS ENUM ('player', 'opponent');
CREATE TYPE ship_name_enum AS ENUM ('aircraftCarrier', 'battleship', 'cruiser', 'submarine', 'destroyer');
CREATE TYPE ship_color_enum AS ENUM ('orange', 'red', 'grey', 'green', 'purple');
CREATE TYPE player_shot_result_enum AS ENUM ('miss', 'hit', 'sunk', 'won', 'ERROR');
CREATE TYPE game_status_enum AS ENUM ('ongoing', 'finished');


CREATE TABLE IF NOT EXISTS players (
	id serial NOT NULL UNIQUE,
	name varchar(255) NOT NULL UNIQUE,
	email varchar(255) UNIQUE,
	password varchar(255),
	looking_for_game_status looking_for_game_status_enum NOT NULL DEFAULT 'idle',
	logged_in boolean NOT NULL DEFAULT false,
	user_token varchar(255),
	token_expiration timestamp without time zone,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS game_players (
	game_id bigint NOT NULL,
	player_id bigint NOT NULL,
	score bigint NOT NULL,
	player_order player_order_enum NOT NULL,
	PRIMARY KEY (game_id, player_id)
);

CREATE TABLE IF NOT EXISTS lu_ships (
	id serial NOT NULL UNIQUE,
	name ship_name_enum NOT NULL UNIQUE,
	size bigint NOT NULL CHECK(size <= 5 and size >= 2),
	color ship_color_enum NOT NULL UNIQUE,
	points bigint NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS game_player_ships (
	id serial NOT NULL UNIQUE,
	game_id bigint NOT NULL,
	player_id bigint NOT NULL,
	ship_id bigint NOT NULL,
	line geometry NOT NULL,
	hits bigint NOT NULL DEFAULT 0,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS game_player_shots (
	id serial NOT NULL UNIQUE,
	game_id bigint NOT NULL,
	player_id bigint NOT NULL,
	point geometry NOT NULL,
	result player_shot_result_enum NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS games (
	id serial NOT NULL UNIQUE,
	winner_player_id bigint,
	status game_status_enum NOT NULL DEFAULT 'ongoing',
	PRIMARY KEY (id)
);


ALTER TABLE game_players ADD CONSTRAINT game_players_fk0 FOREIGN KEY (game_id) REFERENCES games(id);
ALTER TABLE game_players ADD CONSTRAINT game_players_fk1 FOREIGN KEY (player_id) REFERENCES players(id);

ALTER TABLE game_player_ships ADD CONSTRAINT game_player_ships_fk1 FOREIGN KEY (game_id, player_id) REFERENCES game_players(game_id, player_id);
ALTER TABLE game_player_ships ADD CONSTRAINT game_player_ships_fk2 FOREIGN KEY (ship_id) REFERENCES lu_ships(id);

ALTER TABLE game_player_shots ADD CONSTRAINT game_player_shots_fk1 FOREIGN KEY (game_id, player_id) REFERENCES game_players(game_id, player_id);
