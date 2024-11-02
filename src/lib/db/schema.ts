import { pgTable, check, varchar, foreignKey, serial, bigint, unique, boolean, timestamp, primaryKey, pgEnum, line, point } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const gameStatusEnum = pgEnum("game_status_enum", ['ongoing', 'finished'])
export const lookingForGameStatusEnum = pgEnum("looking_for_game_status_enum", ['idle', 'waiting', 'playing'])
export const playerOrderEnum = pgEnum("player_order_enum", ['player', 'opponent'])
export const playerShotResultEnum = pgEnum("player_shot_result_enum", ['miss', 'hit', 'sunk', 'won', 'ERROR'])
export const shipColorEnum = pgEnum("ship_color_enum", ['orange', 'red', 'grey', 'green', 'purple'])
export const shipNameEnum = pgEnum("ship_name_enum", ['aircraftCarrier', 'battleship', 'cruiser', 'submarine', 'destroyer'])

export const gamePlayerShips = pgTable("game_player_ships", {
	id: serial().primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	gameId: bigint("game_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	playerId: bigint("player_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	shipId: bigint("ship_id", { mode: "number" }).notNull(),
	line: line().notNull(),
	lineObj: point({ mode: 'xy' }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	hits: bigint({ mode: "number" }).default(0).notNull(),
}, (table) => {
	return {
		gamePlayerShipsFk1: foreignKey({
			columns: [table.gameId, table.playerId],
			foreignColumns: [gamePlayers.gameId, gamePlayers.playerId],
			name: "game_player_ships_fk1"
		}),
		gamePlayerShipsFk2: foreignKey({
			columns: [table.shipId],
			foreignColumns: [luShips.id],
			name: "game_player_ships_fk2"
		}),
	}
});

export const gamePlayerShots = pgTable("game_player_shots", {
	id: serial().primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	gameId: bigint("game_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	playerId: bigint("player_id", { mode: "number" }).notNull(),
	point: point().notNull(),
	pointObj: point({ mode: 'xy' }).notNull(),
	result: playerShotResultEnum().notNull(),
}, (table) => {
	return {
		gamePlayerShotsFk1: foreignKey({
			columns: [table.gameId, table.playerId],
			foreignColumns: [gamePlayers.gameId, gamePlayers.playerId],
			name: "game_player_shots_fk1"
		}),
	}
});

export const luShips = pgTable("lu_ships", {
	id: serial().primaryKey().notNull(),
	name: shipNameEnum().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	size: bigint({ mode: "number" }).notNull(),
	color: shipColorEnum().notNull(),
}, (table) => {
	return {
		luShipsNameKey: unique("lu_ships_name_key").on(table.name),
		luShipsColorKey: unique("lu_ships_color_key").on(table.color),
		luShipsSizeCheck: check("lu_ships_size_check", sql`(size <= 5) AND (size >= 2)`),
	}
});

export const games = pgTable("games", {
	id: serial().primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	winnerPlayerId: bigint("winner_player_id", { mode: "number" }),
	status: gameStatusEnum().default('ongoing').notNull(),
});

export const players = pgTable("players", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }),
	password: varchar({ length: 255 }),
	lookingForGameStatus: lookingForGameStatusEnum("looking_for_game_status").default('idle').notNull(),
	loggedIn: boolean("logged_in").default(false).notNull(),
	userToken: varchar("user_token", { length: 255 }),
	tokenExpiration: timestamp("token_expiration", { mode: 'string' }),
}, (table) => {
	return {
		playersNameKey: unique("players_name_key").on(table.name),
		playersEmailKey: unique("players_email_key").on(table.email),
	}
});

export const gamePlayers = pgTable("game_players", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	gameId: bigint("game_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	playerId: bigint("player_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	score: bigint({ mode: "number" }).notNull(),
	playerOrder: playerOrderEnum("player_order").notNull(),
}, (table) => {
	return {
		gamePlayersFk0: foreignKey({
			columns: [table.gameId],
			foreignColumns: [games.id],
			name: "game_players_fk0"
		}),
		gamePlayersFk1: foreignKey({
			columns: [table.playerId],
			foreignColumns: [players.id],
			name: "game_players_fk1"
		}),
		gamePlayersPkey: primaryKey({ columns: [table.gameId, table.playerId], name: "game_players_pkey"}),
	}
});
