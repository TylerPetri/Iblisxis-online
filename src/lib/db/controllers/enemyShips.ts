import { Direction } from '$lib/types/enum'
import type { EnemyShipPlacement } from '$lib/types/interface'

export function enemyShipCoordsFill(ship: EnemyShipPlacement) {
  ship.col = new Array(1).fill(ship.col)
  ship.row = new Array(1).fill(ship.row)
  const shipSize = Number(ship.ships.size)
  if (ship.direction === Direction.horizontal) {
    for (let i = 0; i < shipSize - 1; i++){
      ship.col?.push(ship.col[0] + i + 1)
    }
  }
  if (ship.direction === Direction.vertical) {
    for (let i = 0; i < shipSize - 1; i++){
      ship.row?.push(ship.row[0] + i)
    }
  }
  return ship
}