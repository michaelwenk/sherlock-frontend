export default interface DereplicationOptions {
  shiftTolerance: number;
  maxAverageDeviation: number;
  checkMultiplicity: boolean;
  checkEquivalencesCount: boolean;
  useMF: boolean;
}
