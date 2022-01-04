import NeighborsEntry from './NeighborsEntry';

export default interface Neighbors {
  [correlationIndex: number]: NeighborsEntry;
}
