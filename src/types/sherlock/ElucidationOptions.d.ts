export default interface ElucidationOptions {
  // PyLSD options
  allowHeteroHeteroBonds: boolean;
  useElim: boolean;
  elimP1: number;
  elimP2: number;
  useFilterLsdRing3: boolean;
  useFilterLsdRing4: boolean;
  // elucidation process
  timeLimitTotal: number;
  // generated structures filter
  shiftTolerance: number;
  maximumAverageDeviation: number;
  predictWithStereo: boolean;

  useCombinatorics: boolean;
}
