CREATE TABLE IF NOT EXISTS players (
	id serial NOT NULL UNIQUE,
	name varchar(255) NOT NULL,
	email varchar(255),
	password varchar(255),
	logged_in boolean NOT NULL DEFAULT false,
	user_token varchar(255),
	token_expiration timestamp without time zone,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS matches (
	id serial NOT NULL UNIQUE,
	player1_id bigint NOT NULL,
	player2_id bigint NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS ships (
	id serial NOT NULL UNIQUE,
	name varchar(255) NOT NULL UNIQUE,
	size bigint NOT NULL,
	color varchar(255) NOT NULL UNIQUE,
	PRIMARY KEY (id, name)
);

CREATE TABLE IF NOT EXISTS enemy_ship_placements (
	id serial NOT NULL UNIQUE,
	ship_name varchar(255) NOT NULL UNIQUE,
	row bigint NOT NULL,
	col bigint NOT NULL,
  direction varchar(255) NOT NULL,
	player_id bigint NOT NULL,
	match_id bigint NOT NULL,
	PRIMARY KEY (id)
);


ALTER TABLE matches ADD CONSTRAINT matches_fk1 FOREIGN KEY (player1_id) REFERENCES players(id);

ALTER TABLE matches ADD CONSTRAINT matches_fk2 FOREIGN KEY (player2_id) REFERENCES players(id);

ALTER TABLE enemy_ship_placements ADD CONSTRAINT enemy_ship_placements_fk1 FOREIGN KEY (ship_name) REFERENCES ships(name);

ALTER TABLE enemy_ship_placements ADD CONSTRAINT enemy_ship_placements_fk4 FOREIGN KEY (player_id) REFERENCES players(id);

ALTER TABLE enemy_ship_placements ADD CONSTRAINT enemy_ship_placements_fk5 FOREIGN KEY (match_id) REFERENCES matches(id);