export default interface NeighborsEntry {
  [neighborAtomType: string]: { [neighborHybridization: number]: number[] };
}
