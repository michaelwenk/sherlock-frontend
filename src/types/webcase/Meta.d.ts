export interface Meta {
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
  mf: string;
  title?: string;
}
