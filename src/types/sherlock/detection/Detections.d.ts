import DetectedHybridizations from './DetectedHybridizations';
import FixedNeighbors from './FixedNeighbors';
import Neighbors from './Neighbors';

export default interface Detections {
  detectedHybridizations: DetectedHybridizations;
  detectedConnectivities: Neighbors;
  forbiddenNeighbors: Neighbors;
  setNeighbors: Neighbors;
  fixedNeighbors: FixedNeighbors;
}
