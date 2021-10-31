import { ResultMolecule } from './ResultMolecule';
import { Detections } from './webcase/Detections';

export interface Result {
  queryType: string;
  time: number;
  molecules?: Array<ResultMolecule>;
  detections?: Detections;
  resultID?: string;
}
