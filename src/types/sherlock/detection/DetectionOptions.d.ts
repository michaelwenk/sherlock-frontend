export default interface DetectionOptions {
  useHybridizationDetections: boolean;
  useNeighborDetections: boolean;
  hybridizationDetectionThreshold: number;
  lowerElementCountThreshold: number;
  upperElementCountThreshold: number;
  detectFragments: boolean;
  shiftToleranceFragmentDetection: number;
  maximumAverageDeviationFragmentDetection: number;
}
