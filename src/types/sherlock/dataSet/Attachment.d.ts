import Assignment from './Assignment';

export default interface Attachment {
  querySpectrumSignalCount: number;
  querySpectrumSignalCountWithEquivalences: number;
  isCompleteSpectralMatch: boolean;
  isCompleteSpectralMatchWithEquivalences: boolean;
  rmsd: number;
  averageDeviation: number;
  tanimoto: number;
  setAssignmentsCount: number;
  setAssignmentsCountWithEquivalences: number;
  spectralMatchAssignment: Assignment;
  predictionMeta: { [signalIndex: number]: number[] };
  // functional groups
  count: number;
  total: number;
  include: boolean;
}
