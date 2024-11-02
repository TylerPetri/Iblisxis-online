import { relations } from "drizzle-orm/relations";
import { gamePlayers, gamePlayerShips, luShips, gamePlayerShots, games, players } from "./schema";

export const gamePlayerShipsRelations = relations(gamePlayerShips, ({one}) => ({
	gamePlayer: one(gamePlayers, {
		fields: [gamePlayerShips.gameId],
		references: [gamePlayers.gameId]
	}),
	luShip: one(luShips, {
		fields: [gamePlayerShips.shipId],
		references: [luShips.id]
	}),
}));

export const gamePlayersRelations = relations(gamePlayers, ({one, many}) => ({
	gamePlayerShips: many(gamePlayerShips),
	gamePlayerShots: many(gamePlayerShots),
	game: one(games, {
		fields: [gamePlayers.gameId],
		references: [games.id]
	}),
	player: one(players, {
		fields: [gamePlayers.playerId],
		references: [players.id]
	}),
}));

export const luShipsRelations = relations(luShips, ({many}) => ({
	gamePlayerShips: many(gamePlayerShips),
}));

export const gamePlayerShotsRelations = relations(gamePlayerShots, ({one}) => ({
	gamePlayer: one(gamePlayers, {
		fields: [gamePlayerShots.gameId],
		references: [gamePlayers.gameId]
	}),
}));

export const gamesRelations = relations(games, ({many}) => ({
	gamePlayers: many(gamePlayers),
}));

export const playersRelations = relations(players, ({many}) => ({
	gamePlayers: many(gamePlayers),
}));