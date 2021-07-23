export interface Meta {
  id: string | number;
  querySpectrumSignalCount: number;
  querySpectrumSignalCountWithEquivalences: number;
  isCompleteSpectralMatch: boolean;
  isCompleteSpectralMatchWithEquivalences: boolean;
  rmsd: number;
  averageDeviation: number;
  setAssignmentsCount: number;
  setAssignmentsCountWithEquivalences: number;
  rmsdIncomplete: number;
  averageDeviationIncomplete: number;
  smiles: string;
  mf: string;
  title?: string;
}
