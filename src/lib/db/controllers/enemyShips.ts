import type { Ship } from '$lib/types/interface'
import { Direction } from '$lib/types/enum'

export function enemyShipPlacementController(ship: Ship) {
  if (ship.direction === Direction.horizontal) {
    for (let i = 0; i < ship.size - 1; i++){
      ship.coords?.column.push(ship.coords.column[0] + i + 1)
    }
  }
  if (ship.direction === Direction.vertical) {
    for (let i = 0; i < ship.size - 1; i++){
      ship.coords?.row.push(ship.coords.row[0] + i)
    }
  }
  return ship
}