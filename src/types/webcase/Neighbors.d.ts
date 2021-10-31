import { NeighborsEntry } from './NeighborsEntry';

export interface Neighbors {
  [correlationIndex: number]: NeighborsEntry;
}
