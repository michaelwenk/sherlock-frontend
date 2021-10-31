import { DetectedHybridizations } from './DetectedHybridizations';
import { Neighbors } from './Neighbors';

export interface Detections {
  detectedHybridizations: DetectedHybridizations;
  detectedConnectivities: Neighbors;
  forbiddenNeighbors: Neighbors;
  setNeighbors: Neighbors;
}
