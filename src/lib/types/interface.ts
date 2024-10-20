export interface Ship {
  name: string;
  image?: string;
  size: number;
  color: string;
  designated?: boolean;
  direction?: string
  coords?: Coords
}

interface Coords {
  row: number[]
  column: number[]
}