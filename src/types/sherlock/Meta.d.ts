export default interface Meta {
  source: string;
  id: string | number;
  querySpectrumSignalCount: number;
  querySpectrumSignalCountWithEquivalences: number;
  isCompleteSpectralMatch: boolean;
  isCompleteSpectralMatchWithEquivalences: boolean;
  rmsd: number;
  averageDeviation: number;
  tanimoto: number;
  setAssignmentsCount: number;
  setAssignmentsCountWithEquivalences: number;
  smiles: string;
  molfile: string;
  mfOriginal: string;
  title?: string;
}
