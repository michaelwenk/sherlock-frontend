export interface NeighborsEntry {
  [neighborAtomType: string]: { [neighborHybridization: number]: number[] };
}
