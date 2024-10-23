import { Direction } from "./enum";

export interface Ship {
  name: string;
  image?: string;
  size: number;
  color: string;
  designated?: boolean;
  direction?: Direction
  row?: number[]
  col?: number[]
}

export interface EnemyShipPlacement {
  id: number
  ship_name: string
  row: number[]
  col: number[]
  direction: Direction
  player_id: number
  match_id: number
  ships: Ship
}