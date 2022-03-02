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
}
