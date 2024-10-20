export interface EnemyShipPlacements {
  ships: Ship[]
}

interface Ship {
  name: string
  color: string
  size: number
  direction: Direction
  coords: Coords
}

interface Direction {
  horizontal: "horizontal"
  vertical: "vertical"
}

interface Coords {
  row: number[]
  col: number[]
}