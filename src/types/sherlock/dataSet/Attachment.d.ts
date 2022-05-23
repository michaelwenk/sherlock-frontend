import Assignment from './Assignment';

export default interface Attachment {
  querySpectrumSignalCount: number;
  isCompleteSpectralMatch: boolean;
  rmsd: number;
  averageDeviation: number;
  tanimoto: number;
  setAssignmentsCount: number;
  spectralMatchAssignment: Assignment;
  predictionMeta: { [signalIndex: number]: number[] };
  // for fragments
  include: boolean;
}
