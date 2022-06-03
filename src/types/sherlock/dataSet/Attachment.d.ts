import Assignment from './Assignment';

export default interface Attachment {
  // fragments
  include: boolean;
  custom: boolean;
  // result
  querySpectrumSignalCount?: number;
  isCompleteSpectralMatch?: boolean;
  rmsd?: number;
  averageDeviation?: number;
  tanimoto?: number;
  setAssignmentsCount?: number;
  spectralMatchAssignment?: Assignment;
  predictionMeta?: { [signalIndex: number]: number[] };
}
