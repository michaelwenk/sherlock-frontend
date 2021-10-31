import { DataSet } from './DataSet';
import { Detections } from './Detections';

export interface Result {
  dataSetList: Array<DataSet>;
  detections: Detections;
}
