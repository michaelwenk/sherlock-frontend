export default interface DereplicationOptions {
  shiftTolerance: number;
  maximumAverageDeviation: number;
  checkMultiplicity: boolean;
  checkEquivalencesCount: boolean;
  useMF: boolean;
}
