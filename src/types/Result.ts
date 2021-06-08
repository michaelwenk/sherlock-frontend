import { ResultMolecule } from "./ResultMolecule";

export interface Result {
  molecules: Array<ResultMolecule>
  resultID?: string,
  time?: number,
}